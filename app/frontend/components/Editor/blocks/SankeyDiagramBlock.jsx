import { useState, useMemo } from "react";
import { colors, typography } from "../../../styles/tokens";
import { PALETTE } from "../../../lib/chartUtils";

export function SankeyDiagramBlock({ block }) {
  const d = block.data || {};
  const nodes = d.nodes || [];
  const links = d.links || [];
  const title = d.title || "";
  const [hoveredLink, setHoveredLink] = useState(null);

  if (!nodes.length || !links.length) {
    return (
      <div style={{ padding: 32, textAlign: "center", color: colors.text.muted, fontFamily: typography.fontFamily.body, fontSize: 13 }}>
        Aucune donnée
      </div>
    );
  }

  const W = 500, H = 300;
  const MARGIN = { top: 24, right: 60, bottom: 12, left: 60 };
  const plotW = W - MARGIN.left - MARGIN.right;
  const plotH = H - MARGIN.top - MARGIN.bottom;

  // Assign columns: simple left→right layering
  const layout = useMemo(() => {
    // Determine layers: source nodes in col 0, targets in col 1
    // For multi-layer, we detect chains
    const nodeSet = new Set(nodes.map((_, i) => i));
    const targets = new Set(links.map((l) => l.target));
    const sources = new Set(links.map((l) => l.source));
    const leftNodes = [...nodeSet].filter((i) => !targets.has(i));
    const rightNodes = [...nodeSet].filter((i) => !leftNodes.includes(i));

    // If we have neither, just split evenly
    const cols = new Map();
    if (leftNodes.length === 0) {
      nodes.forEach((_, i) => cols.set(i, i < nodes.length / 2 ? 0 : 1));
    } else {
      leftNodes.forEach((i) => cols.set(i, 0));
      rightNodes.forEach((i) => cols.set(i, 1));
    }

    const maxCol = Math.max(...cols.values()) || 1;
    const colWidth = plotW / (maxCol + 1);

    // Stack nodes by column
    const colNodes = {};
    for (const [ni, col] of cols) {
      if (!colNodes[col]) colNodes[col] = [];
      colNodes[col].push(ni);
    }

    // Compute node sizes based on total flow
    const nodeFlow = nodes.map((_, i) => {
      const outFlow = links.filter((l) => l.source === i).reduce((s, l) => s + (l.value || 0), 0);
      const inFlow = links.filter((l) => l.target === i).reduce((s, l) => s + (l.value || 0), 0);
      return Math.max(outFlow, inFlow, 1);
    });
    const maxFlow = Math.max(...Object.values(colNodes).map((ns) => ns.reduce((s, ni) => s + nodeFlow[ni], 0)));
    const flowScale = maxFlow > 0 ? plotH / maxFlow : 1;

    // Position nodes
    const nodePos = [];
    for (const col of Object.keys(colNodes).sort((a, b) => a - b)) {
      const ns = colNodes[col];
      const totalH = ns.reduce((s, ni) => s + nodeFlow[ni] * flowScale, 0);
      const gap = ns.length > 1 ? Math.min(12, (plotH - totalH) / (ns.length - 1)) : 0;
      let y = MARGIN.top + (plotH - totalH - gap * (ns.length - 1)) / 2;
      for (const ni of ns) {
        const h = nodeFlow[ni] * flowScale;
        nodePos[ni] = { x: MARGIN.left + parseInt(col) * colWidth, y, h, col: parseInt(col) };
        y += h + gap;
      }
    }

    return { nodePos, colWidth: Math.min(16, colWidth * 0.15), maxCol };
  }, [nodes, links, plotW, plotH]);

  const { nodePos, colWidth: nodeW, maxCol } = layout;

  // Build link paths
  const linkPaths = useMemo(() => {
    // Track vertical offsets per node for stacking links
    const srcOffsets = nodes.map(() => 0);
    const tgtOffsets = nodes.map(() => 0);
    const maxFlow = Math.max(...nodes.map((_, i) => {
      return Math.max(
        links.filter(l => l.source === i).reduce((s, l) => s + (l.value || 0), 0),
        links.filter(l => l.target === i).reduce((s, l) => s + (l.value || 0), 0),
        1
      );
    }));
    const flowScale = maxFlow > 0 ? (nodePos[0]?.h || 40) / Math.max(...links.filter(l => l.source === 0).map(l => l.value || 0).concat([1])) : 1;

    return links.map((link, li) => {
      const s = nodePos[link.source];
      const t = nodePos[link.target];
      if (!s || !t) return null;

      const val = link.value || 1;
      const totalSrc = links.filter(l => l.source === link.source).reduce((sum, l) => sum + (l.value || 0), 0);
      const totalTgt = links.filter(l => l.target === link.target).reduce((sum, l) => sum + (l.value || 0), 0);
      const thickness = Math.max(2, (val / Math.max(totalSrc, 1)) * s.h);

      const sy = s.y + srcOffsets[link.source];
      const ty = t.y + tgtOffsets[link.target];
      srcOffsets[link.source] += thickness;
      tgtOffsets[link.target] += (val / Math.max(totalTgt, 1)) * t.h;

      const sx = s.x + nodeW;
      const tx = t.x;
      const cp = (tx - sx) * 0.5;

      return {
        path: `M${sx},${sy} C${sx + cp},${sy} ${tx - cp},${ty} ${tx},${ty} v${Math.max(2, (val / Math.max(totalTgt, 1)) * t.h)} C${tx - cp},${ty + (val / Math.max(totalTgt, 1)) * t.h} ${sx + cp},${sy + thickness} ${sx},${sy + thickness} Z`,
        color: nodes[link.source]?.color || PALETTE[link.source % PALETTE.length],
        link, idx: li, thickness,
      };
    }).filter(Boolean);
  }, [links, nodes, nodePos, nodeW]);

  return (
    <div style={{ padding: "12px 0", fontFamily: typography.fontFamily.body }}>
      {title && (
        <div style={{ fontSize: 15, fontWeight: 700, color: colors.text.primary, marginBottom: 12, fontFamily: typography.fontFamily.heading }}>
          {title}
        </div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
        {/* Links */}
        {linkPaths.map((lp) => (
          <path key={lp.idx} d={lp.path} fill={lp.color}
            opacity={hoveredLink === null ? 0.35 : hoveredLink === lp.idx ? 0.7 : 0.08}
            style={{ transition: "opacity 0.12s", cursor: "default" }}
            onMouseEnter={() => setHoveredLink(lp.idx)}
            onMouseLeave={() => setHoveredLink(null)}
          />
        ))}
        {/* Nodes */}
        {nodePos.map((pos, ni) => {
          if (!pos) return null;
          const node = nodes[ni];
          const color = node?.color || PALETTE[ni % PALETTE.length];
          const labelX = pos.col === maxCol ? pos.x + nodeW + 6 : pos.x - 6;
          const anchor = pos.col === maxCol ? "start" : "end";
          return (
            <g key={ni}>
              <rect x={pos.x} y={pos.y} width={nodeW} height={Math.max(4, pos.h)} rx={3}
                fill={color} opacity={0.9} />
              <text x={labelX} y={pos.y + pos.h / 2 + 4} fontSize={10}
                fill={colors.text.secondary} textAnchor={anchor}
                fontFamily={typography.fontFamily.body} fontWeight={600}>
                {node?.label || `N${ni}`}
              </text>
            </g>
          );
        })}

        {/* Tooltip */}
        {hoveredLink !== null && (() => {
          const link = links[hoveredLink];
          if (!link) return null;
          const srcLabel = nodes[link.source]?.label || `N${link.source}`;
          const tgtLabel = nodes[link.target]?.label || `N${link.target}`;
          const text = `${srcLabel} → ${tgtLabel}: ${link.value}`;
          const tw = Math.max(100, text.length * 5.5 + 16);
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
