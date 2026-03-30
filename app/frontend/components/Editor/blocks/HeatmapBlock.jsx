import { useState } from "react";
import { colors, typography } from "../../../styles/tokens";
import { lerpColor } from "../../../lib/chartUtils";

export function HeatmapBlock({ block }) {
  const d = block.data || {};
  const xLabels = d.xLabels || [];
  const yLabels = d.yLabels || [];
  const data = d.data || [];
  const title = d.title || "";
  const minColor = d.minColor || "#f0ede6";
  const maxColor = d.maxColor || "#e74c3c";
  const [hovered, setHovered] = useState(null);

  if (!xLabels.length || !yLabels.length || !data.length) {
    return (
      <div style={{ padding: 32, textAlign: "center", color: colors.text.muted, fontFamily: typography.fontFamily.body, fontSize: 13 }}>
        Aucune donnée — configurez la heatmap dans l{"'"}éditeur
      </div>
    );
  }

  const allVals = data.flat();
  const minVal = Math.min(...allVals);
  const maxVal = Math.max(...allVals);
  const range = maxVal - minVal || 1;

  const MARGIN = { top: 8, right: 12, bottom: 32, left: 70 };
  const cellW = 40, cellH = 28, gap = 2;
  const W = MARGIN.left + xLabels.length * (cellW + gap) + MARGIN.right;
  const H = MARGIN.top + yLabels.length * (cellH + gap) + MARGIN.bottom;

  return (
    <div style={{ padding: "12px 0", fontFamily: typography.fontFamily.body }}>
      {title && (
        <div style={{ fontSize: 15, fontWeight: 700, color: colors.text.primary, marginBottom: 12, fontFamily: typography.fontFamily.heading }}>
          {title}
        </div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
        {/* X labels */}
        {xLabels.map((l, ci) => (
          <text key={ci} x={MARGIN.left + ci * (cellW + gap) + cellW / 2} y={H - 8}
            fontSize={9} fill={colors.text.secondary} textAnchor="middle" fontFamily={typography.fontFamily.body}>
            {l.length > 6 ? l.slice(0, 6) + "…" : l}
          </text>
        ))}
        {/* Y labels */}
        {yLabels.map((l, ri) => (
          <text key={ri} x={MARGIN.left - 6} y={MARGIN.top + ri * (cellH + gap) + cellH / 2 + 4}
            fontSize={9} fill={colors.text.secondary} textAnchor="end" fontFamily={typography.fontFamily.body}>
            {l.length > 8 ? l.slice(0, 8) + "…" : l}
          </text>
        ))}
        {/* Cells */}
        {data.map((row, ri) => row.map((val, ci) => {
          const t = (val - minVal) / range;
          const isHov = hovered?.r === ri && hovered?.c === ci;
          return (
            <g key={`${ri}-${ci}`}
              onMouseEnter={() => setHovered({ r: ri, c: ci, val })}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "default" }}
            >
              <rect
                x={MARGIN.left + ci * (cellW + gap)}
                y={MARGIN.top + ri * (cellH + gap)}
                width={cellW} height={cellH} rx={4}
                fill={lerpColor(minColor, maxColor, t)}
                stroke={isHov ? colors.text.primary : "transparent"} strokeWidth={isHov ? 1.5 : 0}
                opacity={hovered && !isHov ? 0.5 : 1}
                style={{ transition: "opacity 0.12s" }}
              />
              <text
                x={MARGIN.left + ci * (cellW + gap) + cellW / 2}
                y={MARGIN.top + ri * (cellH + gap) + cellH / 2 + 4}
                fontSize={10} fontWeight={600} textAnchor="middle"
                fill={t > 0.5 ? "#fff" : colors.text.primary}
                fontFamily={typography.fontFamily.body} opacity={0.8}>
                {val}
              </text>
            </g>
          );
        }))}
        {/* Tooltip */}
        {hovered && (() => {
          const cx = MARGIN.left + hovered.c * (cellW + gap) + cellW / 2;
          const cy = MARGIN.top + hovered.r * (cellH + gap) - 4;
          const text = `${yLabels[hovered.r] || ""} × ${xLabels[hovered.c] || ""}: ${hovered.val}`;
          const tw = Math.max(100, text.length * 5.5 + 16);
          return (
            <g>
              <rect x={cx - tw / 2} y={cy - 18} width={tw} height={20} rx={6}
                fill={colors.text.primary} opacity={0.9} />
              <text x={cx} y={cy - 5} fontSize={10} fill="#fff" textAnchor="middle"
                fontFamily={typography.fontFamily.body}>{text}</text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}
