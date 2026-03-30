import { useState } from "react";
import { colors, typography, radii } from "../../../styles/tokens";
import { RichText } from "./RichText";

/* ── Constants ── */
const TOTAL_SEGMENTS = 9;
const SEG_COLORS = {
  low:  "#2ecc71",  // segments 1-3
  med:  "#f39c12",  // segments 4-6
  high: "#e74c3c",  // segments 7-9
};
const SEG_INACTIVE = colors.border;

const SEVERITY_COLORS = {
  critical: { bar: "#c0392b", bg: "rgba(192,57,43,0.10)", text: "#842029", label: "Critique" },
  high:     { bar: "#e67e22", bg: "rgba(230,126,34,0.10)", text: "#9C4221", label: "Élevé" },
  medium:   { bar: "#f39c12", bg: "rgba(243,156,18,0.10)", text: "#856404", label: "Moyen" },
  low:      { bar: "#27ae60", bg: "rgba(39,174,96,0.10)",  text: "#2D7A47", label: "Faible" },
  info:     { bar: "#5B8FD4", bg: "rgba(91,143,212,0.10)", text: "#2C5282", label: "Info" },
};

function getSeverity(score, max = 10) {
  const pct = score / max;
  if (pct >= 0.7) return "critical";
  if (pct >= 0.5) return "high";
  if (pct >= 0.3) return "medium";
  return "low";
}

function segColor(idx) {
  if (idx < 3) return SEG_COLORS.low;
  if (idx < 6) return SEG_COLORS.med;
  return SEG_COLORS.high;
}

/* ── Segmented gauge row (9 segments + tooltip marker) ── */
function ScoreRow({ label, value, max = 9 }) {
  const [hovered, setHovered] = useState(false);
  const v = Math.max(0, Math.min(value ?? 0, max));
  const activeCount = Math.round((v / max) * TOTAL_SEGMENTS);
  const markerPct = (v / max) * 100;

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, marginBottom: 6,
      fontFamily: typography.fontFamily.body, fontSize: "0.85em",
    }}>
      <span style={{
        width: 110, flexShrink: 0, color: colors.text.secondary,
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>
        {label}
      </span>
      <div
        style={{ flexGrow: 1, position: "relative", height: 18, display: "flex", alignItems: "center", cursor: "pointer" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Segments */}
        <div style={{ width: "100%", height: "100%", display: "flex", gap: 2 }}>
          {Array.from({ length: TOTAL_SEGMENTS }, (_, i) => (
            <div key={i} style={{
              flex: 1, height: "100%", borderRadius: 2,
              background: i < activeCount ? segColor(i) : SEG_INACTIVE,
              transition: "background-color 0.3s",
            }} />
          ))}
        </div>
        {/* Tooltip marker */}
        <span style={{
          position: "absolute", top: -25,
          left: `${markerPct}%`, transform: "translateX(-50%)",
          fontWeight: 700, fontSize: "0.8em", color: "#fff",
          background: "#2c3e50", padding: "2px 6px", borderRadius: 3,
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)", minWidth: 20, textAlign: "center",
          zIndex: 10, opacity: hovered ? 1 : 0, transition: "opacity 0.2s",
          pointerEvents: "none",
        }}>
          {v}
          <span style={{
            position: "absolute", top: "100%", left: "50%", marginLeft: -4,
            borderWidth: 4, borderStyle: "solid",
            borderColor: "#2c3e50 transparent transparent transparent",
          }} />
        </span>
      </div>
    </div>
  );
}

/* ── Main block: score rows list with segmented gauges ── */
export function ScoreGaugeBlock({ block, accentColor }) {
  const { scores = [], max = 9, title = "" } = block.data;

  if (!scores.length) {
    return (
      <div style={{
        border: `2px dashed ${colors.border}`, borderRadius: radii.xl,
        padding: 32, textAlign: "center",
        color: colors.text.muted, fontSize: typography.fontSize.sm, fontFamily: typography.fontFamily.body,
      }}>
        Configurer les scores dans les propriétés
      </div>
    );
  }

  return (
    <div style={{
      background: colors.surface, borderRadius: radii.lg,
      border: `1px solid ${colors.border}`, padding: "14px 18px",
    }}>
      {title && (
        <div style={{
          fontFamily: typography.fontFamily.body, fontSize: "0.9em",
          fontWeight: 700, color: colors.text.primary,
          marginBottom: 8, paddingBottom: 4,
          borderBottom: `2px solid ${colors.border}`,
        }}>
          <RichText html={title} />
        </div>
      )}
      {scores.map((s, i) => (
        <ScoreRow key={i} label={s.label} value={s.value ?? s.score ?? 0} max={s.max ?? max} />
      ))}
    </div>
  );
}

/* Export helpers for risk-assessment combo */
export { ScoreRow, getSeverity, SEVERITY_COLORS };
