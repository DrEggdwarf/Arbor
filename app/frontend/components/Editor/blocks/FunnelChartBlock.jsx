import { useState, useMemo } from "react";
import { colors, typography } from "../../../styles/tokens";
import { PALETTE } from "../../../lib/chartUtils";

export function FunnelChartBlock({ block }) {
  const d = block.data || {};
  const items = d.items || [];
  const title = d.title || "";
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const maxVal = useMemo(() => Math.max(...items.map((it) => it.value || 0), 1), [items]);

  if (!items.length) {
    return (
      <div style={{ padding: 32, textAlign: "center", color: colors.text.muted, fontFamily: typography.fontFamily.body, fontSize: 13 }}>
        Aucune donnée
      </div>
    );
  }

  const W = 400, SEGMENT_H = 36, GAP = 3;
  const H = items.length * (SEGMENT_H + GAP) + 40;
  const MAX_W = W - 60;

  return (
    <div style={{ padding: "12px 0", fontFamily: typography.fontFamily.body, textAlign: "center" }}>
      {title && (
        <div style={{ fontSize: 15, fontWeight: 700, color: colors.text.primary, marginBottom: 12, fontFamily: typography.fontFamily.heading }}>
          {title}
        </div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: W, height: "auto", display: "block", margin: "0 auto" }}
        overflow="visible">
        {items.map((it, i) => {
          const pct = (it.value || 0) / maxVal;
          const nextPct = i < items.length - 1 ? (items[i + 1].value || 0) / maxVal : pct * 0.7;
          const topW = pct * MAX_W;
          const botW = nextPct * MAX_W;
          const cx = W / 2;
          const y = i * (SEGMENT_H + GAP) + 8;
          const color = it.color || PALETTE[i % PALETTE.length];
          const isHov = hoveredIdx === i;
          const dimmed = hoveredIdx !== null && !isHov;

          const points = [
            `${cx - topW / 2},${y}`,
            `${cx + topW / 2},${y}`,
            `${cx + botW / 2},${y + SEGMENT_H}`,
            `${cx - botW / 2},${y + SEGMENT_H}`,
          ].join(" ");

          const labelText = `${it.label || ""} — ${it.value}`;
          const minW = Math.min(topW, botW);
          const clipW = Math.max(minW - 8, 20);

          return (
            <g key={i}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ cursor: "default" }}
            >
              <defs>
                <clipPath id={`funnel-clip-${i}`}>
                  <rect x={cx - clipW / 2} y={y} width={clipW} height={SEGMENT_H} />
                </clipPath>
              </defs>
              <polygon points={points} fill={color}
                opacity={dimmed ? 0.2 : 0.8}
                style={{ transition: "opacity 0.12s" }}
              />
              <text x={cx} y={y + SEGMENT_H / 2 + 4}
                fontSize={11} fontWeight={700} fill="#fff" textAnchor="middle"
                fontFamily={typography.fontFamily.body}
                clipPath={`url(#funnel-clip-${i})`}>
                {labelText}
              </text>
              {isHov && (
                <text x={cx + topW / 2 + 8} y={y + SEGMENT_H / 2 + 4}
                  fontSize={10} fill={colors.text.secondary}
                  fontFamily={typography.fontFamily.body}>
                  {Math.round(pct * 100)}%
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
