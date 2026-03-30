import { useState, useMemo } from "react";
import { colors, typography } from "../../../styles/tokens";
import { PALETTE, formatValue } from "../../../lib/chartUtils";

export function TreemapBlock({ block }) {
  const d = block.data || {};
  const items = d.items || [];
  const title = d.title || "";
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const total = useMemo(() => items.reduce((s, it) => s + (it.value || 0), 0), [items]);
  const sorted = useMemo(() =>
    [...items].map((it, i) => ({ ...it, origIdx: i })).sort((a, b) => (b.value || 0) - (a.value || 0)),
    [items]
  );

  if (!items.length) {
    return (
      <div style={{ padding: 32, textAlign: "center", color: colors.text.muted, fontFamily: typography.fontFamily.body, fontSize: 13 }}>
        Aucune donnée
      </div>
    );
  }

  const W = 480, H = 280, PAD = 3;

  // Simple squarified-ish layout: horizontal slicing
  const rects = useMemo(() => {
    const result = [];
    let x = 0, y = 0, remaining = total, w = W, h = H;
    const n = sorted.length;

    for (let i = 0; i < n; i++) {
      const val = sorted[i].value || 0;
      const frac = remaining > 0 ? val / remaining : 1 / (n - i);

      if (w >= h) {
        const rw = frac * w;
        result.push({ x, y, w: rw, h, item: sorted[i] });
        x += rw;
        w -= rw;
      } else {
        const rh = frac * h;
        result.push({ x, y, w, h: rh, item: sorted[i] });
        y += rh;
        h -= rh;
      }
      remaining -= val;
    }
    return result;
  }, [sorted, total]);

  return (
    <div style={{ padding: "12px 0", fontFamily: typography.fontFamily.body }}>
      {title && (
        <div style={{ fontSize: 15, fontWeight: 700, color: colors.text.primary, marginBottom: 12, fontFamily: typography.fontFamily.heading }}>
          {title}
        </div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
        {rects.map((r, i) => {
          const it = r.item;
          const color = it.color || PALETTE[it.origIdx % PALETTE.length];
          const isHov = hoveredIdx === it.origIdx;
          const dimmed = hoveredIdx !== null && !isHov;
          const pct = total > 0 ? Math.round((it.value / total) * 100) : 0;
          const rectW = r.w - PAD, rectH = r.h - PAD;

          return (
            <g key={i}
              onMouseEnter={() => setHoveredIdx(it.origIdx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ cursor: "default" }}
            >
              <rect x={r.x + PAD / 2} y={r.y + PAD / 2}
                width={Math.max(0, rectW)} height={Math.max(0, rectH)}
                rx={6} fill={color}
                opacity={dimmed ? 0.2 : 0.75}
                stroke={isHov ? "#fff" : "transparent"} strokeWidth={2}
                style={{ transition: "opacity 0.12s" }}
              />
              {rectW > 40 && rectH > 28 && (
                <>
                  <text x={r.x + r.w / 2} y={r.y + r.h / 2 - 2}
                    fontSize={rectW > 80 ? 12 : 9} fontWeight={700} fill="#fff" textAnchor="middle"
                    fontFamily={typography.fontFamily.body}>
                    {it.label && it.label.length > Math.floor(rectW / 7) ? it.label.slice(0, Math.floor(rectW / 7)) + "…" : it.label}
                  </text>
                  <text x={r.x + r.w / 2} y={r.y + r.h / 2 + 12}
                    fontSize={10} fill="#fff" opacity={0.8} textAnchor="middle"
                    fontFamily={typography.fontFamily.body}>
                    {formatValue(it.value)} ({pct}%)
                  </text>
                </>
              )}
            </g>
          );
        })}

        {hoveredIdx !== null && (() => {
          const it = items[hoveredIdx];
          if (!it) return null;
          const pct = total > 0 ? Math.round((it.value / total) * 100) : 0;
          const text = `${it.label}: ${formatValue(it.value)} (${pct}%)`;
          const tw = Math.max(100, text.length * 5.5 + 16);
          return (
            <g>
              <rect x={W / 2 - tw / 2} y={4} width={tw} height={20} rx={6}
                fill={colors.text.primary} opacity={0.9} />
              <text x={W / 2} y={17} fontSize={10} fill="#fff" textAnchor="middle"
                fontFamily={typography.fontFamily.body}>{text}</text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}
