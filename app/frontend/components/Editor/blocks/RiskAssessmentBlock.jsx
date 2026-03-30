import { ScoreRow, getSeverity, SEVERITY_COLORS } from "./ScoreGaugeBlock";
import { colors, typography, radii } from "../../../styles/tokens";
import { RichText } from "./RichText";

/**
 * RiskAssessmentBlock — OWASP Risk Rating style:
 *   Left:   Facteurs de Vraisemblance (score rows with segmented gauges)
 *   Middle: Facteurs d'Impact (score rows with segmented gauges)
 *   Right:  3×3 color matrix with positioned dot
 */

const GRID_SIZE = 120;
const GRID_GAP = 3;
const GRID_COLORS = [
  "#2ecc71", "#f1c40f", "#e67e22",
  "#f1c40f", "#e67e22", "#e74c3c",
  "#e67e22", "#e74c3c", "#2d3436",
];

function cellCenterPct(fraction) {
  const cell = fraction < 1 / 3 ? 0 : fraction < 2 / 3 ? 1 : 2;
  const cellW = (GRID_SIZE - 2 * GRID_GAP) / 3;
  const px = cell * (cellW + GRID_GAP) + cellW / 2;
  return (px / GRID_SIZE) * 100;
}

function avg(scores) {
  if (!scores.length) return 0;
  return scores.reduce((sum, s) => sum + (s.value ?? s.score ?? 0), 0) / scores.length;
}

export function RiskAssessmentBlock({ block, accentColor }) {
  const {
    likelihood = [],
    impact = [],
    max = 9,
    xLabel = "Vraisemblance",
    yLabel = "Impact",
    title = "",
  } = block.data;

  const allEmpty = !likelihood.length && !impact.length;
  if (allEmpty) {
    return (
      <div style={{
        border: `2px dashed ${colors.border}`, borderRadius: radii.xl,
        padding: 32, textAlign: "center",
        color: colors.text.muted, fontSize: typography.fontSize.sm, fontFamily: typography.fontFamily.body,
      }}>
        Configurer l'évaluation des risques dans les propriétés
      </div>
    );
  }

  const lAvg = avg(likelihood);
  const iAvg = avg(impact);
  // Position on 3x3: x = likelihood avg / max, y = impact avg / max
  const ptX = Math.min(lAvg / max, 1);
  const ptY = Math.min(iAvg / max, 1);

  return (
    <div style={{
      background: colors.surface, borderRadius: radii.lg,
      border: `1px solid ${colors.border}`, overflow: "hidden",
    }}>
      {/* Optional title header */}
      {title && (
        <div style={{
          padding: "10px 18px",
          borderBottom: `1px solid ${colors.border}`,
          fontFamily: typography.fontFamily.body, fontSize: "0.9em",
          fontWeight: 700, color: colors.text.muted,
          textTransform: "uppercase", letterSpacing: "0.5px",
        }}>
          <RichText html={title} />
        </div>
      )}

      {/* Content: likelihood scores + impact scores + matrix */}
      <div style={{
        display: "flex", alignItems: "center", gap: 20, padding: 15,
        background: colors.surface, border: `1px solid ${colors.border}`,
        borderRadius: 4, flexWrap: "wrap",
      }}>
        {/* Likelihood scores */}
        {likelihood.length > 0 && (
          <div style={{ flex: 1, minWidth: 180 }}>
            <h5 style={{
              fontFamily: typography.fontFamily.body, fontSize: "1em",
              fontWeight: 700, color: colors.text.primary,
              marginBottom: 8, paddingBottom: 4,
              borderBottom: `2px solid ${colors.border}`, margin: 0,
            }}>
              Facteurs de Vraisemblance ({lAvg.toFixed(1)})
            </h5>
            <div style={{ marginTop: 8 }}>
              {likelihood.map((s, i) => (
                <ScoreRow key={i} label={s.label} value={s.value ?? s.score ?? 0} max={s.max ?? max} />
              ))}
            </div>
          </div>
        )}

        {/* Impact scores */}
        {impact.length > 0 && (
          <div style={{ flex: 1, minWidth: 180 }}>
            <h5 style={{
              fontFamily: typography.fontFamily.body, fontSize: "1em",
              fontWeight: 700, color: colors.text.primary,
              marginBottom: 8, paddingBottom: 4,
              borderBottom: `2px solid ${colors.border}`, margin: 0,
            }}>
              Facteurs d'Impact ({iAvg.toFixed(1)})
            </h5>
            <div style={{ marginTop: 8 }}>
              {impact.map((s, i) => (
                <ScoreRow key={i} label={s.label} value={s.value ?? s.score ?? 0} max={s.max ?? max} />
              ))}
            </div>
          </div>
        )}

        {/* 3×3 Matrix */}
        <div style={{
          position: "relative", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", paddingLeft: 25,
        }}>
          <span style={{
            fontSize: "0.75em", fontWeight: 700, color: colors.text.muted,
            textTransform: "uppercase", fontFamily: typography.fontFamily.body,
            position: "absolute", left: -35, top: "50%",
            transform: "translateY(-50%) rotate(-90deg)",
            width: 100, textAlign: "center",
          }}>
            {yLabel}
          </span>

          <div style={{
            width: GRID_SIZE, height: GRID_SIZE,
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(3, 1fr)",
            gap: 3, background: "transparent", position: "relative",
          }}>
            {GRID_COLORS.map((bg, i) => (
              <div key={i} style={{ width: "100%", height: "100%", borderRadius: 3, background: bg }} />
            ))}
            {/* Dot */}
            <div style={{
              position: "absolute",
              width: 12, height: 12, background: "#fff",
              border: "3px solid #2c3e50", borderRadius: "50%",
              left: `${cellCenterPct(ptX)}%`, bottom: `${cellCenterPct(ptY)}%`,
              transform: "translate(-50%, 50%)",
              boxShadow: "0 0 5px rgba(0,0,0,0.5)", zIndex: 10,
            }} />
          </div>

          <span style={{
            fontSize: "0.75em", fontWeight: 700, color: colors.text.muted,
            textTransform: "uppercase", fontFamily: typography.fontFamily.body,
            marginTop: 8,
          }}>
            {xLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
