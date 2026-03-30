import { useState, useMemo } from "react";
import { colors, typography } from "../../../styles/tokens";
import { formatValue } from "../../../lib/chartUtils";

export function WaterfallChartBlock({ block }) {
  const d = block.data || {};
  const items = d.items || [];
  const title = d.title || "";
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Compute running totals
  const segments = useMemo(() => {
    let running = 0;
    return items.map((it) => {
      const val = it.value || 0;
      const type = it.type || "increase";
      let y0, y1;
      if (type === "total") {
        y0 = 0;
        y1 = val;
        running = val;
      } else {
        y0 = running;
        running += val;
        y1 = running;
      }
      return { label: it.label || "", val, type, y0, y1, total: running };
    });
  }, [items]);

  if (!items.length) {
    return (
      <div style={{ padding: 32, textAlign: "center", color: colors.text.muted, fontFamily: typography.fontFamily.body, fontSize: 13 }}>
        Aucune donnée
      </div>
    );
  }

  const allY = segments.flatMap((s) => [s.y0, s.y1]);
  const minY = Math.min(...allY, 0);
  const maxY = Math.max(...allY, 10);
  const range = maxY - minY || 10;

  const MARGIN = { top: 16, right: 16, bottom: 40, left: 48 };
  const W = 500, H = 260;
  const plotW = W - MARGIN.left - MARGIN.right;
  const plotH = H - MARGIN.top - MARGIN.bottom;
  const barW = Math.min(50, plotW / segments.length * 0.6);
  const groupW = plotW / segments.length;

  function py(v) { return MARGIN.top + plotH - ((v - minY) / range) * plotH; }

  const COLORS = {
    increase: "#2ecc71",
    decrease: "#e74c3c",
    total: "#5B8FD4",
  };

  return (
    <div style={{ padding: "12px 0", fontFamily: typography.fontFamily.body }}>
      {title && (
        <div style={{ fontSize: 15, fontWeight: 700, color: colors.text.primary, marginBottom: 12, fontFamily: typography.fontFamily.heading }}>
          {title}
        </div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
        {/* Zero line */}
        <line x1={MARGIN.left} y1={py(0)} x2={MARGIN.left + plotW} y2={py(0)}
          stroke={colors.text.muted} strokeWidth={1} opacity={0.4} />
        {/* Y axis ticks */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const v = minY + (range / 5) * i;
          return (
            <g key={i}>
              <line x1={MARGIN.left} y1={py(v)} x2={MARGIN.left + plotW} y2={py(v)}
                stroke={colors.border} strokeWidth={0.8} strokeDasharray="4 3" opacity={0.5} />
              <text x={MARGIN.left - 6} y={py(v) + 3.5} fontSize={9} fill={colors.text.muted}
                textAnchor="end" fontFamily={typography.fontFamily.body}>{formatValue(Math.round(v))}</text>
            </g>
          );
        })}

        {segments.map((seg, i) => {
          const cx = MARGIN.left + i * groupW + groupW / 2;
          const top = py(Math.max(seg.y0, seg.y1));
          const bot = py(Math.min(seg.y0, seg.y1));
          const h = Math.max(1, bot - top);
          const color = COLORS[seg.type] || COLORS.increase;
          const isHov = hoveredIdx === i;
          const dimmed = hoveredIdx !== null && !isHov;

          return (
            <g key={i}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ cursor: "default" }}
            >
              <rect x={cx - barW / 2} y={top} width={barW} height={h} rx={4}
                fill={color} opacity={dimmed ? 0.2 : 0.75}
                style={{ transition: "opacity 0.12s" }}
              />
              {/* Connector line to next */}
              {i < segments.length - 1 && seg.type !== "total" && (
                <line x1={cx + barW / 2} y1={py(seg.y1)}
                  x2={MARGIN.left + (i + 1) * groupW + groupW / 2 - barW / 2} y2={py(seg.y1)}
                  stroke={colors.text.muted} strokeWidth={1} strokeDasharray="3 2" opacity={0.4} />
              )}
              {/* Value label */}
              <text x={cx} y={top - 5} fontSize={9} fontWeight={600}
                fill={color} textAnchor="middle" fontFamily={typography.fontFamily.body}>
                {seg.type === "total" ? formatValue(seg.val) : (seg.val >= 0 ? "+" : "") + formatValue(seg.val)}
              </text>
              <text x={cx} y={H - 10} fontSize={9} fill={colors.text.secondary}
                textAnchor="middle" fontFamily={typography.fontFamily.body}>
                {seg.label.length > 8 ? seg.label.slice(0, 8) + "…" : seg.label}
              </text>
            </g>
          );
        })}

        {hoveredIdx !== null && (() => {
          const seg = segments[hoveredIdx];
          const cx = MARGIN.left + hoveredIdx * groupW + groupW / 2;
          const text = `${seg.label}: ${seg.type === "total" ? "" : seg.val >= 0 ? "+" : ""}${formatValue(seg.val)} (total: ${formatValue(seg.y1)})`;
          const tw = Math.max(120, text.length * 5 + 16);
          return (
            <g>
              <rect x={cx - tw / 2} y={MARGIN.top - 4} width={tw} height={20} rx={6}
                fill={colors.text.primary} opacity={0.9} />
              <text x={cx} y={MARGIN.top + 9} fontSize={10} fill="#fff" textAnchor="middle"
                fontFamily={typography.fontFamily.body}>{text}</text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}
