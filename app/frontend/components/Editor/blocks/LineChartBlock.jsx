import { useState, useMemo } from "react";
import { colors, typography } from "../../../styles/tokens";
import { PALETTE, formatValue, niceScale } from "../../../lib/chartUtils";

export function LineChartBlock({ block }) {
  const d = block.data || {};
  const labels = d.labels || [];
  const datasets = d.datasets || [];
  const title = d.title || "";
  const showDots = d.showDots !== false;
  const showArea = !!d.showArea;

  const [hovered, setHovered] = useState(null); // { dsIdx, ptIdx }

  const allVals = useMemo(() => datasets.flatMap((ds) => ds.values || []), [datasets]);
  const maxVal = useMemo(() => Math.max(...allVals, 0), [allVals]);
  const { max: scaleMax, step: scaleStep } = useMemo(() => niceScale(maxVal), [maxVal]);

  if (!labels.length || !datasets.length) {
    return (
      <div style={{ padding: 32, textAlign: "center", color: colors.text.muted, fontFamily: typography.fontFamily.body, fontSize: 13 }}>
        Aucune donnée — configurez le graphique dans l{"'"}éditeur
      </div>
    );
  }

  const MARGIN = { top: 12, right: 16, bottom: 36, left: 44 };
  const W = 500, H = 240;
  const plotW = W - MARGIN.left - MARGIN.right;
  const plotH = H - MARGIN.top - MARGIN.bottom;

  const ticks = [];
  for (let v = 0; v <= scaleMax; v += scaleStep) ticks.push(Math.round(v * 100) / 100);

  const xStep = labels.length > 1 ? plotW / (labels.length - 1) : plotW / 2;

  function ptX(i) { return MARGIN.left + (labels.length > 1 ? i * xStep : plotW / 2); }
  function ptY(v) { return MARGIN.top + plotH - (v / scaleMax) * plotH; }

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
          const y = ptY(v);
          return (
            <g key={v}>
              <line x1={MARGIN.left} y1={y} x2={MARGIN.left + plotW} y2={y}
                stroke={colors.border} strokeWidth={0.8} strokeDasharray={v === 0 ? "none" : "4 3"} />
              <text x={MARGIN.left - 6} y={y + 3.5} fontSize={10} fill={colors.text.muted}
                textAnchor="end" fontFamily={typography.fontFamily.body}>{formatValue(v)}</text>
            </g>
          );
        })}
        {/* X labels */}
        {labels.map((l, i) => (
          <text key={i} x={ptX(i)} y={H - 6} fontSize={10} fill={colors.text.secondary}
            textAnchor="middle" fontFamily={typography.fontFamily.body}>
            {l.length > 8 ? l.slice(0, 8) + "…" : l}
          </text>
        ))}
        {/* Axes */}
        <line x1={MARGIN.left} y1={MARGIN.top} x2={MARGIN.left} y2={MARGIN.top + plotH}
          stroke={colors.text.muted} strokeWidth={1} opacity={0.3} />
        <line x1={MARGIN.left} y1={MARGIN.top + plotH} x2={MARGIN.left + plotW} y2={MARGIN.top + plotH}
          stroke={colors.text.muted} strokeWidth={1} opacity={0.3} />

        {/* Datasets */}
        {datasets.map((ds, dsIdx) => {
          const vals = ds.values || [];
          const color = ds.color || PALETTE[dsIdx % PALETTE.length];
          const points = vals.map((v, i) => `${ptX(i)},${ptY(v)}`).join(" ");
          const dimmed = hovered !== null && hovered.dsIdx !== dsIdx;

          return (
            <g key={dsIdx} opacity={dimmed ? 0.2 : 1} style={{ transition: "opacity 0.15s" }}>
              {/* Area fill */}
              {showArea && vals.length > 1 && (
                <polygon
                  points={`${ptX(0)},${MARGIN.top + plotH} ${points} ${ptX(vals.length - 1)},${MARGIN.top + plotH}`}
                  fill={color} opacity={0.08}
                />
              )}
              {/* Line */}
              <polyline points={points} fill="none" stroke={color} strokeWidth={2.5}
                strokeLinejoin="round" strokeLinecap="round" />
              {/* Dots */}
              {showDots && vals.map((v, i) => (
                <circle key={i} cx={ptX(i)} cy={ptY(v)} r={hovered?.dsIdx === dsIdx && hovered?.ptIdx === i ? 6 : 4}
                  fill={color} stroke="#fff" strokeWidth={2}
                  style={{ cursor: "default", transition: "r 0.12s" }}
                  onMouseEnter={() => setHovered({ dsIdx, ptIdx: i })}
                  onMouseLeave={() => setHovered(null)}
                />
              ))}
            </g>
          );
        })}

        {/* Tooltip */}
        {hovered && (() => {
          const ds = datasets[hovered.dsIdx];
          const val = ds?.values?.[hovered.ptIdx];
          const label = labels[hovered.ptIdx] || "";
          if (val == null) return null;
          const tx = ptX(hovered.ptIdx);
          const ty = ptY(val) - 16;
          const text = `${ds.name || "Série"}: ${formatValue(val)}`;
          const tw = Math.max(80, text.length * 6 + 16);
          return (
            <g>
              <rect x={tx - tw / 2} y={ty - 14} width={tw} height={20} rx={6}
                fill={colors.text.primary} opacity={0.9} />
              <text x={tx} y={ty - 1} fontSize={10} fill="#fff" textAnchor="middle"
                fontFamily={typography.fontFamily.body}>{text}</text>
            </g>
          );
        })()}

        {/* Legend */}
        {datasets.length > 1 && datasets.map((ds, i) => (
          <g key={i}>
            <rect x={MARGIN.left + i * 100} y={2} width={10} height={10} rx={3}
              fill={ds.color || PALETTE[i % PALETTE.length]} />
            <text x={MARGIN.left + i * 100 + 14} y={10} fontSize={9} fill={colors.text.muted}
              fontFamily={typography.fontFamily.body}>{ds.name || `Série ${i + 1}`}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
