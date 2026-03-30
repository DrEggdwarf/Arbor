import { useMemo } from "react";
import { colors, typography, radii } from "../../../styles/tokens";

const NODE_TYPES = {
  entry:    { shape: "circle",  defaultColor: "#3498db" },
  server:   { shape: "rect",    defaultColor: "#e67e22" },
  database: { shape: "rect",    defaultColor: "#9b59b6" },
  user:     { shape: "circle",  defaultColor: "#2ecc71" },
  target:   { shape: "diamond", defaultColor: "#e74c3c" },
  service:  { shape: "rect",    defaultColor: "#1abc9c" },
};

/* Compute the visual radius of a node (distance from center to edge) along a given direction */
function nodeRadius(node, angle) {
  const nt = NODE_TYPES[node.type] || NODE_TYPES.service;
  if (nt.shape === "circle") return 20;
  if (nt.shape === "diamond") return 24;
  // rect — half-width / half-height along angle
  const w = Math.max(60, (node.label || "").length * 7 + 16) / 2 + 4;
  const h = 20;
  const cos = Math.abs(Math.cos(angle));
  const sin = Math.abs(Math.sin(angle));
  if (cos < 0.001) return h;
  if (sin < 0.001) return w;
  return Math.min(w / cos, h / sin);
}

function layoutNodes(nodes, edges) {
  if (!nodes.length) return [];

  const adjMap = {};
  nodes.forEach((n) => { adjMap[n.id] = []; });
  edges.forEach((e) => {
    if (adjMap[e.source]) adjMap[e.source].push(e.target);
  });

  // BFS to compute depths
  const depth = {};
  const roots = nodes.filter((n) => !edges.some((e) => e.target === n.id));
  const queue = roots.length ? roots.map((n) => n.id) : [nodes[0].id];
  queue.forEach((id) => { depth[id] = 0; });

  let front = 0;
  while (front < queue.length) {
    const curr = queue[front++];
    for (const next of (adjMap[curr] || [])) {
      if (depth[next] === undefined) {
        depth[next] = (depth[curr] || 0) + 1;
        queue.push(next);
      }
    }
  }

  // Assign missing
  nodes.forEach((n) => { if (depth[n.id] === undefined) depth[n.id] = 0; });

  const layers = {};
  nodes.forEach((n) => {
    const d = depth[n.id];
    if (!layers[d]) layers[d] = [];
    layers[d].push(n);
  });

  const layerKeys = Object.keys(layers).map(Number).sort((a, b) => a - b);
  const maxPerLayer = Math.max(...layerKeys.map((k) => layers[k].length));
  const W = Math.max(560, layerKeys.length * 180);
  const H = Math.max(200, maxPerLayer * 100);
  const layerSpacing = W / (layerKeys.length + 1);

  const positioned = {};
  layerKeys.forEach((d, li) => {
    const layer = layers[d];
    const ySpacing = H / (layer.length + 1);
    layer.forEach((n, ni) => {
      positioned[n.id] = { ...n, x: (li + 1) * layerSpacing, y: (ni + 1) * ySpacing };
    });
  });

  return { positioned, W, H };
}

function NodeShape({ node, x, y }) {
  const nt = NODE_TYPES[node.type] || NODE_TYPES.service;
  const fill = node.color || nt.defaultColor;

  if (nt.shape === "diamond") {
    return (
      <g transform={`translate(${x},${y})`}>
        <polygon points="0,-22 26,0 0,22 -26,0" fill={`${fill}20`} stroke={fill} strokeWidth={2} />
        <text y={36} textAnchor="middle" style={{ fontSize: 10, fill: colors.text.primary, fontFamily: typography.fontFamily.body }}>
          {node.label}
        </text>
      </g>
    );
  }

  if (nt.shape === "circle") {
    return (
      <g transform={`translate(${x},${y})`}>
        <circle r={20} fill={`${fill}20`} stroke={fill} strokeWidth={2} />
        <text y={34} textAnchor="middle" style={{ fontSize: 10, fill: colors.text.primary, fontFamily: typography.fontFamily.body }}>
          {node.label}
        </text>
      </g>
    );
  }

  // rect
  const w = Math.max(60, (node.label || "").length * 7 + 16);
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x={-w / 2} y={-18} width={w} height={36} rx={6}
        fill={`${fill}20`} stroke={fill} strokeWidth={2} />
      <text textAnchor="middle" dy="4" style={{ fontSize: 10, fill: colors.text.primary, fontFamily: typography.fontFamily.body }}>
        {node.label}
      </text>
    </g>
  );
}

