import { useMemo } from "react";
import { colors, typography, radii } from "../../../styles/tokens";

const PRIORITY_COLORS = {
  critical: { bg: "#F8D7DA", text: "#842029" },
  high:     { bg: "#FDDCB5", text: "#9C4221" },
  medium:   { bg: "#FFF3CD", text: "#856404" },
  low:      { bg: "#D4EDDA", text: "#2D7A47" },
};

const BAR_CURRENT = "#E8A855";
const BAR_TARGET = "#5B8FD4";
const LABEL_W = 130;
const BAR_AREA_W = 280;
const GAP_COL_X = 430;
const PRIO_COL_X = 460;
const ROW_H = 36;
const BAR_H = 10;
const TOP_PAD = 32;
const SCALE_MAX = 5;

export function GapAnalysisBlock({ block, accentColor }) {
  const d = block.data || {};
  const title = d.title || "Analyse d'écarts";
  const framework = d.framework || "";
  const domains = d.domains || [];
  const metrics = d.overallMetrics || {};
  const accent = accentColor || colors.accentBright;

  const svgHeight = useMemo(
    () => TOP_PAD + domains.length * ROW_H + 20,
    [domains.length]
  );

  if (!domains.length) {
    return (
      <div style={{
        border: `2px dashed ${colors.border}`, borderRadius: radii.xl,
        padding: 32, textAlign: "center",
        color: colors.text.muted, fontSize: typography.fontSize.sm, fontFamily: typography.fontFamily.body,
      }}>
        Aucun domaine configuré
      </div>
    );
  }

  return (
    <div style={{
      background: colors.surface, borderRadius: radii.lg, border: `1px solid ${colors.border}`,
      padding: "14px 18px", fontFamily: typography.fontFamily.body,
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <span style={{
          fontSize: 15, fontWeight: 700, color: colors.text.primary,
          fontFamily: typography.fontFamily.heading,
        }}>
          {title}
        </span>
        {framework && (
          <span style={{
            fontSize: typography.fontSize.xs, fontWeight: 600,
            background: accent, color: "#fff",
            borderRadius: 999, padding: "2px 8px",
          }}>
            {framework}
          </span>
        )}
      </div>

      {/* SVG Chart */}
      <svg viewBox={`0 0 540 ${svgHeight}`} style={{ width: "100%", height: "auto", display: "block" }}>
        {/* Scale labels */}
        {Array.from({ length: SCALE_MAX + 1 }, (_, i) => {
          const x = LABEL_W + (BAR_AREA_W / SCALE_MAX) * i;
          return (
            <text key={i} x={x} y={TOP_PAD - 8} fontSize={9}
              fill={colors.text.muted} textAnchor="middle"
              fontFamily={typography.fontFamily.body}>
              {i}
            </text>
          );
        })}

        {/* Grid lines */}
        {Array.from({ length: SCALE_MAX + 1 }, (_, i) => {
          const x = LABEL_W + (BAR_AREA_W / SCALE_MAX) * i;
          return (
            <line key={i} x1={x} y1={TOP_PAD - 2} x2={x}
              y2={TOP_PAD + domains.length * ROW_H}
              stroke={colors.border} strokeWidth={0.5} strokeDasharray="2,2" />
          );
        })}

        {/* Rows */}
        {domains.map((dom, i) => {
          const y = TOP_PAD + i * ROW_H;
          const currentW = (Math.min(dom.currentLevel || 0, SCALE_MAX) / SCALE_MAX) * BAR_AREA_W;
          const targetW = (Math.min(dom.targetLevel || 0, SCALE_MAX) / SCALE_MAX) * BAR_AREA_W;
          const gap = dom.gap ?? (dom.targetLevel - dom.currentLevel);
          const prio = (dom.priority || "medium").toLowerCase();
          const prioStyle = PRIORITY_COLORS[prio] || PRIORITY_COLORS.medium;

          return (
            <g key={dom.id || i}>
              {/* Alternating row bg */}
              {i % 2 === 0 && (
                <rect x={0} y={y} width={540} height={ROW_H}
                  fill={colors.bg} opacity={0.5} rx={2} />
              )}

              {/* Domain name */}
              <text x={4} y={y + ROW_H / 2 + 3} fontSize={10}
                fill={colors.text.secondary} fontFamily={typography.fontFamily.body}>
                {dom.name && dom.name.length > 20 ? dom.name.slice(0, 20) + "…" : dom.name}
              </text>

              {/* Current bar */}
              <rect x={LABEL_W} y={y + 6} width={Math.max(currentW, 0)} height={BAR_H}
                fill={accent} rx={2} />

              {/* Target bar */}
              <rect x={LABEL_W} y={y + 6 + BAR_H + 2} width={Math.max(targetW, 0)} height={BAR_H}
                fill={BAR_TARGET} rx={2} opacity={0.7} />

              {/* Gap value */}
              <text x={GAP_COL_X} y={y + ROW_H / 2 + 3} fontSize={10}
                fill={gap > 2 ? colors.error : gap > 0 ? colors.text.secondary : colors.success}
                fontWeight={600} textAnchor="middle"
                fontFamily={typography.fontFamily.body}>
                {gap > 0 ? `−${gap}` : gap === 0 ? "✓" : `+${Math.abs(gap)}`}
              </text>

              {/* Priority badge */}
              <rect x={PRIO_COL_X} y={y + ROW_H / 2 - 8} width={50} height={16}
                fill={prioStyle.bg} rx={8} />
              <text x={PRIO_COL_X + 25} y={y + ROW_H / 2 + 3} fontSize={8}
                fill={prioStyle.text} textAnchor="middle" fontWeight={600}
                fontFamily={typography.fontFamily.body}>
                {prio === "critical" ? "Critique" : prio === "high" ? "Élevé" : prio === "medium" ? "Moyen" : "Faible"}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend + Summary */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginTop: 10, paddingTop: 8, borderTop: `1px solid ${colors.border}`,
        fontSize: typography.fontSize.sm, color: colors.text.secondary,
      }}>
        <div style={{ display: "flex", gap: 14 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: accent, display: "inline-block" }} />
            Actuel
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: BAR_TARGET, display: "inline-block" }} />
            Cible
          </span>
        </div>
        {(metrics.currentAverage != null || metrics.targetAverage != null) && (
          <div style={{ display: "flex", gap: 16 }}>
            <span>
              <strong>Moy. actuelle :</strong>{" "}
              {typeof metrics.currentAverage === "number" ? metrics.currentAverage.toFixed(1) : "—"}
            </span>
            <span>
              <strong>Moy. cible :</strong>{" "}
              {typeof metrics.targetAverage === "number" ? metrics.targetAverage.toFixed(1) : "—"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
