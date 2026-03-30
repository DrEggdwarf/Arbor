import { useState } from "react";
import { colors, typography } from "../../../styles/tokens";

export function SparklineBlock({ block }) {
  const d = block.data || {};
  const values = d.values || [];
  const color = d.color || "#E8A855";
  const title = d.title || "";
  const height = d.height || 48;
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!values.length) {
    return (
      <div style={{ padding: 16, textAlign: "center", color: colors.text.muted, fontFamily: typography.fontFamily.body, fontSize: 13 }}>
        Aucune donnée
      </div>
    );
  }

  const W = 260, H = height + 24;
  const MARGIN = { top: 8, right: 8, bottom: 16, left: 8 };
  const plotW = W - MARGIN.left - MARGIN.right;
  const plotH = H - MARGIN.top - MARGIN.bottom;
  const minV = Math.min(...values), maxV = Math.max(...values);
  const range = maxV - minV || 1;
  const xStep = values.length > 1 ? plotW / (values.length - 1) : plotW / 2;

  function px(i) { return MARGIN.left + i * xStep; }
  function py(v) { return MARGIN.top + plotH - ((v - minV) / range) * plotH; }

  const pts = values.map((v, i) => `${px(i)},${py(v)}`).join(" ");
  const areaPath = `${px(0)},${MARGIN.top + plotH} ${pts} ${px(values.length - 1)},${MARGIN.top + plotH}`;

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", gap: 4, fontFamily: typography.fontFamily.body }}>
      {title && (
        <span style={{ fontSize: 11, color: colors.text.secondary }}>{title}</span>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: W, height: H, display: "block" }}>
        <polygon points={areaPath} fill={color} opacity={0.1} />
        <polyline points={pts} fill="none" stroke={color} strokeWidth={2}
          strokeLinejoin="round" strokeLinecap="round" />
        {values.map((v, i) => (
          <circle key={i} cx={px(i)} cy={py(v)}
            r={hoveredIdx === i ? 5 : 0} fill={color} stroke="#fff" strokeWidth={1.5}
            style={{ transition: "r 0.1s" }}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          />
        ))}
        {/* Invisible wider hit targets */}
        {values.map((v, i) => (
          <circle key={`h${i}`} cx={px(i)} cy={py(v)} r={8} fill="transparent"
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          />
        ))}
        {hoveredIdx !== null && (() => {
          const val = values[hoveredIdx];
          const tx = px(hoveredIdx), ty = py(val) - 12;
          return (
            <g>
              <rect x={tx - 22} y={ty - 11} width={44} height={16} rx={5}
                fill={colors.text.primary} opacity={0.9} />
              <text x={tx} y={ty + 1} fontSize={10} fill="#fff" textAnchor="middle"
                fontFamily={typography.fontFamily.body}>{val}</text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}
