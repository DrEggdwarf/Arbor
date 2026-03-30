import { useMemo, useState } from "react";
import { colors, typography, radii } from "../../../styles/tokens";
import { RichText } from "./RichText";
import { normalizeTableData, BLOCK_MIGRATORS } from "../../../lib/tableMigration";

function accentBg(hex, opacity = 0.06) {
  return `${hex}${Math.round(opacity * 255).toString(16).padStart(2, "0")}`;
}

// ── Cell Renderers ────────────────────────────────────────────
function CellText({ value, config }) {
  return <span style={{ maxWidth: config?.maxWidth, overflow: "hidden", textOverflow: "ellipsis", display: "inline-block" }}>{value ?? ""}</span>;
}

function CellRichText({ value }) {
  return <RichText html={value || ""} />;
}

function CellMono({ value, config }) {
  return <span style={{ fontWeight: 500, color: colors.text.primary, maxWidth: config?.maxWidth, overflow: "hidden", textOverflow: "ellipsis", display: "inline-block" }}>{value ?? ""}</span>;
}

function CellBadge({ value, config }) {
  if (value == null || value === "") return <span style={{ color: colors.text.muted }}>—</span>;
  const map = config?.colorMap || {};
  const entry = map[value] || { bg: "#E2DDD520", text: colors.text.muted };
  const label = entry.label || value;
  const shape = config?.shape === "rounded" ? radii.md : radii.full;
  return (
    <span style={{
      display: "inline-block", padding: "1px 8px", borderRadius: shape,
      background: entry.bg, color: entry.text, fontWeight: 600,
      fontSize: typography.fontSize.xs, letterSpacing: "0.02em",
      textTransform: config?.uppercase ? "uppercase" : "none",
      whiteSpace: "nowrap",
    }}>{label}</span>
  );
}

function CellNumber({ value, config }) {
  if (value == null) return <span style={{ color: colors.text.muted }}>—</span>;
  const prefix = config?.prefix || "";
  const suffix = config?.suffix || "";
  const precision = config?.precision;
  const display = precision != null ? Number(value).toFixed(precision) : String(value);
  return <span style={{ fontWeight: 600, textAlign: "center" }}>{prefix}{display}{suffix}</span>;
}

function CellScoreBadge({ value, config }) {
  if (value == null) return <span style={{ color: colors.text.muted }}>—</span>;
  const num = Number(value);
  const ranges = config?.ranges || [];
  let bg = "#E2DDD5", text = colors.text.muted;
  for (const r of ranges) {
    if (num >= r.min && num <= r.max) { bg = r.bg; text = r.text; break; }
  }
  const display = Number.isInteger(num) ? String(num) : num.toFixed(1);
  return (
    <span style={{
      display: "inline-block", padding: "2px 8px", borderRadius: radii.md,
      background: bg, color: text, fontWeight: 700, fontSize: typography.fontSize.sm,
      minWidth: 28, textAlign: "center",
    }}>{display}</span>
  );
}

function CellProgress({ value, config }) {
  const raw = value ?? 0;
  let pct;
  if (config?.normalize === "addOffset") {
    pct = Math.max(0, Math.min(100, raw + (config.normalizeParam || 0)));
  } else {
    pct = Math.max(0, Math.min(100, (raw / (config?.max || 100)) * 100));
  }
  let barColor = colors.text.muted;
  for (const r of (config?.colorRanges || [])) {
    if (pct >= r.min && pct <= r.max) { barColor = r.color; break; }
  }
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 80 }}>
      <div style={{ flex: 1, height: 6, background: colors.border, borderRadius: radii.sm, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: barColor, borderRadius: radii.sm }} />
      </div>
      {config?.showLabel && <span style={{ fontSize: typography.fontSize.xs, color: colors.text.muted, whiteSpace: "nowrap" }}>{raw}{config.suffix || ""}</span>}
    </div>
  );
}

function CellMasked({ value, showMasked, config }) {
  if (showMasked) return <span style={{ fontWeight: 500 }}>{value ?? ""}</span>;
  const ch = config?.maskChar || "•";
  const len = config?.maskLength || 8;
  return <span style={{ letterSpacing: "0.1em", color: colors.text.muted }}>{ch.repeat(len)}</span>;
}

function CellStatusDot({ value, config }) {
  const map = config?.colorMap || {};
  const color = map[value] || colors.text.muted;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 }} />
      <span>{value ?? ""}</span>
    </span>
  );
}

function CellIconStatus({ value, config }) {
  const map = config?.statusMap || {};
  const entry = map[value] || { icon: "—", color: colors.text.muted };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      <span style={{ fontWeight: 700, fontSize: "13px", color: entry.color }}>{entry.icon}</span>
      {entry.label && <span style={{ fontSize: typography.fontSize.xs, color: entry.color }}>{entry.label}</span>}
    </span>
  );
}

