import { colors, typography, radii } from "../../../styles/tokens";

const VALIDITY_THRESHOLD = 30; // days

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = (new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24);
  return Math.ceil(diff);
}

export function CertificateInfoBlock({ block, accentColor }) {
  const d = block.data || {};
  const accent = accentColor || colors.accentBright;
  const daysLeft = daysUntil(d.validTo);
  const isExpired = daysLeft !== null && daysLeft <= 0;
  const isExpiring = daysLeft !== null && daysLeft > 0 && daysLeft <= VALIDITY_THRESHOLD;
  const statusColor = isExpired ? "#e74c3c" : isExpiring ? "#e67e22" : "#27ae60";
  const statusLabel = isExpired ? "Expiré" : isExpiring ? `Expire dans ${daysLeft}j` : daysLeft !== null ? `Valide (${daysLeft}j)` : "—";

  const fields = [
    { label: "Sujet", value: d.subject },
    { label: "Émetteur", value: d.issuer },
    { label: "Valide du", value: d.validFrom },
    { label: "Valide jusqu'au", value: d.validTo },
    { label: "Algorithme", value: d.algorithm },
    { label: "Taille clé", value: d.keySize },
    { label: "Série", value: d.serialNumber },
    { label: "SAN", value: Array.isArray(d.san) ? d.san.join(", ") : d.san },
  ];

  return (
    <div style={styles.card}>
      {d.title && <h3 style={{ ...styles.title, borderBottomColor: accent }}>{d.title}</h3>}

      {/* Status badge */}
      <div style={styles.statusRow}>
        <span style={{ ...styles.statusBadge, backgroundColor: `${statusColor}15`, color: statusColor, borderColor: statusColor }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: statusColor, display: "inline-block" }} />
          {statusLabel}
        </span>
        {d.chainValid !== undefined && (
          <span style={{ ...styles.chainBadge, color: d.chainValid ? "#27ae60" : "#e74c3c" }}>
            Chaîne : {d.chainValid ? "✓ Valide" : "✗ Invalide"}
          </span>
        )}
      </div>

      {/* Certificate details */}
      <div style={styles.fieldsGrid}>
        {fields.map((f) => f.value ? (
          <div key={f.label} style={styles.field}>
            <span style={styles.fieldLabel}>{f.label}</span>
            <span style={styles.fieldValue}>{f.value}</span>
          </div>
        ) : null)}
      </div>

      {d.fingerprint && (
        <div style={styles.fingerprint}>
          <span style={styles.fieldLabel}>Empreinte SHA-256</span>
          <code style={styles.code}>{d.fingerprint}</code>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.lg,
    padding: 20,
    fontFamily: typography.fontFamily.body,
  },
  title: {
    margin: "0 0 14px 0",
    fontFamily: typography.fontFamily.heading,
    fontSize: 18,
    color: colors.text.primary,
    borderBottom: "2px solid",
    paddingBottom: 8,
  },
  statusRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 12px",
    borderRadius: radii.md,
    fontSize: 12,
    fontWeight: 600,
    border: "1px solid",
  },
  chainBadge: {
    fontSize: 11,
    fontWeight: 600,
  },
  fieldsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px 16px",
    marginBottom: 12,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: 600,
    color: colors.text.muted,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  fieldValue: {
    fontSize: 12,
    color: colors.text.primary,
    wordBreak: "break-all",
  },
  fingerprint: {
    marginTop: 8,
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  code: {
    fontSize: 10,
    padding: "4px 8px",
    backgroundColor: colors.bg,
    borderRadius: radii.sm,
    color: colors.text.secondary,
    wordBreak: "break-all",
    fontFamily: typography.fontFamily.body,
  },
};
