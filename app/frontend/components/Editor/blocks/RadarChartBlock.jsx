import { useState } from "react";
import { colors, typography } from "../../../styles/tokens";
import { PALETTE } from "../../../lib/chartUtils";

export function RadarChartBlock({ block }) {
  const d = block.data || {};
  const axes = d.axes || [];
  const title = d.title || "";
  const fillColor = d.color || "#E8A855";
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (axes.length < 3) {
    return (
      <div style={{ padding: 32, textAlign: "center", color: colors.text.muted, fontFamily: typography.fontFamily.body, fontSize: 13 }}>
        Minimum 3 axes requis
      </div>
    );
  }

  const W = 320, H = 280;
  const CX = W / 2, CY = 140, R = 100;
  const n = axes.length;

  function polarXY(i, r) {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
  }

  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <div style={{ padding: "12px 0", fontFamily: typography.fontFamily.body, textAlign: "center" }}>
      {title && (
        <div style={{ fontSize: 15, fontWeight: 700, color: colors.text.primary, marginBottom: 12, fontFamily: typography.fontFamily.heading }}>
          {title}
        </div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: 360, height: "auto", display: "inline-block" }}>
        {/* Grid levels */}
        {levels.map((lv) => (
          <polygon key={lv}
            points={Array.from({ length: n }, (_, i) => {
              const p = polarXY(i, R * lv);
              return `${p.x},${p.y}`;
            }).join(" ")}
            fill="none" stroke={colors.border} strokeWidth={0.8} opacity={0.5}
          />
        ))}
        {/* Axis lines */}
        {axes.map((_, i) => {
          const p = polarXY(i, R);
          return <line key={i} x1={CX} y1={CY} x2={p.x} y2={p.y}
            stroke={colors.border} strokeWidth={0.8} opacity={0.4} />;
        })}

        {/* Data polygon */}
        <polygon
          points={axes.map((ax, i) => {
            const pct = Math.max(0, Math.min((ax.value || 0) / (ax.max || 10), 1));
            const p = polarXY(i, R * pct);
            return `${p.x},${p.y}`;
          }).join(" ")}
          fill={fillColor} fillOpacity={0.15}
          stroke={fillColor} strokeWidth={2.5}
          strokeLinejoin="round"
        />

        {/* Data points */}
        {axes.map((ax, i) => {
          const pct = Math.max(0, Math.min((ax.value || 0) / (ax.max || 10), 1));
          const p = polarXY(i, R * pct);
          const isHov = hoveredIdx === i;
          return (
            <circle key={i} cx={p.x} cy={p.y} r={isHov ? 6 : 4}
              fill={fillColor} stroke="#fff" strokeWidth={2}
              style={{ cursor: "default", transition: "r 0.12s" }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          );
        })}

        {/* Labels */}
        {axes.map((ax, i) => {
          const p = polarXY(i, R + 18);
          return (
            <text key={i} x={p.x} y={p.y + 4} fontSize={10}
              fill={hoveredIdx === i ? colors.text.primary : colors.text.secondary}
              fontWeight={hoveredIdx === i ? 700 : 400}
              textAnchor="middle" fontFamily={typography.fontFamily.body}>
              {ax.label?.length > 10 ? ax.label.slice(0, 10) + "…" : ax.label}
            </text>
          );
        })}

        {/* Tooltip */}
        {hoveredIdx !== null && (() => {
          const ax = axes[hoveredIdx];
          const pct = Math.max(0, Math.min((ax.value || 0) / (ax.max || 10), 1));
          const p = polarXY(hoveredIdx, R * pct);
          const text = `${ax.label}: ${ax.value}/${ax.max}`;
          const tw = Math.max(80, text.length * 6 + 16);
          return (
            <g>
              <rect x={p.x - tw / 2} y={p.y - 26} width={tw} height={20} rx={6}
                fill={colors.text.primary} opacity={0.9} />
              <text x={p.x} y={p.y - 13} fontSize={10} fill="#fff" textAnchor="middle"
                fontFamily={typography.fontFamily.body}>{text}</text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}
