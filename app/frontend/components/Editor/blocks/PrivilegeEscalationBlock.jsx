import { colors, typography, radii } from "../../../styles/tokens";

const DEFAULT_COLORS = ["#3498db", "#2ecc71", "#e67e22", "#e74c3c", "#9b59b6", "#1abc9c"];

export function PrivilegeEscalationBlock({ block, accentColor }) {
  const d = block.data || {};
  const accent = accentColor || colors.accentBright;
  const chain = d.chain || [];

  return (
    <div style={{ fontFamily: typography.fontFamily.body, margin: "8px 0" }}>
      {d.title && (
        <div style={{
          fontSize: 15, fontWeight: 700, color: colors.text.primary,
          marginBottom: 16, fontFamily: typography.fontFamily.heading,
        }}>{d.title}</div>
      )}

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
        {chain.map((step, i) => {
          const stepColor = step.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length];
          const isLast = i === chain.length - 1;

          return (
            <div key={step.id || i} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
              {/* Step card */}
              <div style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 16px",
                border: `2px solid ${stepColor}`,
                borderRadius: radii.lg,
                background: `${stepColor}08`,
                width: "100%", maxWidth: 440,
                position: "relative",
              }}>
                {/* Level badge */}
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: stepColor, color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700, flexShrink: 0,
                  fontFamily: typography.fontFamily.heading,
                }}>
                  {step.level != null ? step.level : i}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 13, fontWeight: 700, color: stepColor,
                    fontFamily: typography.fontFamily.heading,
                    marginBottom: 2,
                  }}>{step.privilege}</div>
                  {step.description && (
                    <div style={{
                      fontSize: 11, color: colors.text.secondary, lineHeight: 1.4,
                    }}>{step.description}</div>
                  )}
                  {step.source && (
                    <div style={{
                      fontSize: 10, color: colors.text.muted, marginTop: 3,
                      background: colors.bg, padding: "1px 6px", borderRadius: 3,
                      display: "inline-block",
                    }}>{step.source}</div>
                  )}
                </div>
              </div>

              {/* Arrow connector */}
              {!isLast && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: 24 }}>
                  <div style={{ width: 2, height: 16, background: colors.border }} />
                  <div style={{
                    width: 0, height: 0,
                    borderLeft: "5px solid transparent",
                    borderRight: "5px solid transparent",
                    borderTop: `6px solid ${colors.border}`,
                  }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {chain.length === 0 && (
        <div style={{ fontSize: 12, color: colors.text.muted, fontStyle: "italic", textAlign: "center", padding: 20 }}>
          Aucune étape définie.
        </div>
      )}
    </div>
  );
}
