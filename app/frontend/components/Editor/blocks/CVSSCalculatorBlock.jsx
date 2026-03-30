import { colors, typography, radii } from "../../../styles/tokens";

/* ============== CVSS 3.1 Base Score Algorithm ============== */

const METRIC_VALUES = {
  AV: { N: 0.85, A: 0.62, L: 0.55, P: 0.20 },
  AC: { L: 0.77, H: 0.44 },
  PR: {
    U: { N: 0.85, L: 0.62, H: 0.27 },
    C: { N: 0.85, L: 0.68, H: 0.50 },
  },
  UI: { N: 0.85, R: 0.62 },
  S:  { U: false, C: true },
  C:  { H: 0.56, L: 0.22, N: 0 },
  I:  { H: 0.56, L: 0.22, N: 0 },
  A:  { H: 0.56, L: 0.22, N: 0 },
};

function roundUp(n) {
  const int_input = Math.round(n * 100000);
  return int_input % 10000 === 0
    ? int_input / 100000
    : (Math.floor(int_input / 10000) + 1) / 10;
}

function computeCvss(metrics) {
  const { AV, AC, PR, UI, S, C, I, A } = metrics;
  if (!AV || !AC || !PR || !UI || !S || !C || !I || !A) return null;

  const scopeChanged = METRIC_VALUES.S[S];
  const prValues = scopeChanged ? METRIC_VALUES.PR.C : METRIC_VALUES.PR.U;

  const iss = 1 - (1 - METRIC_VALUES.C[C]) * (1 - METRIC_VALUES.I[I]) * (1 - METRIC_VALUES.A[A]);

  const impact = scopeChanged
    ? 7.52 * (iss - 0.029) - 3.25 * Math.pow(iss - 0.02, 15)
    : 6.42 * iss;

  if (impact <= 0) return 0;

  const exploitability =
    8.22 * METRIC_VALUES.AV[AV] * METRIC_VALUES.AC[AC] * prValues[PR] * METRIC_VALUES.UI[UI];

  const score = scopeChanged
    ? Math.min(1.08 * (impact + exploitability), 10)
    : Math.min(impact + exploitability, 10);

  return roundUp(score);
}

/* ============== Render helpers ============== */

function sevFromScore(score) {
  if (score == null) return { color: "#95a5a6", label: "N/A", bg: "#95a5a610" };
  if (score >= 9.0) return { color: "#c0392b", label: "CRITIQUE", bg: "#c0392b18" };
  if (score >= 7.0) return { color: "#e67e22", label: "ÉLEVÉ",   bg: "#e67e2218" };
  if (score >= 4.0) return { color: "#f39c12", label: "MOYEN",   bg: "#f39c1218" };
  if (score > 0)    return { color: "#27ae60", label: "FAIBLE",  bg: "#27ae6018" };
  return { color: "#95a5a6", label: "AUCUN", bg: "#95a5a610" };
}

function buildVector(m) {
  if (!m.AV || !m.AC || !m.PR || !m.UI || !m.S || !m.C || !m.I || !m.A) return null;
  return `CVSS:3.1/AV:${m.AV}/AC:${m.AC}/PR:${m.PR}/UI:${m.UI}/S:${m.S}/C:${m.C}/I:${m.I}/A:${m.A}`;
}

const METRIC_DEFS = [
  {
    key: "AV", label: "Attack Vector",
    options: [
      { value: "N", label: "Network", desc: "Exploitable à distance" },
      { value: "A", label: "Adjacent", desc: "Réseau adjacent" },
      { value: "L", label: "Local",   desc: "Accès local" },
      { value: "P", label: "Physical",desc: "Accès physique" },
    ],
  },
  {
    key: "AC", label: "Attack Complexity",
    options: [
      { value: "L", label: "Low",  desc: "Pas de conditions spéciales" },
      { value: "H", label: "High", desc: "Conditions spécifiques requises" },
    ],
  },
  {
    key: "PR", label: "Privileges Required",
    options: [
      { value: "N", label: "None", desc: "Aucun privilège" },
      { value: "L", label: "Low",  desc: "Privilèges basiques" },
      { value: "H", label: "High", desc: "Privilèges élevés" },
    ],
  },
  {
    key: "UI", label: "User Interaction",
    options: [
      { value: "N", label: "None",     desc: "Aucune interaction" },
      { value: "R", label: "Required", desc: "Interaction nécessaire" },
    ],
  },
  {
    key: "S", label: "Scope",
    options: [
      { value: "U", label: "Unchanged", desc: "Même composant" },
      { value: "C", label: "Changed",   desc: "Impact d'autres composants" },
    ],
  },
  {
    key: "C", label: "Confidentiality",
    options: [
      { value: "N", label: "None", desc: "Pas d'impact" },
      { value: "L", label: "Low",  desc: "Impact limité" },
      { value: "H", label: "High", desc: "Impact total" },
    ],
  },
  {
    key: "I", label: "Integrity",
    options: [
      { value: "N", label: "None", desc: "Pas d'impact" },
      { value: "L", label: "Low",  desc: "Impact limité" },
      { value: "H", label: "High", desc: "Impact total" },
    ],
  },
  {
    key: "A", label: "Availability",
    options: [
      { value: "N", label: "None", desc: "Pas d'impact" },
      { value: "L", label: "Low",  desc: "Impact limité" },
      { value: "H", label: "High", desc: "Impact total" },
    ],
  },
];

