import { useState, useMemo } from "react";
import { colors, typography } from "../../../styles/tokens";
import { PALETTE, formatValue, niceScaleRange as niceScale } from "../../../lib/chartUtils";

export function ScatterPlotBlock({ block }) {
  const d = block.data || {};
  const points = d.points || [];
  const title = d.title || "";
  const xLabel = d.xLabel || "";
  const yLabel = d.yLabel || "";
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const { xMin, xMax, yMin, yMax } = useMemo(() => {
    const xs = points.map((p) => p.x || 0);
    const ys = points.map((p) => p.y || 0);
    return {
      xMin: Math.min(...xs, 0), xMax: Math.max(...xs, 10),
      yMin: Math.min(...ys, 0), yMax: Math.max(...ys, 10),
    };
  }, [points]);

  const xScale = useMemo(() => niceScale(xMin, xMax), [xMin, xMax]);
  const yScale = useMemo(() => niceScale(yMin, yMax), [yMin, yMax]);

  if (!points.length) {
    return (
      <div style={{ padding: 32, textAlign: "center", color: colors.text.muted, fontFamily: typography.fontFamily.body, fontSize: 13 }}>
        Aucune donnée
      </div>
    );
  }

  const MARGIN = { top: 12, right: 16, bottom: 40, left: 48 };
  const W = 500, H = 300;
  const plotW = W - MARGIN.left - MARGIN.right;
  const plotH = H - MARGIN.top - MARGIN.bottom;

  function px(v) { return MARGIN.left + ((v - xScale.min) / (xScale.max - xScale.min)) * plotW; }
  function py(v) { return MARGIN.top + plotH - ((v - yScale.min) / (yScale.max - yScale.min)) * plotH; }

  const xTicks = [];
  for (let v = xScale.min; v <= xScale.max; v += xScale.step) xTicks.push(Math.round(v * 100) / 100);
  const yTicks = [];
  for (let v = yScale.min; v <= yScale.max; v += yScale.step) yTicks.push(Math.round(v * 100) / 100);

  return (
    <div style={{ padding: "12px 0", fontFamily: typography.fontFamily.body }}>
      {title && (
        <div style={{ fontSize: 15, fontWeight: 700, color: colors.text.primary, marginBottom: 12, fontFamily: typography.fontFamily.heading }}>
          {title}
        </div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
        {/* Grid */}
        {xTicks.map((v) => (
          <g key={`x${v}`}>
            <line x1={px(v)} y1={MARGIN.top} x2={px(v)} y2={MARGIN.top + plotH}
              stroke={colors.border} strokeWidth={0.8} strokeDasharray="4 3" />
            <text x={px(v)} y={H - 20} fontSize={9} fill={colors.text.muted}
              textAnchor="middle" fontFamily={typography.fontFamily.body}>{formatValue(v)}</text>
          </g>
        ))}
        {yTicks.map((v) => (
          <g key={`y${v}`}>
            <line x1={MARGIN.left} y1={py(v)} x2={MARGIN.left + plotW} y2={py(v)}
              stroke={colors.border} strokeWidth={0.8} strokeDasharray="4 3" />
            <text x={MARGIN.left - 6} y={py(v) + 3.5} fontSize={9} fill={colors.text.muted}
              textAnchor="end" fontFamily={typography.fontFamily.body}>{formatValue(v)}</text>
          </g>
        ))}
        {/* Axis labels */}
        {xLabel && <text x={MARGIN.left + plotW / 2} y={H - 4} fontSize={10} fill={colors.text.secondary}
          textAnchor="middle" fontFamily={typography.fontFamily.body}>{xLabel}</text>}
        {yLabel && <text x={10} y={MARGIN.top + plotH / 2} fontSize={10} fill={colors.text.secondary}
          textAnchor="middle" fontFamily={typography.fontFamily.body}
          transform={`rotate(-90 10 ${MARGIN.top + plotH / 2})`}>{yLabel}</text>}

        {/* Points */}
        {points.map((pt, i) => {
          const color = pt.color || PALETTE[i % PALETTE.length];
          const isHov = hoveredIdx === i;
          const dimmed = hoveredIdx !== null && !isHov;
          const r = pt.size || 6;
          return (
            <circle key={i} cx={px(pt.x)} cy={py(pt.y)} r={isHov ? r + 3 : r}
              fill={color} opacity={dimmed ? 0.2 : 0.75}
              stroke={isHov ? "#fff" : "none"} strokeWidth={2}
              style={{ cursor: "default", transition: "all 0.12s" }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          );
        })}

        {/* Tooltip */}
        {hoveredIdx !== null && (() => {
          const pt = points[hoveredIdx];
          const text = `${pt.label || `#${hoveredIdx + 1}`}: (${formatValue(pt.x)}, ${formatValue(pt.y)})`;
          const tx = px(pt.x), ty = py(pt.y) - 16;
          const tw = Math.max(100, text.length * 5.5 + 16);
          return (
            <g>
              <rect x={tx - tw / 2} y={ty - 14} width={tw} height={20} rx={6}
                fill={colors.text.primary} opacity={0.9} />
              <text x={tx} y={ty - 1} fontSize={10} fill="#fff" textAnchor="middle"
                fontFamily={typography.fontFamily.body}>{text}</text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}
