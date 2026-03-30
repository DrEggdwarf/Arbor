import { useMemo } from "react";
import { colors, typography, radii } from "../../../styles/tokens";

const STATUS_STYLES = {
  acceptable:   { color: "#27ae60", label: "Acceptable" },
  tolerable:    { color: "#f39c12", label: "Tolérable" },
  unacceptable: { color: "#c0392b", label: "Inacceptable" },
};

function deriveStatus(current, appetite) {
  if (current <= appetite) return "acceptable";
  if (current <= appetite * 1.2) return "tolerable";
  return "unacceptable";
}

function barColor(status) {
  return STATUS_STYLES[status]?.color || colors.text.muted;
}

export function RiskAppetiteBlock({ block, accentColor }) {
  const d = block.data || {};
  const title = d.title || "Appétit pour le risque";
  const description = d.description || "";
  const categories = d.categories || [];

  const rows = useMemo(() =>
    categories.map((cat) => {
      const current = cat.current ?? 0;
      const appetite = cat.appetite ?? 50;
      const max = cat.max || 100;
      const status = cat.status || deriveStatus(current, appetite);
      return { ...cat, current, appetite, max, status };
    }),
    [categories]
  );

  if (!categories.length) {
    return (
      <div style={{
        border: `2px dashed ${colors.border}`, borderRadius: radii.xl,
        padding: 32, textAlign: "center",
        color: colors.text.muted, fontSize: typography.fontSize.sm, fontFamily: typography.fontFamily.body,
      }}>
        Aucune catégorie configurée
      </div>
    );
  }

  return (
    <div style={{
      background: colors.surface, borderRadius: radii.lg, border: `1px solid ${colors.border}`,
      padding: "14px 18px", fontFamily: typography.fontFamily.body,
    }}>
      {/* Title */}
      <div style={{
        fontSize: 15, fontWeight: 700, color: colors.text.primary,
        fontFamily: typography.fontFamily.heading, marginBottom: description ? 4 : 10,
      }}>
        {title}
      </div>

      {description && (
        <div style={{
          fontSize: typography.fontSize.sm, color: colors.text.secondary,
          marginBottom: 12, lineHeight: 1.5,
        }}>
          {description}
        </div>
      )}

      {/* Gauge rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {rows.map((cat, i) => {
          const pctCurrent = Math.min((cat.current / cat.max) * 100, 100);
          const pctAppetite = Math.min((cat.appetite / cat.max) * 100, 100);
          const fillColor = barColor(cat.status);
          const statusInfo = STATUS_STYLES[cat.status] || STATUS_STYLES.acceptable;

          return (
            <div key={cat.id || i}>
              {/* Category label row */}
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                marginBottom: 4,
              }}>
                <span style={{
                  fontSize: typography.fontSize.md, fontWeight: 600,
                  color: colors.text.primary,
                }}>
                  {cat.name}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    fontSize: typography.fontSize.sm, fontWeight: 700,
                    color: fillColor,
                  }}>
                    {cat.current}
                  </span>
                  <span style={{
                    display: "inline-block", padding: "1px 7px", borderRadius: 999,
                    fontSize: typography.fontSize.xs, fontWeight: 600,
                    background: `${fillColor}18`, color: fillColor,
                    border: `1px solid ${fillColor}40`,
                  }}>
                    {statusInfo.label}
                  </span>
                </div>
              </div>

              {/* Bar gauge */}
              <div style={{
                position: "relative", height: 16, borderRadius: 999,
                background: colors.bg, border: `1px solid ${colors.border}`,
                overflow: "visible", boxSizing: "border-box",
              }}>
                {/* Fill bar */}
                <div style={{
                  position: "absolute", left: 0, top: 0, bottom: 0,
                  width: `${pctCurrent}%`, borderRadius: 999,
                  background: fillColor, opacity: 0.8,
                  transition: "width 0.3s ease",
                  maxWidth: "100%",
                }} />

                {/* Appetite threshold line */}
                <div style={{
                  position: "absolute", left: `${pctAppetite}%`, top: -3, bottom: -3,
                  width: 2, background: colors.text.primary,
                  borderLeft: `1px dashed ${colors.text.primary}`,
                  borderRight: `1px dashed ${colors.text.primary}`,
                  opacity: 0.6, zIndex: 1,
                }} />
              </div>

              {/* Notes */}
              {cat.notes && (
                <div style={{
                  fontSize: typography.fontSize.xs, color: colors.text.muted,
                  marginTop: 2, fontStyle: "italic",
                }}>
                  {cat.notes}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{
        display: "flex", gap: 14, marginTop: 12, paddingTop: 8,
        borderTop: `1px solid ${colors.border}`,
        fontSize: typography.fontSize.xs, color: colors.text.muted,
        flexWrap: "wrap",
      }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: "#27ae60", display: "inline-block" }} />
          Acceptable
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: "#f39c12", display: "inline-block" }} />
          Tolérable
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: "#c0392b", display: "inline-block" }} />
          Inacceptable
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{
            width: 2, height: 12, background: colors.text.primary, opacity: 0.6,
            borderLeft: `1px dashed ${colors.text.primary}`, display: "inline-block",
          }} />
          Seuil d'appétit
        </span>
      </div>
    </div>
  );
}
