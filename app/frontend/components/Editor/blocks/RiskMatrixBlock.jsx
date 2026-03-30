import { colors, typography, radii } from "../../../styles/tokens";

/**
 * RiskMatrixBlock — 3×3 colored grid with white dot(s).
 * Grid layout (top-left = low risk, bottom-right = critical):
 *   Row 0: green   yellow  orange
 *   Row 1: yellow  orange  red
 *   Row 2: orange  red     black
 * Point positioned via left% / bottom% on the grid.
 */

const GRID_SIZE = 120;
const GRID_GAP = 3;
const GRID_COLORS = [
  /* row 0 (top)    */ "#2ecc71", "#f1c40f", "#e67e22",
  /* row 1 (middle) */ "#f1c40f", "#e67e22", "#e74c3c",
  /* row 2 (bottom) */ "#e67e22", "#e74c3c", "#2d3436",
];

/* Snap a 0-1 fraction to the center of the corresponding grid cell (0, 1, or 2) */
function cellCenterPct(fraction) {
  const cell = fraction < 1 / 3 ? 0 : fraction < 2 / 3 ? 1 : 2;
  const cellW = (GRID_SIZE - 2 * GRID_GAP) / 3;
  const px = cell * (cellW + GRID_GAP) + cellW / 2;
  return (px / GRID_SIZE) * 100;
}

export function RiskMatrixBlock({ block, accentColor }) {
  const {
    points = [],
    xLabel = "Vraisemblance",
    yLabel = "Impact",
  } = block.data;

  if (!points.length) {
    return (
      <div style={{
        border: `2px dashed ${colors.border}`, borderRadius: radii.xl,
        padding: 32, textAlign: "center",
        color: colors.text.muted, fontSize: typography.fontSize.sm, fontFamily: typography.fontFamily.body,
      }}>
        Configurer la matrice dans les propriétés
      </div>
    );
  }

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      background: colors.surface, borderRadius: radii.lg,
      border: `1px solid ${colors.border}`, padding: "14px 18px",
    }}>
      <div style={{
        position: "relative", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", paddingLeft: 25,
      }}>
        {/* Y-axis label */}
        <span style={{
          fontSize: "0.75em", fontWeight: 700, color: colors.text.muted,
          textTransform: "uppercase", fontFamily: typography.fontFamily.body,
          position: "absolute", left: -35, top: "50%",
          transform: "translateY(-50%) rotate(-90deg)",
          width: 100, textAlign: "center",
        }}>
          {yLabel}
        </span>

        {/* 3×3 grid */}
        <div style={{
          width: GRID_SIZE, height: GRID_SIZE,
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(3, 1fr)",
          gap: 3, background: "transparent", position: "relative",
        }}>
          {GRID_COLORS.map((bg, i) => (
            <div key={i} style={{ width: "100%", height: "100%", borderRadius: 3, background: bg }} />
          ))}
          {/* Points */}
          {points.map((pt, i) => {
            const left = cellCenterPct(Math.min(Math.max(pt.x ?? 0.5, 0), 1));
            const bottom = cellCenterPct(Math.min(Math.max(pt.y ?? 0.5, 0), 1));
            return (
              <div key={`pt-${i}`} title={pt.label || ""} style={{
                position: "absolute",
                width: 12, height: 12, background: "#fff",
                border: "3px solid #2c3e50", borderRadius: "50%",
                left: `${left}%`, bottom: `${bottom}%`,
                transform: "translate(-50%, 50%)",
                boxShadow: "0 0 5px rgba(0,0,0,0.5)", zIndex: 10,
              }} />
            );
          })}
        </div>

        {/* X-axis label */}
        <span style={{
          fontSize: "0.75em", fontWeight: 700, color: colors.text.muted,
          textTransform: "uppercase", fontFamily: typography.fontFamily.body,
          marginTop: 8,
        }}>
          {xLabel}
        </span>
      </div>

      {/* Legend */}
      {points.some((p) => p.label) && (
        <div style={{
          display: "flex", flexWrap: "wrap", gap: "4px 12px", marginTop: 10,
          justifyContent: "center",
        }}>
          {points.filter((p) => p.label).map((p, i) => (
            <span key={i} style={{
              fontFamily: typography.fontFamily.body, fontSize: typography.fontSize.xs,
              color: colors.text.secondary, display: "flex", alignItems: "center", gap: 4,
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: "50%",
                background: "#fff", border: "2px solid #2c3e50", flexShrink: 0,
              }} />
              {p.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
