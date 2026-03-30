import { useMemo } from "react";
import { colors, typography, radii } from "../../../styles/tokens";
import { PALETTE } from "../../../lib/chartUtils";

const SHAPE_MAP = {
  box: "rect",
  database: "cylinder",
  cloud: "cloud",
  user: "circle",
  firewall: "diamond",
};

export function ArchitectureDiagramBlock({ block, accentColor }) {
  const d = block.data || {};
  const accent = accentColor || colors.accentBright;
  const nodes = d.nodes || [];
  const connections = d.connections || [];

  const W = 600, H = Math.max(250, nodes.length * 60);

  const positions = useMemo(() => {
    if (!nodes.length) return {};
    // Auto-layout: grid arrangement
    const cols = Math.ceil(Math.sqrt(nodes.length));
    const cellW = W / (cols + 1);
    const rows = Math.ceil(nodes.length / cols);
    const cellH = H / (rows + 1);
    const pos = {};
    nodes.forEach((n, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      pos[n.id] = {
        x: n.x ?? (col + 1) * cellW - cellW / 2 + 40,
        y: n.y ?? (row + 1) * cellH,
      };
    });
    return pos;
  }, [nodes, W, H]);

  return (
    <div style={styles.card}>
      {d.title && <h3 style={{ ...styles.title, borderBottomColor: accent }}>{d.title}</h3>}

      {!nodes.length ? (
        <p style={styles.empty}>Aucun composant défini.</p>
      ) : (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
          <defs>
            <marker id="arch-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill={colors.text.muted} opacity={0.6} />
            </marker>
          </defs>

          {/* Connections */}
          {connections.map((c, ci) => {
            const from = positions[c.from];
            const to = positions[c.to];
            if (!from || !to) return null;
            return (
              <g key={ci}>
                <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={colors.text.muted} strokeWidth={1.5} opacity={0.5}
                  markerEnd="url(#arch-arrow)"
                  strokeDasharray={c.dashed ? "6 3" : undefined} />
                {c.label && (
                  <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 6}
                    fontSize={9} fill={colors.text.muted} textAnchor="middle"
                    fontFamily={typography.fontFamily.body}>
                    {c.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((n, ni) => {
            const pos = positions[n.id];
            if (!pos) return null;
            const color = n.color || PALETTE[ni % PALETTE.length];
            const shape = SHAPE_MAP[n.shape] || "rect";
            return (
              <g key={n.id} transform={`translate(${pos.x}, ${pos.y})`}>
                <NodeShape shape={shape} color={color} label={n.label} sublabel={n.sublabel} />
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}

function NodeShape({ shape, color, label, sublabel }) {
  const labelEl = (yOff) => (
    <>
      <text y={yOff} textAnchor="middle" fontSize={10} fontWeight={600}
        fill={colors.text.primary} fontFamily={typography.fontFamily.body}>
        {label}
      </text>
      {sublabel && (
        <text y={yOff + 12} textAnchor="middle" fontSize={8}
          fill={colors.text.muted} fontFamily={typography.fontFamily.body}>
          {sublabel}
        </text>
      )}
    </>
  );

  if (shape === "cylinder") {
    return (
      <>
        <ellipse cx={0} cy={-18} rx={36} ry={8} fill={`${color}20`} stroke={color} strokeWidth={1.5} />
        <rect x={-36} y={-18} width={72} height={28} fill={`${color}20`} stroke="none" />
        <line x1={-36} y1={-18} x2={-36} y2={10} stroke={color} strokeWidth={1.5} />
        <line x1={36} y1={-18} x2={36} y2={10} stroke={color} strokeWidth={1.5} />
        <ellipse cx={0} cy={10} rx={36} ry={8} fill={`${color}20`} stroke={color} strokeWidth={1.5} />
        {labelEl(32)}
      </>
    );
  }

  if (shape === "circle") {
    return (
      <>
        <circle r={22} fill={`${color}20`} stroke={color} strokeWidth={1.5} />
        {labelEl(38)}
      </>
    );
  }

  if (shape === "diamond") {
    return (
      <>
        <polygon points="0,-26 30,0 0,26 -30,0" fill={`${color}20`} stroke={color} strokeWidth={1.5} />
        {labelEl(38)}
      </>
    );
  }

  if (shape === "cloud") {
    return (
      <>
        <ellipse cx={0} cy={0} rx={40} ry={22} fill={`${color}12`} stroke={color} strokeWidth={1.5} strokeDasharray="4 2" />
        <text y={4} textAnchor="middle" fontSize={10} fontWeight={600}
          fill={colors.text.primary} fontFamily={typography.fontFamily.body}>
          {label}
        </text>
        {sublabel && (
          <text y={16} textAnchor="middle" fontSize={8}
            fill={colors.text.muted} fontFamily={typography.fontFamily.body}>
            {sublabel}
          </text>
        )}
      </>
    );
  }

  // Default: rect
  const w = Math.max(80, (label || "").length * 7 + 24);
  return (
    <>
      <rect x={-w / 2} y={-20} width={w} height={40} rx={6}
        fill={`${color}20`} stroke={color} strokeWidth={1.5} />
      <text y={4} textAnchor="middle" fontSize={10} fontWeight={600}
        fill={colors.text.primary} fontFamily={typography.fontFamily.body}>
        {label}
      </text>
      {sublabel && (
        <text y={16} textAnchor="middle" fontSize={8}
          fill={colors.text.muted} fontFamily={typography.fontFamily.body}>
          {sublabel}
        </text>
      )}
    </>
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
  empty: {
    color: colors.text.muted, fontSize: 12,
    fontStyle: "italic", textAlign: "center", padding: 16,
  },
};