function CellRowId({ value, config, accentColor }) {
  if (config?.accentColored) {
    return (
      <span style={{
        display: "inline-block", padding: "2px 8px", borderRadius: radii.sm,
        background: accentColor, color: "#fff", fontSize: typography.fontSize.xs,
        fontWeight: 600,
      }}>{value ?? ""}</span>
    );
  }
  return <span style={{ fontWeight: 600, color: colors.text.muted }}>{value ?? ""}</span>;
}

function CellCircleBadge({ value, config }) {
  if (!value || value === "") {
    return <span style={{ color: colors.text.muted, fontSize: typography.fontSize.sm }}>{config?.emptySymbol || "—"}</span>;
  }
  const map = config?.colorMap || {};
  const entry = map[value] || { bg: colors.text.muted };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 28, height: 28, borderRadius: "50%", background: entry.bg,
      color: "#fff", fontWeight: 700, fontSize: typography.fontSize.sm,
    }}>{value}</span>
  );
}

function renderCell(col, value, { showMasked, accentColor }) {
  switch (col.type) {
    case "text": return <CellText value={value} config={col.config} />;
    case "rich-text": return <CellRichText value={value} />;
    case "mono": return <CellMono value={value} config={col.config} />;
    case "badge": return <CellBadge value={value} config={col.config} />;
    case "number": return <CellNumber value={value} config={col.config} />;
    case "score-badge": return <CellScoreBadge value={value} config={col.config} />;
    case "progress": return <CellProgress value={value} config={col.config} />;
    case "masked": return <CellMasked value={value} showMasked={showMasked} config={col.config} />;
    case "status-dot": return <CellStatusDot value={value} config={col.config} />;
    case "icon-status": return <CellIconStatus value={value} config={col.config} />;
    case "row-id": return <CellRowId value={value} config={col.config} accentColor={accentColor} />;
    case "circle-badge": return <CellCircleBadge value={value} config={col.config} />;
    default: return <span>{String(value ?? "")}</span>;
  }
}

// ── Summary Bar ───────────────────────────────────────────────
function SummaryBar({ rows, column }) {
  if (!column) return null;
  const counts = {};
  for (const row of rows) {
    const v = row.cells?.[column.id];
    if (v != null && v !== "") counts[v] = (counts[v] || 0) + 1;
  }
  const total = rows.length || 1;
  const entries = Object.entries(counts);
  const getColor = (val) => {
    if (column.type === "badge") return column.config?.colorMap?.[val]?.bg || colors.text.muted;
    if (column.type === "icon-status") return column.config?.statusMap?.[val]?.color || colors.text.muted;
    return colors.text.muted;
  };
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", height: 6, borderRadius: radii.sm, overflow: "hidden", background: colors.border }}>
        {entries.map(([val, count]) => (
          <div key={val} style={{ width: `${(count / total) * 100}%`, background: getColor(val) }} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 4, fontSize: typography.fontSize.xs, color: colors.text.muted }}>
        {entries.map(([val, count]) => (
          <span key={val}><span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: getColor(val), marginRight: 3 }} />{count}</span>
        ))}
      </div>
    </div>
  );
}

