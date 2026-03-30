import { colors, typography, radii } from "../../../styles/tokens";

const typeBadgeColors = {
  network: "#3498db",
  web: "#9b59b6",
  api: "#e67e22",
  mobile: "#1abc9c",
  cloud: "#2980b9",
  iot: "#16a085",
  wireless: "#8e44ad",
};

export function ScopeBlockBlock({ block, accentColor }) {
  const d = block.data || {};
  const accent = accentColor || colors.accentBright;

  const title = d.title || "Périmètre";
  const inScope = d.inScope || [];
  const outOfScope = d.outOfScope || [];
  const notes = d.notes || "";

  return (
    <div style={styles.card}>
      <h3 style={{ ...styles.title, borderBottomColor: accent }}>{title}</h3>

      <ScopeSection
        label="✓ In Scope"
        items={inScope}
        headerColor="#27ae60"
      />
      <ScopeSection
        label="✗ Out of Scope"
        items={outOfScope}
        headerColor="#c0392b"
      />

      {notes && (
        <div style={styles.notes}>
          <span style={styles.notesLabel}>Notes:</span> {notes}
        </div>
      )}
    </div>
  );
}

function ScopeSection({ label, items, headerColor }) {
  if (!items.length) return null;

  return (
    <div style={styles.section}>
      <h4 style={{ ...styles.sectionHeader, color: headerColor }}>{label}</h4>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Target</th>
            <th style={styles.th}>Type</th>
            <th style={styles.th}>Description</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} style={i % 2 === 0 ? styles.rowEven : undefined}>
              <td style={styles.tdTarget}>{item.target}</td>
              <td style={styles.td}>
                <TypeBadge type={item.type} />
              </td>
              <td style={styles.td}>{item.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TypeBadge({ type }) {
  if (!type) return null;
  const bg = typeBadgeColors[type] || colors.text.muted;

  return (
    <span
      style={{
        display: "inline-block",
        padding: "1px 8px",
        borderRadius: "9999px",
        fontSize: "11px",
        fontFamily: typography.fontFamily.body,
        color: "#fff",
        backgroundColor: bg,
        textTransform: "lowercase",
      }}
    >
      {type}
    </span>
  );
}

const styles = {
  card: {
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.lg,
    padding: "20px",
    fontFamily: typography.fontFamily.body,
  },
  title: {
    margin: "0 0 16px 0",
    fontFamily: typography.fontFamily.heading,
    fontSize: "18px",
    color: colors.text.primary,
    borderBottom: "2px solid",
    paddingBottom: "8px",
  },
  section: {
    marginBottom: "16px",
  },
  sectionHeader: {
    margin: "0 0 8px 0",
    fontFamily: typography.fontFamily.heading,
    fontSize: "14px",
    fontWeight: 600,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px",
  },
  th: {
    textAlign: "left",
    padding: "6px 10px",
    borderBottom: `2px solid ${colors.border}`,
    color: colors.text.muted,
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    fontFamily: typography.fontFamily.body,
  },
  td: {
    padding: "6px 10px",
    borderBottom: `1px solid ${colors.border}`,
    color: colors.text.secondary,
  },
  tdTarget: {
    padding: "6px 10px",
    borderBottom: `1px solid ${colors.border}`,
    color: colors.text.primary,
    fontFamily: typography.fontFamily.body,
    fontWeight: 500,
  },
  rowEven: {
    backgroundColor: colors.bg,
  },
  notes: {
    marginTop: "12px",
    padding: "10px 12px",
    backgroundColor: colors.bg,
    borderRadius: radii.lg,
    fontSize: "13px",
    fontStyle: "italic",
    color: colors.text.secondary,
    fontFamily: typography.fontFamily.body,
  },
  notesLabel: {
    fontStyle: "normal",
    fontWeight: 600,
    color: colors.text.muted,
  },
};
