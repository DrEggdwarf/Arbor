import { useState, useMemo } from "react";
import { colors, typography } from "../../../styles/tokens";
import { PALETTE } from "../../../lib/chartUtils";

export function PieChartBlock({ block }) {
  const d = block.data || {};
  const items = d.items || [];
  const title = d.title || "";
  const donut = !!d.donut;
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const total = useMemo(() => items.reduce((s, it) => s + (it.value || 0), 0), [items]);

  if (!items.length || total === 0) {
    return (
      <div style={{ padding: 32, textAlign: "center", color: colors.text.muted, fontFamily: typography.fontFamily.body, fontSize: 13 }}>
        Aucune donnée — configurez le graphique dans l{"'"}éditeur
      </div>
    );
  }

  const CX = 130, CY = 120, R = 90, IR = donut ? 50 : 0;
  const W = 380, H = 240;

  function arcPath(startAngle, endAngle, outerR, innerR) {
    const sa = startAngle - Math.PI / 2;
    const ea = endAngle - Math.PI / 2;
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    const x1 = CX + outerR * Math.cos(sa), y1 = CY + outerR * Math.sin(sa);
    const x2 = CX + outerR * Math.cos(ea), y2 = CY + outerR * Math.sin(ea);
    if (innerR > 0) {
      const x3 = CX + innerR * Math.cos(ea), y3 = CY + innerR * Math.sin(ea);
      const x4 = CX + innerR * Math.cos(sa), y4 = CY + innerR * Math.sin(sa);
      return `M${x1},${y1} A${outerR},${outerR} 0 ${largeArc} 1 ${x2},${y2} L${x3},${y3} A${innerR},${innerR} 0 ${largeArc} 0 ${x4},${y4} Z`;
    }
    return `M${CX},${CY} L${x1},${y1} A${outerR},${outerR} 0 ${largeArc} 1 ${x2},${y2} Z`;
  }

  let angle = 0;
  const slices = items.map((item, i) => {
    const pct = (item.value || 0) / total;
    const start = angle;
    const end = angle + pct * 2 * Math.PI;
    angle = end;
    const mid = (start + end) / 2 - Math.PI / 2;
    return { ...item, start, end, pct, mid, color: item.color || PALETTE[i % PALETTE.length] };
  });

  return (
    <div style={{ padding: "12px 0", fontFamily: typography.fontFamily.body }}>
      {title && (
        <div style={{ fontSize: 15, fontWeight: 700, color: colors.text.primary, marginBottom: 12, fontFamily: typography.fontFamily.heading }}>
          {title}
        </div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
        {slices.map((sl, i) => {
          const isHov = hoveredIdx === i;
          const explode = isHov ? 6 : 0;
          const dx = explode * Math.cos(sl.mid);
          const dy = explode * Math.sin(sl.mid);
          const dimmed = hoveredIdx !== null && !isHov;
          return (
            <g key={i}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ cursor: "default" }}
            >
              <path
                d={arcPath(sl.start, sl.end, R, IR)}
                fill={sl.color}
                opacity={dimmed ? 0.3 : 0.85}
                transform={`translate(${dx},${dy})`}
                style={{ transition: "opacity 0.15s, transform 0.15s" }}
              />
            </g>
          );
        })}

        {/* Center label for donut */}
        {donut && (
          <text x={CX} y={CY + 5} fontSize={18} fontWeight={700} fill={colors.text.primary}
            textAnchor="middle" fontFamily={typography.fontFamily.body}>{total}</text>
        )}

        {/* Tooltip */}
        {hoveredIdx !== null && (() => {
          const sl = slices[hoveredIdx];
          const tx = CX + (R + 20) * Math.cos(sl.mid);
          const ty = CY + (R + 20) * Math.sin(sl.mid);
          const text = `${sl.label}: ${sl.value} (${(sl.pct * 100).toFixed(1)}%)`;
          const tw = Math.max(90, text.length * 5.8 + 16);
          return (
            <g>
              <rect x={tx - tw / 2} y={ty - 10} width={tw} height={20} rx={6}
                fill={colors.text.primary} opacity={0.9} />
              <text x={tx} y={ty + 3} fontSize={10} fill="#fff" textAnchor="middle"
                fontFamily={typography.fontFamily.body}>{text}</text>
            </g>
          );
        })()}

        {/* Legend */}
        {slices.map((sl, i) => (
          <g key={i}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{ cursor: "default" }}
          >
            <rect x={W - 130} y={20 + i * 22} width={12} height={12} rx={3} fill={sl.color}
              opacity={hoveredIdx !== null && hoveredIdx !== i ? 0.3 : 0.85} />
            <text x={W - 114} y={30 + i * 22} fontSize={11}
              fill={hoveredIdx !== null && hoveredIdx !== i ? colors.text.muted : colors.text.secondary}
              fontFamily={typography.fontFamily.body}>
              {sl.label?.length > 12 ? sl.label.slice(0, 12) + "…" : sl.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
