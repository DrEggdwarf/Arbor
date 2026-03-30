import { useState } from "react";
import { colors, typography } from "../../../styles/tokens";

function gaugeColor(pct) {
  if (pct >= 0.75) return "#2ecc71";
  if (pct >= 0.5) return "#E8A855";
  if (pct >= 0.25) return "#e67e22";
  return "#e74c3c";
}

export function GaugeChartBlock({ block }) {
  const d = block.data || {};
  const value = d.value ?? 0;
  const max = d.max || 100;
  const title = d.title || "";
  const unit = d.unit || "";
  const color = d.color || gaugeColor(value / max);
  const [hovered, setHovered] = useState(false);

  const pct = Math.max(0, Math.min(value / max, 1));
  const W = 260, H = 160;
  const CX = W / 2, CY = 130, R = 100;
  const startAngle = Math.PI;
  const endAngle = 0;
  const sweepAngle = startAngle - (startAngle - endAngle) * pct;

  function arcPoint(angle, r) {
    return { x: CX + r * Math.cos(angle), y: CY - r * Math.sin(angle) };
  }

  const bgStart = arcPoint(startAngle, R);
  const bgEnd = arcPoint(endAngle, R);
  const valEnd = arcPoint(sweepAngle, R);
  const largeArc = 0;

  return (
    <div style={{ padding: "12px 0", fontFamily: typography.fontFamily.body, textAlign: "center" }}>
      {title && (
        <div style={{ fontSize: 15, fontWeight: 700, color: colors.text.primary, marginBottom: 8, fontFamily: typography.fontFamily.heading }}>
          {title}
        </div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: 280, height: "auto", display: "inline-block" }}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        {/* Background arc */}
        <path d={`M${bgStart.x},${bgStart.y} A${R},${R} 0 0 1 ${bgEnd.x},${bgEnd.y}`}
          fill="none" stroke={colors.border} strokeWidth={16} strokeLinecap="round" opacity={0.4} />
        {/* Value arc */}
        <path d={`M${bgStart.x},${bgStart.y} A${R},${R} 0 ${largeArc} 1 ${valEnd.x},${valEnd.y}`}
          fill="none" stroke={color} strokeWidth={16} strokeLinecap="round"
          opacity={hovered ? 1 : 0.8} style={{ transition: "opacity 0.15s" }} />
        {/* Center value */}
        <text x={CX} y={CY - 20} fontSize={32} fontWeight={700} fill={color}
          textAnchor="middle" fontFamily={typography.fontFamily.body}>
          {value}{unit}
        </text>
        <text x={CX} y={CY} fontSize={12} fill={colors.text.muted}
          textAnchor="middle" fontFamily={typography.fontFamily.body}>
          / {max}{unit}
        </text>
        {/* Scale markers */}
        <text x={bgStart.x + 5} y={CY + 16} fontSize={9} fill={colors.text.muted}
          textAnchor="start" fontFamily={typography.fontFamily.body}>0</text>
        <text x={bgEnd.x - 5} y={CY + 16} fontSize={9} fill={colors.text.muted}
          textAnchor="end" fontFamily={typography.fontFamily.body}>{max}</text>
        {/* Tooltip */}
        {hovered && (() => {
          const tip = arcPoint(sweepAngle, R + 22);
          return (
            <g>
              <rect x={tip.x - 52} y={tip.y - 16} width={104} height={22} rx={6}
                fill={colors.text.primary} opacity={0.9} />
              <text x={tip.x} y={tip.y + 1} fontSize={11} fill="#fff" textAnchor="middle"
                fontFamily={typography.fontFamily.body}>
                {(pct * 100).toFixed(1)}% — {value}/{max}
              </text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}