// ── Group Header ──────────────────────────────────────────────
function GroupHeader({ group, colCount, isOpen, onToggle }) {
  return (
    <tr onClick={onToggle} style={{ cursor: "pointer", background: `${colors.bg}` }}>
      <td colSpan={colCount} style={{
        padding: "8px 14px", fontFamily: typography.fontFamily.body,
        fontSize: typography.fontSize.sm, fontWeight: 600, color: colors.text.secondary,
        borderBottom: `1px solid ${colors.border}`,
      }}>
        <span style={{ marginRight: 6, fontSize: 9, display: "inline-block", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s" }}>▶</span>
        {group.key && <span style={{ color: colors.text.muted, marginRight: 6 }}>{group.key}</span>}
        {group.label}
      </td>
    </tr>
  );
}

// ── Legend ─────────────────────────────────────────────────────
function Legend({ items }) {
  if (!items?.length) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 8, fontSize: typography.fontSize.xs, color: colors.text.muted }}>
      {items.map((item) => (
        <span key={item.symbol} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 14, height: 14, borderRadius: "50%", background: item.bg, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 9, fontWeight: 700 }}>{item.symbol}</span>
          {item.label}
        </span>
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────
export function UniversalTableBlock({ block, accentColor = colors.accentBright }) {
  const data = useMemo(() => {
    const migrator = BLOCK_MIGRATORS[block.type];
    if (migrator) return migrator(block.data || {});
    return normalizeTableData(block.data);
  }, [block.type, block.data]);

  const [openGroups, setOpenGroups] = useState(() => {
    const m = {};
    (data.groups || []).forEach((g) => { m[g.key] = true; });
    return m;
  });

  const toggleGroup = (key) => setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));

  const visibleColumns = (data.columns || []).filter((c) => !c.hidden);
  const showMasked = data.showMasked ?? false;
  const accentBorderCol = data.accentBorderColumn ? data.columns.find((c) => c.id === data.accentBorderColumn) : null;
  const summaryCol = data.summaryBar ? data.columns.find((c) => c.id === data.summaryBar) : null;

  // Group rows
  const hasGroups = data.groups?.length > 0 && data.groupByColumn;
  const groupMap = new Map();
  if (hasGroups) {
    for (const g of data.groups) groupMap.set(g.key, []);
    const ungrouped = [];
    for (const row of (data.rows || [])) {
      const gk = row._group || row.cells?.[data.groupByColumn];
      if (gk && groupMap.has(gk)) groupMap.get(gk).push(row);
      else ungrouped.push(row);
    }
    if (ungrouped.length) groupMap.set("__ungrouped__", ungrouped);
  }

  if (!data.columns?.length) {
    return (
      <div style={{ border: `2px dashed ${colors.border}`, borderRadius: 12, padding: 24, textAlign: "center", color: colors.text.muted, fontSize: typography.fontSize.sm, fontFamily: typography.fontFamily.body }}>
        Configurer le tableau dans les propriétés
      </div>
    );
  }

  const getBorderColor = (row) => {
    if (!accentBorderCol) return null;
    const val = row.cells?.[accentBorderCol.id];
    if (!val) return null;
    const map = accentBorderCol.config?.colorMap;
    if (map?.[val]?.bg) return map[val].bg.replace(/[0-9a-f]{2}$/i, "");
    if (map?.[val]?.text) return map[val].text;
    return null;
  };

  const renderRow = (row, ri) => {
    const borderColor = getBorderColor(row);
    return (
      <tr key={row.id || ri}>
        {visibleColumns.map((col, ci) => (
          <td key={col.id} style={{
            padding: "8px 12px",
            borderBottom: `1px solid ${colors.border}`,
            borderLeft: ci === 0 && borderColor ? `3px solid ${borderColor}` : undefined,
            color: colors.text.primary,
            background: ri % 2 === 1 ? accentBg(accentColor, 0.08) : "transparent",
            textAlign: col.align || "left",
            fontFamily: typography.fontFamily.body,
            fontSize: typography.fontSize.sm,
            verticalAlign: "middle",
            width: col.width === "min" ? 1 : col.width != null && typeof col.width === "number" ? col.width : undefined,
            whiteSpace: col.width === "min" ? "nowrap" : undefined,
          }}>
            {renderCell(col, row.cells?.[col.id], { showMasked, accentColor })}
          </td>
        ))}
      </tr>
    );
  };

  return (
    <div style={{ fontFamily: typography.fontFamily.body }}>
      {/* Title */}
      {data.title && (
        <h3 style={{ fontFamily: typography.fontFamily.heading, fontSize: typography.fontSize.lg, fontWeight: 600, margin: "0 0 2px", color: colors.text.primary }}>{data.title}</h3>
      )}
      {data.subtitle && (
        <div style={{ fontSize: typography.fontSize.sm, color: colors.text.muted, marginBottom: 6 }}>{data.subtitle}</div>
      )}

      {/* Meta bar */}
      {data.meta?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 8, fontSize: typography.fontSize.xs }}>
          {data.meta.map((m, i) => (
            <span key={i}>
              <span style={{ textTransform: "uppercase", letterSpacing: "0.04em", color: colors.text.muted, marginRight: 4 }}>{m.label} :</span>
              <span style={{ color: colors.text.secondary }}>{m.value}</span>
            </span>
          ))}
        </div>
      )}

      {/* Summary bar */}
      {summaryCol && <SummaryBar rows={data.rows || []} column={summaryCol} />}

      {/* Table */}
      <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${colors.border}`, background: colors.surface }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {visibleColumns.map((col) => (
                <th key={col.id} style={{
                  background: accentBg(accentColor, 0.1),
                  color: colors.text.muted,
                  fontWeight: typography.fontWeight.semibold,
                  fontSize: typography.fontSize.xs,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  padding: "8px 12px",
                  textAlign: col.align || "left",
                  borderBottom: `1.5px solid ${accentColor}40`,
                  whiteSpace: "nowrap",
                  width: col.width === "min" ? 1 : col.width != null && typeof col.width === "number" ? col.width : undefined,
                }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hasGroups ? (
              [...groupMap.entries()].map(([gk, rows]) => {
                const groupDef = data.groups.find((g) => g.key === gk) || { key: gk, label: gk };
                const isOpen = openGroups[gk] !== false;
                return [
                  <GroupHeader key={`gh-${gk}`} group={groupDef} colCount={visibleColumns.length} isOpen={isOpen} onToggle={() => toggleGroup(gk)} />,
                  ...(isOpen ? rows.map((row, ri) => renderRow(row, ri)) : []),
                ];
              }).flat()
            ) : (
              (data.rows || []).map((row, ri) => renderRow(row, ri))
            )}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <Legend items={data.legend} />
    </div>
  );
}
