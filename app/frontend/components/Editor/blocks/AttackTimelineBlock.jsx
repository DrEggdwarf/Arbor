import { colors, typography, radii } from "../../../styles/tokens";

const STATUS_ICON = {
  success:  { symbol: "✓", color: "#27ae60" },
  partial:  { symbol: "◐", color: "#e67e22" },
  blocked:  { symbol: "✗", color: "#e74c3c" },
  skipped:  { symbol: "○", color: "#95a5a6" },
};

export function AttackTimelineBlock({ block, accentColor }) {
  const d = block.data || {};
  const accent = accentColor || colors.accentBright;
  const phases = d.phases || [];

  return (
    <div style={{ fontFamily: typography.fontFamily.body, margin: "8px 0" }}>
      {d.title && (
        <div style={{
          fontSize: 15, fontWeight: 700, color: colors.text.primary,
          marginBottom: 16, fontFamily: typography.fontFamily.heading,
        }}>{d.title}</div>
      )}

      <div style={{ position: "relative", paddingLeft: 28 }}>
        {/* Vertical line */}
        <div style={{
          position: "absolute", left: 10, top: 6, bottom: 6,
          width: 2, background: colors.border,
        }} />

        {phases.map((phase, pi) => {
          const phaseColor = phase.color || accent;
          return (
            <div key={phase.id || pi} style={{ marginBottom: pi < phases.length - 1 ? 20 : 0, position: "relative" }}>
              {/* Dot */}
              <div style={{
                position: "absolute", left: -22, top: 4,
                width: 12, height: 12, borderRadius: "50%",
                background: phaseColor, border: `2px solid ${colors.surface}`,
                boxShadow: `0 0 0 2px ${phaseColor}40`,
              }} />

              {/* Phase header */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
                <span style={{
                  fontSize: 13, fontWeight: 700, color: phaseColor,
                  fontFamily: typography.fontFamily.heading,
                }}>{phase.label}</span>
                {phase.timestamp && (
                  <span style={{
                    fontSize: 10, color: colors.text.muted,
                    background: colors.bg, padding: "1px 6px", borderRadius: 3,
                  }}>{phase.timestamp}</span>
                )}
              </div>

              {/* Techniques */}
              {phase.techniques?.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginLeft: 4 }}>
                  {phase.techniques.map((tech, ti) => {
                    const st = STATUS_ICON[tech.status] || STATUS_ICON.success;
                    return (
                      <div key={tech.id || ti} style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "4px 8px", borderRadius: 4,
                        background: `${phaseColor}06`,
                        border: `1px solid ${phaseColor}15`,
                      }}>
                        <span style={{ fontSize: 12, color: st.color, width: 14, textAlign: "center" }}>
                          {st.symbol}
                        </span>
                        {tech.id && (
                          <span style={{
                            fontSize: 9, fontWeight: 600, color: colors.text.muted,
                            background: colors.bg, padding: "1px 5px", borderRadius: 3,
                            letterSpacing: "0.03em",
                          }}>{tech.id}</span>
                        )}
                        <span style={{ fontSize: 12, color: colors.text.primary, flex: 1 }}>
                          {tech.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {phases.length === 0 && (
        <div style={{ fontSize: 12, color: colors.text.muted, fontStyle: "italic", textAlign: "center", padding: 20 }}>
          Aucune phase définie.
        </div>
      )}
    </div>
  );
}