/* ============== Half-gauge SVG ============== */

function HalfGauge({ score, size = 180 }) {
  const sev = sevFromScore(score);
  const cx = size / 2, cy = size / 2;
  const R = size / 2 - 14;
  const pct = score != null ? Math.min(score / 10, 1) : 0;

  // Arc from 180° to 0° (left to right, bottom half-circle)
  const startAngle = Math.PI;
  const sweepAngle = pct * Math.PI;
  const endAngle = startAngle - sweepAngle;

  const x1 = cx + R * Math.cos(startAngle);
  const y1 = cy + R * Math.sin(startAngle);
  const x2 = cx + R * Math.cos(endAngle);
  const y2 = cy + R * Math.sin(endAngle);

  const largeArc = pct > 0.5 ? 1 : 0;

  return (
    <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
      {/* Background arc */}
      <path
        d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
        fill="none" stroke={colors.border} strokeWidth={10} strokeLinecap="round"
      />
      {/* Score arc */}
      {pct > 0 && (
        <path
          d={`M ${x1} ${y1} A ${R} ${R} 0 ${largeArc} 0 ${x2} ${y2}`}
          fill="none" stroke={sev.color} strokeWidth={10} strokeLinecap="round"
        />
      )}
      {/* Score text */}
      <text x={cx} y={cy - 8} textAnchor="middle"
        style={{ fontSize: 28, fontWeight: 700, fill: sev.color, fontFamily: typography.fontFamily.heading }}>
        {score != null ? score.toFixed(1) : "—"}
      </text>
      {/* Severity label */}
      <text x={cx} y={cy + 12} textAnchor="middle"
        style={{ fontSize: 10, fontWeight: 600, fill: sev.color, letterSpacing: "0.1em", fontFamily: typography.fontFamily.body }}>
        {sev.label}
      </text>
    </svg>
  );
}

/* ============== Main Component ============== */

export function CVSSCalculatorBlock({ block, accentColor }) {
  const d = block.data || {};
  const metrics = {
    AV: d.AV || null, AC: d.AC || null,
    PR: d.PR || null, UI: d.UI || null,
    S: d.S || null,   C: d.C || null,
    I: d.I || null,   A: d.A || null,
  };

  const score = computeCvss(metrics);
  const vector = buildVector(metrics);
  const sev = sevFromScore(score);

  return (
    <div style={{
      fontFamily: typography.fontFamily.body,
      border: `1px solid ${colors.border}`,
      borderRadius: radii.lg,
      overflow: "hidden",
      margin: "8px 0",
    }}>
      {/* Header */}
      {d.title && (
        <div style={{
          padding: "12px 16px",
          borderBottom: `1px solid ${colors.border}`,
          fontSize: 15, fontWeight: 700,
          color: colors.text.primary,
          fontFamily: typography.fontFamily.heading,
        }}>{d.title}</div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {/* Gauge side */}
        <div style={{
          flex: "0 0 200px", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "20px 16px 12px",
        }}>
          <HalfGauge score={score} />
          {vector && (
            <div style={{
              fontSize: 9, color: colors.text.muted, marginTop: 4,
              background: colors.bg, padding: "3px 8px", borderRadius: 4,
              letterSpacing: "0.03em", maxWidth: "100%", wordBreak: "break-all",
              textAlign: "center",
            }}>{vector}</div>
          )}
        </div>

        {/* Metrics grid */}
        <div style={{
          flex: 1, minWidth: 280, padding: "16px",
          display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10,
        }}>
          {METRIC_DEFS.map((m) => (
            <div key={m.key}>
              <div style={{
                fontSize: 10, fontWeight: 600, color: colors.text.muted,
                marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em",
              }}>{m.label}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {m.options.map((opt) => {
                  const selected = metrics[m.key] === opt.value;
                  return (
                    <span key={opt.value} title={opt.desc} style={{
                      fontSize: 10, padding: "3px 8px", borderRadius: 4,
                      cursor: "default",
                      background: selected ? `${sev.color}20` : colors.bg,
                      border: `1px solid ${selected ? sev.color : colors.border}`,
                      color: selected ? sev.color : colors.text.muted,
                      fontWeight: selected ? 700 : 400,
                    }}>
                      {opt.label}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
