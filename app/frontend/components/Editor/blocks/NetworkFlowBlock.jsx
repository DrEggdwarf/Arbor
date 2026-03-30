import { useState, useMemo } from "react";
import { colors, typography, radii } from "../../../styles/tokens";
import { PALETTE } from "../../../lib/chartUtils";

/**
 * NetworkFlowBlock — Sankey-like diagram specialised for network traffic.
 * Nodes are IPs/services, links are traffic flows with volume + protocol.
 */
export function NetworkFlowBlock({ block, accentColor }) {
  const d = block.data || {};
  const accent = accentColor || colors.accentBright;
  const nodes = d.nodes || [];
  const links = d.links || [];
  const [hoveredLink, setHoveredLink] = useState(null);

  const W = 520, H = 300;
  const MARGIN = { top: 24, right: 70, bottom: 12, left: 70 };
  const plotW = W - MARGIN.left - MARGIN.right;
  const plotH = H - MARGIN.top - MARGIN.bottom;

  const layout = useMemo(() => {
    if (!nodes.length || !links.length) return null;

    // Determine layers: nodes with no incoming = col 0, rest = col 1
    const targets = new Set(links.map((l) => l.target));
    const sources = new Set(links.map((l) => l.source));
    const leftNodes = nodes.map((_, i) => i).filter((i) => !targets.has(i));
    const rightNodes = nodes.map((_, i) => i).filter((i) => !leftNodes.includes(i));
    if (leftNodes.length === 0) {
      nodes.forEach((_, i) => { (i < nodes.length / 2 ? leftNodes : rightNodes).push(i); });
    }

    const cols = new Map();
    leftNodes.forEach((i) => cols.set(i, 0));
    rightNodes.forEach((i) => cols.set(i, 1));

    // Node flow totals
    const nodeFlow = nodes.map((_, i) => {
      const out = links.filter((l) => l.source === i).reduce((s, l) => s + (l.value || 0), 0);
      const inc = links.filter((l) => l.target === i).reduce((s, l) => s + (l.value || 0), 0);
      return Math.max(out, inc, 1);
    });

    const colNodes = { 0: leftNodes, 1: rightNodes };
    const maxColFlow = Math.max(
      leftNodes.reduce((s, ni) => s + nodeFlow[ni], 0),
      rightNodes.reduce((s, ni) => s + nodeFlow[ni], 0),
    );
    const flowScale = maxColFlow > 0 ? plotH / maxColFlow : 1;

    // Position nodes
    const nodePos = [];
    for (const col of [0, 1]) {
      const ns = colNodes[col] || [];
      const totalH = ns.reduce((s, ni) => s + nodeFlow[ni] * flowScale, 0);
      const gap = ns.length > 1 ? Math.min(12, (plotH - totalH) / (ns.length - 1)) : 0;
      let y = MARGIN.top + (plotH - totalH - gap * (ns.length - 1)) / 2;
      for (const ni of ns) {
        const h = nodeFlow[ni] * flowScale;
        nodePos[ni] = { x: MARGIN.left + col * plotW, y, h, col };
        y += h + gap;
      }
    }

    return { nodePos, nodeFlow };
  }, [nodes, links, plotW, plotH]);

  if (!layout) {
    return (
      <div style={{ fontFamily: typography.fontFamily.body, fontSize: 12, color: colors.text.muted, fontStyle: "italic", padding: 20, textAlign: "center" }}>
        Aucun flux réseau défini.
      </div>
    );
  }

  const { nodePos } = layout;
  const nodeW = 14;

  // Build link paths
  const linkPaths = useMemo(() => {
    const srcOffsets = nodes.map(() => 0);
    const tgtOffsets = nodes.map(() => 0);

    return links.map((link, li) => {
      const s = nodePos[link.source];
      const t = nodePos[link.target];
      if (!s || !t) return null;

      const val = link.value || 1;
      const totalSrc = links.filter((l) => l.source === link.source).reduce((sum, l) => sum + (l.value || 0), 0);
      const totalTgt = links.filter((l) => l.target === link.target).reduce((sum, l) => sum + (l.value || 0), 0);
      const thickness = Math.max(2, (val / Math.max(totalSrc, 1)) * s.h);
      const tThickness = Math.max(2, (val / Math.max(totalTgt, 1)) * t.h);

      const sy = s.y + srcOffsets[link.source];
      const ty = t.y + tgtOffsets[link.target];
      srcOffsets[link.source] += thickness;
      tgtOffsets[link.target] += tThickness;

      const sx = s.x + nodeW;
      const tx = t.x;
      const cp = (tx - sx) * 0.5;

      return {
        path: `M${sx},${sy} C${sx + cp},${sy} ${tx - cp},${ty} ${tx},${ty} v${tThickness} C${tx - cp},${ty + tThickness} ${sx + cp},${sy + thickness} ${sx},${sy + thickness} Z`,
        color: link.color || nodes[link.source]?.color || PALETTE[link.source % PALETTE.length],
        link, idx: li,
      };
    }).filter(Boolean);
  }, [links, nodes, nodePos, nodeW]);

  return (
    <div style={styles.card}>
      {d.title && <h3 style={{ ...styles.title, borderBottomColor: accent }}>{d.title}</h3>}

      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
        {/* Link paths */}
        {linkPaths.map((lp) => (
          <path key={lp.idx} d={lp.path} fill={lp.color}
            opacity={hoveredLink === null ? 0.3 : hoveredLink === lp.idx ? 0.65 : 0.06}
            style={{ transition: "opacity 0.12s", cursor: "default" }}
            onMouseEnter={() => setHoveredLink(lp.idx)}
            onMouseLeave={() => setHoveredLink(null)} />
        ))}

        {/* Nodes */}
        {nodePos.map((pos, ni) => {
          if (!pos) return null;
          const node = nodes[ni];
          const color = node?.color || PALETTE[ni % PALETTE.length];
          const isRight = pos.col === 1;
          const labelX = isRight ? pos.x + nodeW + 6 : pos.x - 6;
          const anchor = isRight ? "start" : "end";
          return (
            <g key={ni}>
              <rect x={pos.x} y={pos.y} width={nodeW} height={Math.max(4, pos.h)} rx={3}
                fill={color} opacity={0.85} />
              <text x={labelX} y={pos.y + pos.h / 2 + 4} fontSize={10}
                fill={colors.text.secondary} textAnchor={anchor}
                fontFamily={typography.fontFamily.body} fontWeight={600}>
                {node?.label || `N${ni}`}
              </text>
              {node?.sublabel && (
                <text x={labelX} y={pos.y + pos.h / 2 + 14} fontSize={7}
                  fill={colors.text.muted} textAnchor={anchor}
                  fontFamily={typography.fontFamily.body}>
                  {node.sublabel}
                </text>
              )}
            </g>
          );
        })}

        {/* Tooltip */}
        {hoveredLink !== null && (() => {
          const link = links[hoveredLink];
          if (!link) return null;
          const srcLabel = nodes[link.source]?.label || `N${link.source}`;
          const tgtLabel = nodes[link.target]?.label || `N${link.target}`;
          const proto = link.protocol ? ` (${link.protocol})` : "";
          const text = `${srcLabel} → ${tgtLabel}: ${link.value}${proto}`;
          const tw = Math.max(120, text.length * 5.5 + 16);
          return (
            <g>
              <rect x={W / 2 - tw / 2} y={6} width={tw} height={20} rx={6}
                fill={colors.text.primary} opacity={0.9} />
              <text x={W / 2} y={19} fontSize={10} fill="#fff" textAnchor="middle"
                fontFamily={typography.fontFamily.body}>{text}</text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.lg,
    padding: 20,
    fontFamily: typography.fontFamily.body,
  },
  title: {
    margin: "0 0 12px 0",
    fontFamily: typography.fontFamily.heading,
    fontSize: 18,
    color: colors.text.primary,
    borderBottom: "2px solid",
    paddingBottom: 8,
  },
};
