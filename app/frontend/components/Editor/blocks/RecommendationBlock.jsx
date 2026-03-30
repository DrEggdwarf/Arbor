import { colors, typography, radii } from "../../../styles/tokens";

const PRIO_MAP = {
  critical: { color: "#c0392b", label: "Critique" },
  high:     { color: "#e67e22", label: "Élevé" },
  medium:   { color: "#f39c12", label: "Moyen" },
  low:      { color: "#27ae60", label: "Faible" },
};

function Dots({ count, max = 5, color }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {Array.from({ length: max }, (_, i) => (
        <div key={i} style={{
          width: 8, height: 8, borderRadius: "50%",
          background: i < count ? color : colors.bg,
          border: `1px solid ${i < count ? color : colors.border}`,
        }} />
      ))}
    </div>
  );
}

export function RecommendationBlock({ block, accentColor }) {
  const d = block.data || {};
  const prio = PRIO_MAP[d.priority] || PRIO_MAP.medium;
  const accent = accentColor || colors.accentBright;

  return (
    <div style={{
      fontFamily: typography.fontFamily.body,
      border: `1px solid ${colors.border}`,
      borderRadius: radii.lg,
      overflow: "hidden",
      margin: "8px 0",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "12px 16px",
        background: `${prio.color}08`,
        borderBottom: `1px solid ${colors.border}`,
      }}>
        <span style={{
          fontSize: 9, fontWeight: 700, letterSpacing: "0.06em",
          padding: "3px 8px", borderRadius: 4,
          background: prio.color, color: "#fff",
          textTransform: "uppercase",
        }}>{prio.label}</span>
        <span style={{
          fontSize: 14, fontWeight: 600, color: colors.text.primary, flex: 1,
          fontFamily: typography.fontFamily.heading,
        }}>{d.title || "Recommandation"}</span>
      </div>

      <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {d.description && (
          <div style={{ fontSize: 13, lineHeight: 1.6, color: colors.text.primary }}>{d.description}</div>
        )}

        {/* Effort / Impact gauges */}
        <div style={{ display: "flex", gap: 24 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: colors.text.muted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Effort</div>
            <Dots count={d.effort || 0} color="#e67e22" />
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: colors.text.muted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Impact</div>
            <Dots count={d.impact || 0} color="#2ecc71" />
          </div>
        </div>

        {d.businessValue && (
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: colors.text.muted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Valeur métier</div>
            <div style={{ fontSize: 12, lineHeight: 1.5, color: colors.text.secondary }}>{d.businessValue}</div>
          </div>
        )}

        {/* Meta row */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {d.timeline && (
            <span style={{ fontSize: 11, color: colors.text.muted, padding: "2px 8px", background: colors.bg, borderRadius: 4, border: `1px solid ${colors.border}` }}>
              📅 {d.timeline}
            </span>
          )}
          {d.owner && (
            <span style={{ fontSize: 11, color: colors.text.muted, padding: "2px 8px", background: colors.bg, borderRadius: 4, border: `1px solid ${colors.border}` }}>
              👤 {d.owner}
            </span>
          )}
        </div>

        {d.tools?.length > 0 && (
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: colors.text.muted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Outils</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {d.tools.map((t, i) => (
                <span key={i} style={{
                  fontSize: 11, padding: "2px 8px", borderRadius: 4,
                  background: `${accent}10`, border: `1px solid ${accent}30`,
                  color: accent,
                }}>
                  {t.name}{t.cost === "free" ? " (gratuit)" : ""}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
