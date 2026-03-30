import { useState, useMemo } from "react";
import { colors, typography } from "../../../styles/tokens";
import { PALETTE, formatValue, niceScale } from "../../../lib/chartUtils";

function lerp(a, b, t) { return a + (b - a) * t; }

/* ── Main component ── */
export function BarChartBlock({ block }) {
  const d = block.data || {};
  const items = d.items || [];
  const title = d.title || "";
  const horizontal = d.orientation === "horizontal";
  const showValues = d.showValues !== false;
  const barColors = d.colors || PALETTE;

  const [hoveredIdx, setHoveredIdx] = useState(null);

  const maxVal = useMemo(() => Math.max(...items.map((i) => i.value || 0), 0), [items]);
  const { max: scaleMax, step: scaleStep } = useMemo(() => niceScale(maxVal), [maxVal]);

  if (!items.length) {
    return (
      <div style={{
        padding: 32, textAlign: "center", color: colors.text.muted,
        fontFamily: typography.fontFamily.body, fontSize: 13,
      }}>
        Aucune donnée — configurez les barres dans le panneau de propriétés
      </div>
    );
  }

  const ticks = [];
  for (let v = 0; v <= scaleMax; v += scaleStep) {
    ticks.push(Math.round(v * 100) / 100);
  }

  /* ── Layout constants ── */
  const CHART_H = horizontal ? Math.max(180, items.length * 36) : 220;
  const MARGIN = { top: 8, right: 12, bottom: 32, left: horizontal ? 90 : 44 };
  const plotW = 500 - MARGIN.left - MARGIN.right;
  const plotH = CHART_H - MARGIN.top - MARGIN.bottom;

  return (
    <div style={{ padding: "12px 0", fontFamily: typography.fontFamily.body }}>
      {title && (
        <div style={{
          fontSize: 15, fontWeight: 700, color: colors.text.primary,
          marginBottom: 12, fontFamily: typography.fontFamily.heading,
        }}>
          {title}
        </div>
      )}

      <svg
        viewBox={`0 0 500 ${CHART_H}`}
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        {/* ── Grid lines ── */}
        {ticks.map((v) => {
          const pct = v / scaleMax;
          if (horizontal) {
            const x = MARGIN.left + pct * plotW;
            return (
              <g key={v}>
                <line x1={x} y1={MARGIN.top} x2={x} y2={MARGIN.top + plotH}
                  stroke={colors.border} strokeWidth={0.8} strokeDasharray={v === 0 ? "none" : "4 3"} />
                <text x={x} y={CHART_H - 6} fontSize={10} fill={colors.text.muted}
                  textAnchor="middle" fontFamily={typography.fontFamily.body}>
                  {formatValue(v)}
                </text>
              </g>
            );
          } else {
            const y = MARGIN.top + plotH - pct * plotH;
            return (
              <g key={v}>
                <line x1={MARGIN.left} y1={y} x2={MARGIN.left + plotW} y2={y}
                  stroke={colors.border} strokeWidth={0.8} strokeDasharray={v === 0 ? "none" : "4 3"} />
                <text x={MARGIN.left - 6} y={y + 3.5} fontSize={10} fill={colors.text.muted}
                  textAnchor="end" fontFamily={typography.fontFamily.body}>
                  {formatValue(v)}
                </text>
              </g>
            );
          }
        })}

        {/* ── Bars ── */}
        {items.map((item, i) => {
          const val = Math.max(0, item.value || 0);
          const pct = scaleMax > 0 ? val / scaleMax : 0;
          const color = item.color || barColors[i % barColors.length];
          const isHovered = hoveredIdx === i;
          const opacity = hoveredIdx !== null ? (isHovered ? 1 : 0.4) : 0.85;

          if (horizontal) {
            /* ── Horizontal bars ── */
            const barH = Math.min(28, (plotH / items.length) * 0.7);
            const gap = plotH / items.length;
            const y = MARGIN.top + i * gap + (gap - barH) / 2;
            const barW = pct * plotW;

            return (
              <g key={i}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{ cursor: "default" }}
              >
                {/* Label */}
                <text x={MARGIN.left - 6} y={y + barH / 2 + 3.5} fontSize={11}
                  fill={colors.text.secondary} textAnchor="end"
                  fontFamily={typography.fontFamily.body}>
                  {(item.label || "").length > 10 ? item.label.slice(0, 10) + "…" : item.label}
                </text>
                {/* Bar background */}
                <rect x={MARGIN.left} y={y} width={plotW} height={barH}
                  rx={4} fill={colors.bg} opacity={0.5} />
                {/* Bar */}
                <rect x={MARGIN.left} y={y} width={barW} height={barH}
                  rx={4} fill={color} opacity={opacity}
                  style={{ transition: "width 0.3s ease, opacity 0.15s" }} />
                {/* Value */}
                {showValues && (
                  <text x={MARGIN.left + barW + 6} y={y + barH / 2 + 3.5}
                    fontSize={10} fontWeight={600} fill={color}
                    fontFamily={typography.fontFamily.body} opacity={isHovered ? 1 : 0.7}>
                    {formatValue(val)}
                  </text>
                )}
                {/* Tooltip on hover */}
                {isHovered && (
                  <g>
                    <rect x={MARGIN.left + barW + 4} y={y - 22} width={Math.max(60, String(item.label).length * 6 + 30)} height={20}
                      rx={6} fill={colors.text.primary} opacity={0.9} />
                    <text x={MARGIN.left + barW + 10} y={y - 9} fontSize={10} fill="#fff"
                      fontFamily={typography.fontFamily.body}>
                      {item.label}: {formatValue(val)}
                    </text>
                  </g>
                )}
              </g>
            );
          } else {
            /* ── Vertical bars ── */
            const barW = Math.min(48, (plotW / items.length) * 0.65);
            const gap = plotW / items.length;
            const x = MARGIN.left + i * gap + (gap - barW) / 2;
            const barH = pct * plotH;
            const barY = MARGIN.top + plotH - barH;

            return (
              <g key={i}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{ cursor: "default" }}
              >
                {/* Bar background */}
                <rect x={x} y={MARGIN.top} width={barW} height={plotH}
                  rx={4} fill={colors.bg} opacity={0.5} />
                {/* Bar */}
                <rect x={x} y={barY} width={barW} height={barH}
                  rx={4} fill={color} opacity={opacity}
                  style={{ transition: "height 0.3s ease, y 0.3s ease, opacity 0.15s" }} />
                {/* Value on bar */}
                {showValues && (
                  <text x={x + barW / 2} y={barY - 6} fontSize={10} fontWeight={600}
                    fill={color} textAnchor="middle" fontFamily={typography.fontFamily.body}
                    opacity={isHovered ? 1 : 0.7}>
                    {formatValue(val)}
                  </text>
                )}
                {/* X-axis label */}
                <text x={x + barW / 2} y={MARGIN.top + plotH + 16} fontSize={10}
                  fill={colors.text.secondary} textAnchor="middle"
                  fontFamily={typography.fontFamily.body}>
                  {(item.label || "").length > 8 ? item.label.slice(0, 8) + "…" : item.label}
                </text>
                {/* Tooltip on hover */}
                {isHovered && (
                  <g>
                    <rect x={x + barW / 2 - 35} y={barY - 30} width={70} height={20}
                      rx={6} fill={colors.text.primary} opacity={0.9} />
                    <text x={x + barW / 2} y={barY - 17} fontSize={10} fill="#fff"
                      textAnchor="middle" fontFamily={typography.fontFamily.body}>
                      {item.label}: {formatValue(val)}
                    </text>
                  </g>
                )}
              </g>
            );
          }
        })}

        {/* ── Axes ── */}
        {horizontal ? (
          <line x1={MARGIN.left} y1={MARGIN.top} x2={MARGIN.left} y2={MARGIN.top + plotH}
            stroke={colors.text.muted} strokeWidth={1} opacity={0.3} />
        ) : (
          <>
            <line x1={MARGIN.left} y1={MARGIN.top + plotH} x2={MARGIN.left + plotW} y2={MARGIN.top + plotH}
              stroke={colors.text.muted} strokeWidth={1} opacity={0.3} />
            <line x1={MARGIN.left} y1={MARGIN.top} x2={MARGIN.left} y2={MARGIN.top + plotH}
              stroke={colors.text.muted} strokeWidth={1} opacity={0.3} />
          </>
        )}
      </svg>
    </div>
  );
}
