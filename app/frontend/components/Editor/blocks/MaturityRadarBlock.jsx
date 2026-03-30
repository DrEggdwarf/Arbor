import { useMemo } from "react";
import { colors, typography, radii } from "../../../styles/tokens";

const CX = 200;
const CY = 200;
const R = 160;
const LEVELS = [1, 2, 3, 4, 5];
const MAX = 5;
const VB_W = 400;
const VB_H = 440;

function polarXY(index, total, radius) {
  const angle = (2 * Math.PI * index) / total - Math.PI / 2;
  return {
    x: CX + radius * Math.cos(angle),
    y: CY + radius * Math.sin(angle),
  };
}

export function MaturityRadarBlock({ block, accentColor }) {
  const d = block.data || {};
  const title = d.title || "Radar de maturité";
  const axes = d.axes || [];
  const currentColor = d.currentColor || accentColor || colors.accentBright;
  const targetColor = d.targetColor || "#5B8FD4";
  const gridColor = d.gridColor || colors.border;
  const n = axes.length;

  const { gridPolygons, axisLines, currentPoints, targetPoints, currentPoly, targetPoly, labels } = useMemo(() => {
    if (n < 3) return { gridPolygons: [], axisLines: [], currentPoints: [], targetPoints: [], currentPoly: "", targetPoly: "", labels: [] };

    const grids = LEVELS.map((lv) => {
      const r = (lv / MAX) * R;
      return Array.from({ length: n }, (_, i) => {
        const p = polarXY(i, n, r);
        return `${p.x},${p.y}`;
      }).join(" ");
    });

    const axLines = Array.from({ length: n }, (_, i) => {
      const p = polarXY(i, n, R);
      return { x1: CX, y1: CY, x2: p.x, y2: p.y };
    });

    const curPts = axes.map((ax, i) => {
      const val = Math.max(0, Math.min(ax.current || 0, MAX));
      return polarXY(i, n, (val / MAX) * R);
    });

    const tgtPts = axes.map((ax, i) => {
      const val = Math.max(0, Math.min(ax.target || 0, MAX));
      return polarXY(i, n, (val / MAX) * R);
    });

    const curPoly = curPts.map((p) => `${p.x},${p.y}`).join(" ");
    const tgtPoly = tgtPts.map((p) => `${p.x},${p.y}`).join(" ");

    const lbls = axes.map((ax, i) => {
      const p = polarXY(i, n, R + 22);
      let anchor = "middle";
      if (p.x < CX - 10) anchor = "end";
      else if (p.x > CX + 10) anchor = "start";
      return { x: p.x, y: p.y, label: ax.label || `Axe ${i + 1}`, anchor };
    });

    return {
      gridPolygons: grids,
      axisLines: axLines,
      currentPoints: curPts,
      targetPoints: tgtPts,
      currentPoly: curPoly,
      targetPoly: tgtPoly,
      labels: lbls,
    };
  }, [axes, n, currentColor, targetColor]);

  if (n < 3) {
    return (
      <div style={{
        border: `2px dashed ${colors.border}`, borderRadius: radii.xl,
        padding: 32, textAlign: "center",
        color: colors.text.muted, fontSize: typography.fontSize.sm, fontFamily: typography.fontFamily.body,
      }}>
        Minimum 3 axes requis
      </div>
    );
  }

  return (
    <div style={{
      background: colors.surface, borderRadius: radii.lg, border: `1px solid ${colors.border}`,
      padding: "14px 18px", fontFamily: typography.fontFamily.body, textAlign: "center",
    }}>
      <div style={{
        fontSize: 15, fontWeight: 700, color: colors.text.primary,
        fontFamily: typography.fontFamily.heading, marginBottom: 10,
      }}>
        {title}
      </div>

      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} style={{ width: "100%", maxWidth: 420, height: "auto", display: "inline-block" }}>
        {/* Concentric grid polygons */}
        {gridPolygons.map((pts, i) => (
          <polygon key={i} points={pts}
            fill="none" stroke={gridColor} strokeWidth={0.7} opacity={0.5} />
        ))}

        {/* Level labels on first axis */}
        {LEVELS.map((lv) => {
          const p = polarXY(0, n, (lv / MAX) * R);
          return (
            <text key={lv} x={p.x + 6} y={p.y - 4} fontSize={8}
              fill={colors.text.muted} fontFamily={typography.fontFamily.body}>
              {lv}
            </text>
          );
        })}

        {/* Axis lines */}
        {axisLines.map((l, i) => (
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke={gridColor} strokeWidth={0.6} opacity={0.4} />
        ))}

        {/* Target polygon (dashed, behind) */}
        <polygon points={targetPoly}
          fill={targetColor} fillOpacity={0.06}
          stroke={targetColor} strokeWidth={2} strokeDasharray="6,3"
          strokeLinejoin="round" />

        {/* Current polygon (filled, on top) */}
        <polygon points={currentPoly}
          fill={currentColor} fillOpacity={0.15}
          stroke={currentColor} strokeWidth={2.5}
          strokeLinejoin="round" />

        {/* Target dots */}
        {targetPoints.map((p, i) => (
          <circle key={`t${i}`} cx={p.x} cy={p.y} r={4}
            fill="white" stroke={targetColor} strokeWidth={2} />
        ))}

        {/* Current dots */}
        {currentPoints.map((p, i) => (
          <circle key={`c${i}`} cx={p.x} cy={p.y} r={4.5}
            fill={currentColor} stroke="white" strokeWidth={2} />
        ))}

        {/* Axis labels */}
        {labels.map((lb, i) => (
          <text key={i} x={lb.x} y={lb.y + 4} fontSize={10}
            fill={colors.text.secondary} textAnchor={lb.anchor}
            fontFamily={typography.fontFamily.body}>
            {lb.label.length > 16 ? lb.label.slice(0, 16) + "…" : lb.label}
          </text>
        ))}

        {/* Legend */}
        <circle cx={VB_W / 2 - 60} cy={VB_H - 16} r={5}
          fill={currentColor} stroke="white" strokeWidth={1.5} />
        <text x={VB_W / 2 - 50} y={VB_H - 12} fontSize={10}
          fill={colors.text.secondary} fontFamily={typography.fontFamily.body}>
          Actuel
        </text>

        <circle cx={VB_W / 2 + 30} cy={VB_H - 16} r={5}
          fill="white" stroke={targetColor} strokeWidth={2} />
        <text x={VB_W / 2 + 40} y={VB_H - 12} fontSize={10}
          fill={colors.text.secondary} fontFamily={typography.fontFamily.body}>
          Cible
        </text>
      </svg>
    </div>
  );
}
