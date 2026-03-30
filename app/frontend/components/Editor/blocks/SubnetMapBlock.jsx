import { useMemo } from "react";
import { colors, typography, radii } from "../../../styles/tokens";

const STATUS_COLORS = {
  used: "#3498db",
  free: "#27ae60",
  reserved: "#e67e22",
  gateway: "#9b59b6",
  broadcast: "#95a5a6",
};

export function SubnetMapBlock({ block, accentColor }) {
  const d = block.data || {};
  const accent = accentColor || colors.accentBright;
  const addresses = d.addresses || [];
  const cols = d.columns || 16;

  const grid = useMemo(() => {
    const lookup = {};
    addresses.forEach((a) => { lookup[a.ip] = a; });
    return lookup;
  }, [addresses]);

  // Generate IP range from subnet
  const cells = useMemo(() => {
    if (addresses.length === 0) return [];
    // Use addresses as explicit list
    return addresses;
  }, [addresses]);

  const rows = [];
  for (let i = 0; i < cells.length; i += cols) {
    rows.push(cells.slice(i, i + cols));
  }

  return (
    <div style={styles.card}>
      {d.title && <h3 style={{ ...styles.title, borderBottomColor: accent }}>{d.title}</h3>}

      {d.subnet && (
        <div style={styles.meta}>
          <span style={styles.metaLabel}>Sous-réseau :</span> {d.subnet}
          {d.mask && <span style={{ marginLeft: 12 }}><span style={styles.metaLabel}>Masque :</span> {d.mask}</span>}
        </div>
      )}

      {/* Legend */}
      <div style={styles.legend}>
        {Object.entries(STATUS_COLORS).map(([k, c]) => (
          <span key={k} style={styles.legendItem}>
            <span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: c, display: "inline-block" }} />
            <span style={{ fontSize: 10, color: colors.text.muted, textTransform: "capitalize" }}>{k}</span>
          </span>
        ))}
      </div>

      {/* Grid */}
      <div style={{ overflowX: "auto" }}>
        <div style={{ display: "inline-grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 2, minWidth: cols * 42 }}>
          {cells.map((cell, i) => {
            const status = (cell.status || "free").toLowerCase();
            const bg = STATUS_COLORS[status] || colors.bg;
            return (
              <div key={i} style={{
                width: 40, height: 28, borderRadius: 3,
                backgroundColor: `${bg}20`,
                border: `1px solid ${bg}60`,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                fontSize: 8, color: colors.text.secondary, fontFamily: typography.fontFamily.body,
                cursor: "default",
              }} title={`${cell.ip} — ${cell.hostname || status}`}>
                <span style={{ fontWeight: 600, fontSize: 9 }}>.{cell.ip?.split(".").pop()}</span>
                {cell.hostname && <span style={{ fontSize: 7, color: colors.text.muted, maxWidth: 38, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cell.hostname}</span>}
              </div>
            );
          })}
        </div>
      </div>

      {!cells.length && <p style={styles.empty}>Aucune adresse définie.</p>}
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
    margin: "0 0 12px 0",
    fontFamily: typography.fontFamily.heading,
    fontSize: 18,
    color: colors.text.primary,
    borderBottom: "2px solid",
    paddingBottom: 8,
  },
  meta: {
    fontSize: 11, color: colors.text.secondary, marginBottom: 10,
  },
  metaLabel: {
    fontWeight: 600, color: colors.text.muted, textTransform: "uppercase",
    fontSize: 10, letterSpacing: "0.04em",
  },
  legend: {
    display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap",
  },
  legendItem: {
    display: "inline-flex", alignItems: "center", gap: 4,
  },
  empty: {
    color: colors.text.muted, fontSize: 12,
    fontStyle: "italic", textAlign: "center", padding: 16,
  },
};