/* Edge with shortened line (stops at node boundary) + label with background */
function Edge({ edge, from, to, idx }) {
  if (!from || !to) return null;

  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < 1) return null;

  const angle = Math.atan2(dy, dx);
  const rFrom = nodeRadius(from, angle);
  const rTo = nodeRadius(to, angle + Math.PI);

  // Shorten the line so it starts/ends at node edges
  const x1 = from.x + Math.cos(angle) * rFrom;
  const y1 = from.y + Math.sin(angle) * rFrom;
  const x2 = to.x - Math.cos(angle) * (rTo + 8); // +8 for arrowhead
  const y2 = to.y - Math.sin(angle) * (rTo + 8);

  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;

  // Offset label perpendicular to the line so it doesn't overlap
  const perpX = -Math.sin(angle) * 14;
  const perpY = Math.cos(angle) * 14;

  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={colors.text.muted} strokeWidth={1.5} markerEnd={`url(#ah-${idx})`}
        strokeDasharray={edge.dashed ? "4 3" : undefined}
        opacity={0.6} />
      {edge.label && (
        <>
          <rect
            x={midX + perpX - (edge.label.length * 3.2) - 4}
            y={midY + perpY - 8}
            width={(edge.label.length * 6.4) + 8}
            height={16}
            rx={4}
            fill={colors.surface}
            stroke={colors.border}
            strokeWidth={0.5}
            opacity={0.92}
          />
          <text x={midX + perpX} y={midY + perpY + 3} textAnchor="middle"
            style={{ fontSize: 9, fill: colors.text.secondary, fontFamily: typography.fontFamily.body }}>
            {edge.label}
          </text>
        </>
      )}
    </g>
  );
}

export function AttackPathBlock({ block, accentColor }) {
  const d = block.data || {};
  const accent = accentColor || colors.accentBright;
  const nodes = d.nodes || [];
  const edges = d.edges || [];

  const graphLayout = useMemo(() => {
    if (!nodes.length) return null;
    return layoutNodes(nodes, edges);
  }, [nodes, edges]);

  if (!graphLayout) {
    return (
      <div style={{ fontFamily: typography.fontFamily.body, fontSize: 12, color: colors.text.muted, fontStyle: "italic", padding: 20, textAlign: "center" }}>
        Aucun nœud défini.
      </div>
    );
  }

  const { positioned, W, H } = graphLayout;

  return (
    <div style={{ fontFamily: typography.fontFamily.body, margin: "8px 0" }}>
      {d.title && (
        <div style={{
          fontSize: 15, fontWeight: 700, color: colors.text.primary,
          marginBottom: 12, fontFamily: typography.fontFamily.heading,
        }}>{d.title}</div>
      )}

      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
        <defs>
          {edges.map((_, i) => (
            <marker key={i} id={`ah-${i}`} markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill={colors.text.muted} opacity={0.6} />
            </marker>
          ))}
        </defs>

        {/* Edges (behind nodes) */}
        {edges.map((e, i) => (
          <Edge key={i} edge={e} from={positioned[e.source]} to={positioned[e.target]} idx={i} />
        ))}

        {/* Nodes (on top) */}
        {nodes.map((n) => {
          const pos = positioned[n.id];
          if (!pos) return null;
          return <NodeShape key={n.id} node={n} x={pos.x} y={pos.y} />;
        })}
      </svg>
    </div>
  );
}
