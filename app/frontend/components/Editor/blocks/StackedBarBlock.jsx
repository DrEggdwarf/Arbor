import { useState, useMemo } from "react";
import { colors, typography } from "../../../styles/tokens";
import { PALETTE, formatValue, niceScale } from "../../../lib/chartUtils";

export function StackedBarBlock({ block }) {
  const d = block.data || {};
  const labels = d.labels || [];
  const series = d.series || [];
  const title = d.title || "";
  const horizontal = d.orientation === "horizontal";
  const [hovered, setHovered] = useState(null);

  const totals = useMemo(() => {
    return labels.map((_, i) => series.reduce((s, sr) => s + ((sr.values || [])[i] || 0), 0));
  }, [labels, series]);
  const maxTotal = useMemo(() => Math.max(...totals, 0), [totals]);
  const { max: scaleMax, step: scaleStep } = useMemo(() => niceScale(maxTotal), [maxTotal]);

  if (!labels.length || !series.length) {
    return (
      <div style={{ padding: 32, textAlign: "center", color: colors.text.muted, fontFamily: typography.fontFamily.body, fontSize: 13 }}>
        Aucune donnée
      </div>
    );
  }

  const MARGIN = { top: 12, right: 16, bottom: 36, left: horizontal ? 80 : 44 };
  const W = 500, H_V = 240;
  const H = horizontal ? Math.max(180, labels.length * 36) : H_V;
  const plotW = W - MARGIN.left - MARGIN.right;
  const plotH = H - MARGIN.top - MARGIN.bottom;

  const ticks = [];
  for (let v = 0; v <= scaleMax; v += scaleStep) ticks.push(Math.round(v * 100) / 100);

  return (
    <div style={{ padding: "12px 0", fontFamily: typography.fontFamily.body }}>
      {title && (
        <div style={{ fontSize: 15, fontWeight: 700, color: colors.text.primary, marginBottom: 12, fontFamily: typography.fontFamily.heading }}>
          {title}
        </div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
        {/* Grid */}
        {ticks.map((v) => {
          const pct = v / scaleMax;
          if (horizontal) {
            const x = MARGIN.left + pct * plotW;
            return (
              <g key={v}>
                <line x1={x} y1={MARGIN.top} x2={x} y2={MARGIN.top + plotH}
                  stroke={colors.border} strokeWidth={0.8} strokeDasharray={v === 0 ? "none" : "4 3"} />
                <text x={x} y={H - 6} fontSize={10} fill={colors.text.muted}
                  textAnchor="middle" fontFamily={typography.fontFamily.body}>{formatValue(v)}</text>
              </g>
            );
          }
          const y = MARGIN.top + plotH - pct * plotH;
          return (
            <g key={v}>
              <line x1={MARGIN.left} y1={y} x2={MARGIN.left + plotW} y2={y}
                stroke={colors.border} strokeWidth={0.8} strokeDasharray={v === 0 ? "none" : "4 3"} />
              <text x={MARGIN.left - 6} y={y + 3.5} fontSize={10} fill={colors.text.muted}
                textAnchor="end" fontFamily={typography.fontFamily.body}>{formatValue(v)}</text>
            </g>
          );
        })}

        {/* Stacked bars */}
        {labels.map((label, li) => {
          let acc = 0;
          const gap = horizontal ? plotH / labels.length : plotW / labels.length;
          const barSize = Math.min(horizontal ? 28 : 48, gap * 0.65);

          return (
            <g key={li}>
              {series.map((sr, si) => {
                const val = (sr.values || [])[li] || 0;
                const pct = scaleMax > 0 ? val / scaleMax : 0;
                const color = sr.color || PALETTE[si % PALETTE.length];
                const isHov = hovered?.li === li && hovered?.si === si;
                const dimmed = hovered !== null && !isHov;

                let rect;
                if (horizontal) {
                  const x = MARGIN.left + (acc / scaleMax) * plotW;
                  const y = MARGIN.top + li * gap + (gap - barSize) / 2;
                  const w = pct * plotW;
                  rect = { x, y, width: w, height: barSize };
                } else {
                  const barH = pct * plotH;
                  const x = MARGIN.left + li * gap + (gap - barSize) / 2;
                  const y = MARGIN.top + plotH - (acc / scaleMax) * plotH - barH;
                  rect = { x, y, width: barSize, height: barH };
                }
                acc += val;

                return (
                  <rect key={si} {...rect} rx={si === series.length - 1 ? 4 : 0}
                    fill={color} opacity={dimmed ? 0.3 : 0.8}
                    style={{ transition: "opacity 0.15s" }}
                    onMouseEnter={() => setHovered({ li, si, val, name: sr.name || `Série ${si + 1}`, label })}
                    onMouseLeave={() => setHovered(null)}
                  />
                );
              })}
              {/* Label */}
              {horizontal ? (
                <text x={MARGIN.left - 6} y={MARGIN.top + li * gap + gap / 2 + 4}
                  fontSize={10} fill={colors.text.secondary} textAnchor="end" fontFamily={typography.fontFamily.body}>
                  {label.length > 10 ? label.slice(0, 10) + "…" : label}
                </text>
              ) : (
                <text x={MARGIN.left + li * gap + gap / 2} y={MARGIN.top + plotH + 16}
                  fontSize={10} fill={colors.text.secondary} textAnchor="middle" fontFamily={typography.fontFamily.body}>
                  {label.length > 8 ? label.slice(0, 8) + "…" : label}
                </text>
              )}
            </g>
          );
        })}

        {/* Axes */}
        <line x1={MARGIN.left} y1={MARGIN.top} x2={MARGIN.left} y2={MARGIN.top + plotH}
          stroke={colors.text.muted} strokeWidth={1} opacity={0.3} />
        <line x1={MARGIN.left} y1={MARGIN.top + plotH} x2={MARGIN.left + plotW} y2={MARGIN.top + plotH}
          stroke={colors.text.muted} strokeWidth={1} opacity={0.3} />

        {/* Legend */}
        {series.map((sr, i) => (
          <g key={i}>
            <rect x={MARGIN.left + i * 90} y={1} width={10} height={10} rx={3}
              fill={sr.color || PALETTE[i % PALETTE.length]} />
            <text x={MARGIN.left + i * 90 + 14} y={9} fontSize={9} fill={colors.text.muted}
              fontFamily={typography.fontFamily.body}>{sr.name || `Série ${i + 1}`}</text>
          </g>
        ))}

        {/* Tooltip */}
        {hovered && (() => {
          const text = `${hovered.label} — ${hovered.name}: ${formatValue(hovered.val)}`;
          const tw = Math.max(100, text.length * 5.5 + 16);
          return (
            <g>
              <rect x={W / 2 - tw / 2} y={MARGIN.top - 4} width={tw} height={20} rx={6}
                fill={colors.text.primary} opacity={0.9} />
              <text x={W / 2} y={MARGIN.top + 9} fontSize={10} fill="#fff" textAnchor="middle"
                fontFamily={typography.fontFamily.body}>{text}</text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}
