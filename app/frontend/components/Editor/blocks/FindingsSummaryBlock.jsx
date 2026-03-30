import { colors, typography, radii } from "../../../styles/tokens";

const SEV_COLORS = {
  critical: "#c0392b",
  high: "#e67e22",
  medium: "#f39c12",
  low: "#27ae60",
  info: "#2980b9",
};

export function FindingsSummaryBlock({ block, accentColor }) {
  const d = block.data || {};
  const title = d.title || "";
  const showPct = d.showPercentage !== false;

  const items = [
    { label: "Critique", count: d.critical || 0, color: SEV_COLORS.critical },
    { label: "Élevé", count: d.high || 0, color: SEV_COLORS.high },
    { label: "Moyen", count: d.medium || 0, color: SEV_COLORS.medium },
    { label: "Faible", count: d.low || 0, color: SEV_COLORS.low },
    { label: "Info", count: d.info || 0, color: SEV_COLORS.info },
  ];

  const total = items.reduce((s, it) => s + it.count, 0) || 1;

  return (
    <div style={{ fontFamily: typography.fontFamily.body, padding: "12px 0" }}>
      {title && (
        <div style={{ fontSize: 15, fontWeight: 700, color: colors.text.primary, marginBottom: 12, fontFamily: typography.fontFamily.heading }}>
          {title}
        </div>
      )}

      {/* Total badge */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 28, fontWeight: 700, color: colors.text.primary }}>{items.reduce((s, it) => s + it.count, 0)}</span>
        <span style={{ fontSize: 12, color: colors.text.muted }}>vulnérabilités identifiées</span>
      </div>

      {/* Stacked bar */}
      <div style={{ display: "flex", height: 8, borderRadius: 4, overflow: "hidden", marginBottom: 14, background: colors.bg }}>
        {items.map((it, i) => (
          it.count > 0 && <div key={i} style={{ flex: it.count, background: it.color, transition: "flex 0.2s" }} />
        ))}
      </div>

      {/* Detail rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: it.color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: colors.text.secondary, flex: 1 }}>{it.label}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: colors.text.primary, minWidth: 28, textAlign: "right" }}>{it.count}</span>
            {showPct && (
              <span style={{ fontSize: 10, color: colors.text.muted, minWidth: 36, textAlign: "right" }}>
                {Math.round((it.count / total) * 100)}%
              </span>
            )}
            <div style={{ width: 80, height: 5, borderRadius: 3, background: colors.bg, overflow: "hidden" }}>
              <div style={{ width: `${(it.count / total) * 100}%`, height: "100%", background: it.color, borderRadius: 3 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
