import { useMemo } from "react";
import { colors, typography, radii } from "../../../styles/tokens";

const CLOUD_ICONS = {
  compute: { label: "Compute", color: "#e67e22" },
  storage: { label: "Storage", color: "#3498db" },
  database: { label: "Database", color: "#9b59b6" },
  network: { label: "Network", color: "#27ae60" },
  security: { label: "Security", color: "#e74c3c" },
  cdn: { label: "CDN", color: "#1abc9c" },
  dns: { label: "DNS", color: "#34495e" },
  loadbalancer: { label: "LB", color: "#f39c12" },
  queue: { label: "Queue", color: "#2ecc71" },
  function: { label: "λ", color: "#E8A855" },
  container: { label: "Container", color: "#2980b9" },
  monitoring: { label: "Monitor", color: "#16a085" },
};

export function CloudArchitectureBlock({ block, accentColor }) {
  const d = block.data || {};
  const accent = accentColor || colors.accentBright;
  const services = d.services || [];
  const connections = d.connections || [];
  const zones = d.zones || [];

  const W = 640, H = Math.max(300, (zones.length || 1) * 140 + 60);

  const positions = useMemo(() => {
    if (!services.length) return {};
    const pos = {};
    const cols = Math.ceil(Math.sqrt(services.length));
    const cellW = (W - 80) / cols;
    const rows = Math.ceil(services.length / cols);
    const cellH = (H - 60) / (rows || 1);
    services.forEach((s, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      pos[s.id] = {
        x: s.x ?? 60 + col * cellW + cellW / 2,
        y: s.y ?? 40 + row * cellH + cellH / 2,
      };
    });
    return pos;
  }, [services, W, H]);

  return (
    <div style={styles.card}>
      {d.title && <h3 style={{ ...styles.title, borderBottomColor: accent }}>{d.title}</h3>}
      {d.provider && (
        <div style={styles.meta}>
          <span style={styles.providerBadge}>{d.provider}</span>
          {d.region && <span style={{ marginLeft: 8, fontSize: 11, color: colors.text.muted }}>{d.region}</span>}
        </div>
      )}

      {!services.length ? (
        <p style={styles.empty}>Aucun service défini.</p>
      ) : (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
          <defs>
            <marker id="cloud-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill={colors.text.muted} opacity={0.5} />
            </marker>
          </defs>

          {/* Zones */}
          {zones.map((z, zi) => (
            <g key={zi}>
              <rect x={z.x || 20} y={z.y || 20 + zi * 130} width={z.width || W - 40} height={z.height || 120}
                rx={10} fill={`${z.color || colors.info}08`} stroke={z.color || colors.info} strokeWidth={1} strokeDasharray="6 3" />
              <text x={(z.x || 20) + 10} y={(z.y || 20 + zi * 130) + 16}
                fontSize={10} fontWeight={600} fill={z.color || colors.info}
                fontFamily={typography.fontFamily.body}>
                {z.label || `Zone ${zi + 1}`}
              </text>
            </g>
          ))}

          {/* Connections */}
          {connections.map((c, ci) => {
            const from = positions[c.from];
            const to = positions[c.to];
            if (!from || !to) return null;
            return (
              <g key={ci}>
                <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={colors.text.muted} strokeWidth={1.2} opacity={0.4}
                  markerEnd="url(#cloud-arrow)"
                  strokeDasharray={c.dashed ? "5 3" : undefined} />
                {c.label && (
                  <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 6}
                    fontSize={8} fill={colors.text.muted} textAnchor="middle"
                    fontFamily={typography.fontFamily.body}>
                    {c.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Services */}
          {services.map((s) => {
            const pos = positions[s.id];
            if (!pos) return null;
            const meta = CLOUD_ICONS[s.type] || { label: s.type || "?", color: colors.text.muted };
            const color = s.color || meta.color;
            return (
              <g key={s.id} transform={`translate(${pos.x}, ${pos.y})`}>
                <rect x={-32} y={-22} width={64} height={44} rx={8}
                  fill={`${color}15`} stroke={color} strokeWidth={1.5} />
                <text y={-6} textAnchor="middle" fontSize={11} fontWeight={700}
                  fill={color} fontFamily={typography.fontFamily.body}>
                  {meta.label}
                </text>
                <text y={10} textAnchor="middle" fontSize={8} fill={colors.text.primary}
                  fontFamily={typography.fontFamily.body}>
                  {s.label || ""}
                </text>
                {s.sublabel && (
                  <text y={32} textAnchor="middle" fontSize={7} fill={colors.text.muted}
                    fontFamily={typography.fontFamily.body}>
                    {s.sublabel}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      )}
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
  meta: {
    marginBottom: 12,
    display: "flex",
    alignItems: "center",
  },
  providerBadge: {
    display: "inline-block",
    padding: "2px 10px",
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 600,
    backgroundColor: `${colors.info}15`,
    color: colors.info,
  },
  empty: {
    color: colors.text.muted, fontSize: 12,
    fontStyle: "italic", textAlign: "center", padding: 16,
  },
};
