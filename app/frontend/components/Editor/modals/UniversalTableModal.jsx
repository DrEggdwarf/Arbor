import { useState, useEffect, useMemo, useCallback } from "react";
import { useEditorStore } from "../../../stores/editorStore";
import { UniversalTableBlock } from "../blocks/UniversalTableBlock";
import { normalizeTableData, BLOCK_MIGRATORS } from "../../../lib/tableMigration";
import { TABLE_PRESETS, getPresetDefaults } from "../../../lib/tablePresets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { colors, typography, radii } from "../../../styles/tokens";
import { inputStyle, smallInput, btnStyle, tinyBtn, labelStyle, splitLayout, editorSide, previewSide } from "./shared";

const COLUMN_TYPES = [
  { value: "text", label: "Texte" },
  { value: "rich-text", label: "Texte riche" },
  { value: "mono", label: "Mono" },
  { value: "badge", label: "Badge" },
  { value: "number", label: "Nombre" },
  { value: "score-badge", label: "Score coloré" },
  { value: "progress", label: "Barre" },
  { value: "masked", label: "Masqué" },
  { value: "status-dot", label: "Point statut" },
  { value: "icon-status", label: "Icône statut" },
  { value: "row-id", label: "ID ligne" },
  { value: "circle-badge", label: "Badge cercle" },
];

let _idCounter = 0;
function uid(prefix = "col") { return `${prefix}_${Date.now().toString(36)}_${(++_idCounter)}`; }

export function UniversalTableEditor({ block, onClose }) {
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const accentColor = useEditorStore((s) => s.report?.accent_color) || colors.accentBright;

  // Normalize data on mount
  const initial = useMemo(() => {
    const migrator = BLOCK_MIGRATORS[block.type];
    if (migrator) return migrator(block.data || {});
    return normalizeTableData(block.data);
  }, []);

  const [title, setTitle] = useState(initial.title || "");
  const [subtitle, setSubtitle] = useState(initial.subtitle || "");
  const [meta, setMeta] = useState(initial.meta || []);
  const [columns, setColumns] = useState(initial.columns || []);
  const [rows, setRows] = useState(initial.rows || []);
  const [groups, setGroups] = useState(initial.groups || []);
  const [groupByColumn, setGroupByColumn] = useState(initial.groupByColumn || null);
  const [showMasked, setShowMasked] = useState(initial.showMasked || false);
  const [accentBorderColumn, setAccentBorderColumn] = useState(initial.accentBorderColumn || null);
  const [legend, setLegend] = useState(initial.legend || null);
  const [summaryBar, setSummaryBar] = useState(initial.summaryBar || null);
  const [preset, setPreset] = useState(initial.preset || null);
  const [tab, setTab] = useState("data"); // data | columns | features | presets

  const save = useCallback(() => {
    updateBlock(block.id, {
      title, subtitle, meta, columns, rows, groups, groupByColumn,
      showMasked, accentBorderColumn, legend, summaryBar, preset,
    });
  }, [title, subtitle, meta, columns, rows, groups, groupByColumn, showMasked, accentBorderColumn, legend, summaryBar, preset, updateBlock, block.id]);

  useEffect(() => { save(); }, [save]);

  // Apply preset
  const applyPreset = (presetId) => {
    const pd = getPresetDefaults(presetId);
    if (!pd) return;
    setTitle(pd.title); setSubtitle(""); setMeta(pd.meta);
    setColumns(pd.columns); setRows(pd.rows);
    setGroups(pd.groups); setGroupByColumn(pd.groupByColumn);
    setShowMasked(pd.showMasked); setAccentBorderColumn(pd.accentBorderColumn);
    setLegend(pd.legend); setSummaryBar(pd.summaryBar); setPreset(presetId);
  };

  // Column helpers
  const addColumn = () => {
    const id = uid();
    setColumns([...columns, { id, header: "Nouvelle", type: "text", align: "left", config: {} }]);
    setRows(rows.map((r) => ({ ...r, cells: { ...r.cells, [id]: "" } })));
  };
  const removeColumn = (colId) => {
    if (columns.length <= 1) return;
    setColumns(columns.filter((c) => c.id !== colId));
    setRows(rows.map((r) => { const cells = { ...r.cells }; delete cells[colId]; return { ...r, cells }; }));
  };
  const updateColumn = (colId, patch) => {
    setColumns(columns.map((c) => c.id === colId ? { ...c, ...patch } : c));
  };

  // Row helpers
  const addRow = () => {
    const cells = {};
    columns.forEach((c) => { cells[c.id] = ""; });
    setRows([...rows, { id: uid("row"), cells }]);
  };
  const removeRow = (ri) => setRows(rows.filter((_, i) => i !== ri));
  const updateCell = (ri, colId, value) => {
    setRows(rows.map((r, i) => i === ri ? { ...r, cells: { ...r.cells, [colId]: value } } : r));
  };

  // Meta helpers
  const addMeta = () => setMeta([...meta, { label: "", value: "" }]);
  const removeMeta = (i) => setMeta(meta.filter((_, j) => j !== i));
  const updateMeta = (i, field, val) => setMeta(meta.map((m, j) => j === i ? { ...m, [field]: val } : m));

  const visibleColumns = columns.filter((c) => !c.hidden);
  const hasMasked = columns.some((c) => c.type === "masked");

  const blockData = { title, subtitle, meta, columns, rows, groups, groupByColumn, showMasked, accentBorderColumn, legend, summaryBar, preset };

  return (
    <div style={splitLayout}>
      {/* Editor Side */}
      <div style={{ ...editorSide, gap: 0 }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 2, marginBottom: 10, flexShrink: 0 }}>
          {[
            { id: "data", label: "Données" },
            { id: "columns", label: "Colonnes" },
            { id: "features", label: "Options" },
            { id: "presets", label: "Modèles" },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              ...btnStyle, background: tab === t.id ? accentColor : colors.bg,
              color: tab === t.id ? "#fff" : colors.text.secondary,
              border: `1px solid ${tab === t.id ? accentColor : colors.border}`,
              fontSize: typography.fontSize.xs,
            }}>{t.label}</button>
          ))}
        </div>

        <div style={{ flex: 1, overflow: "auto" }}>
          {/* DATA TAB */}
          {tab === "data" && (
            <>
              {/* Title & subtitle */}
              <div style={{ marginBottom: 8 }}>
                <div style={labelStyle}>Titre</div>
                <input value={title} onChange={(e) => setTitle(e.target.value)} style={smallInput} />
              </div>

              {/* Meta */}
              <div style={{ marginBottom: 8 }}>
                <div style={{ ...labelStyle, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Métadonnées</span>
                  <button onClick={addMeta} style={{ ...tinyBtn, fontSize: 9 }}>+</button>
                </div>
                {meta.map((m, i) => (
                  <div key={i} style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                    <input value={m.label} onChange={(e) => updateMeta(i, "label", e.target.value)} placeholder="Label" style={{ ...smallInput, flex: 1 }} />
                    <input value={m.value} onChange={(e) => updateMeta(i, "value", e.target.value)} placeholder="Valeur" style={{ ...smallInput, flex: 1 }} />
                    <button onClick={() => removeMeta(i)} style={{ ...tinyBtn, color: colors.error }}>×</button>
                  </div>
                ))}
              </div>

              {/* Data grid */}
              <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                <button onClick={addColumn} style={{ ...btnStyle, background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text.secondary, fontSize: typography.fontSize.xs }}>+ Colonne</button>
                <button onClick={addRow} style={{ ...btnStyle, background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text.secondary, fontSize: typography.fontSize.xs }}>+ Ligne</button>
                {hasMasked && (
                  <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: typography.fontSize.xs, color: colors.text.muted, cursor: "pointer" }}>
                    <input type="checkbox" checked={showMasked} onChange={(e) => setShowMasked(e.target.checked)} />
                    Révéler
                  </label>
                )}
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ borderCollapse: "collapse", width: "100%", fontSize: typography.fontSize.xs }}>
                  <thead>
                    <tr>
                      <th style={{ width: 24 }} />
                      {visibleColumns.map((col) => (
                        <th key={col.id} style={{ padding: "4px 6px", fontWeight: 600, fontSize: typography.fontSize.xs, color: colors.text.muted, textAlign: "left", whiteSpace: "nowrap" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                            <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>{col.header}</span>
                            <span style={{ fontSize: 8, color: colors.text.muted, background: colors.bg, padding: "0 4px", borderRadius: 3 }}>{col.type}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, ri) => (
                      <tr key={row.id || ri}>
                        <td style={{ padding: "2px" }}>
                          <button onClick={() => removeRow(ri)} style={{ ...tinyBtn, width: 20, height: 20, fontSize: 9, color: colors.text.muted, border: "none", background: "transparent" }}>−</button>
                        </td>
                        {visibleColumns.map((col) => (
                          <td key={col.id} style={{ padding: "2px 4px" }}>
                            <input
                              value={row.cells?.[col.id] ?? ""}
                              onChange={(e) => {
                                const val = (col.type === "number" || col.type === "score-badge" || col.type === "progress") && e.target.value !== ""
                                  ? Number(e.target.value) || 0
                                  : e.target.value;
                                updateCell(ri, col.id, val);
                              }}
                              type={(col.type === "number" || col.type === "score-badge" || col.type === "progress") ? "number" : "text"}
                              style={{ ...smallInput, padding: "4px 6px", fontSize: typography.fontSize.xs }}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* COLUMNS TAB */}
          {tab === "columns" && (
            <div>
              {columns.map((col) => (
                <div key={col.id} style={{ padding: "8px 0", borderBottom: `1px solid ${colors.border}` }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
                    <input value={col.header} onChange={(e) => updateColumn(col.id, { header: e.target.value })} style={{ ...smallInput, flex: 1 }} />
                    <select value={col.type} onChange={(e) => updateColumn(col.id, { type: e.target.value })} style={{ ...smallInput, width: 120 }}>
                      {COLUMN_TYPES.map((ct) => <option key={ct.value} value={ct.value}>{ct.label}</option>)}
                    </select>
                    <select value={col.align || "left"} onChange={(e) => updateColumn(col.id, { align: e.target.value })} style={{ ...smallInput, width: 70 }}>
                      <option value="left">←</option>
                      <option value="center">↔</option>
                      <option value="right">→</option>
                    </select>
                    <label style={{ display: "flex", alignItems: "center", gap: 3, fontSize: typography.fontSize.xs, color: colors.text.muted, whiteSpace: "nowrap" }}>
                      <input type="checkbox" checked={col.hidden || false} onChange={(e) => updateColumn(col.id, { hidden: e.target.checked })} />
                      Masqué
                    </label>
                    {columns.length > 1 && (
                      <button onClick={() => removeColumn(col.id)} style={{ ...tinyBtn, color: colors.error }}>×</button>
                    )}
                  </div>
                  {/* Config JSON (advanced) — show as textarea for badge/score-badge/etc */}
                  {["badge", "score-badge", "icon-status", "status-dot", "circle-badge", "progress"].includes(col.type) && (
                    <div style={{ marginTop: 4 }}>
                      <div style={{ ...labelStyle, fontSize: 9 }}>Config (JSON)</div>
                      <textarea
                        value={JSON.stringify(col.config || {}, null, 2)}
                        onChange={(e) => { try { updateColumn(col.id, { config: JSON.parse(e.target.value) }); } catch {} }}
                        style={{ ...smallInput, height: 60, fontFamily: typography.fontFamily.body, fontSize: 9, resize: "vertical" }}
                      />
                    </div>
                  )}
                </div>
              ))}
              <button onClick={addColumn} style={{ ...btnStyle, marginTop: 8, background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text.secondary, fontSize: typography.fontSize.xs }}>+ Ajouter une colonne</button>
            </div>
          )}

          {/* FEATURES TAB */}
          {tab === "features" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <div style={labelStyle}>Sous-titre</div>
                <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} style={smallInput} />
              </div>
              <div>
                <div style={labelStyle}>Bordure accent (colonne)</div>
                <select value={accentBorderColumn || ""} onChange={(e) => setAccentBorderColumn(e.target.value || null)} style={smallInput}>
                  <option value="">Aucune</option>
                  {columns.filter((c) => c.type === "badge").map((c) => <option key={c.id} value={c.id}>{c.header}</option>)}
                </select>
              </div>
              <div>
                <div style={labelStyle}>Barre résumé (colonne)</div>
                <select value={summaryBar || ""} onChange={(e) => setSummaryBar(e.target.value || null)} style={smallInput}>
                  <option value="">Aucune</option>
                  {columns.filter((c) => c.type === "badge" || c.type === "icon-status").map((c) => <option key={c.id} value={c.id}>{c.header}</option>)}
                </select>
              </div>
              <div>
                <div style={labelStyle}>Grouper par (colonne)</div>
                <select value={groupByColumn || ""} onChange={(e) => setGroupByColumn(e.target.value || null)} style={smallInput}>
                  <option value="">Aucun</option>
                  {columns.map((c) => <option key={c.id} value={c.id}>{c.header}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* PRESETS TAB */}
          {tab === "presets" && (
            <div>
              <div style={{ ...labelStyle, marginBottom: 8 }}>Appliquer un modèle (remplace les données actuelles)</div>
              {["pentest", "network", "grc"].map((cat) => {
                const presets = TABLE_PRESETS.filter((p) => p.category === cat);
                if (!presets.length) return null;
                return (
                  <div key={cat} style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: typography.fontSize.xs, fontWeight: 600, color: colors.text.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{cat}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {presets.map((p) => (
                        <button key={p.id} onClick={() => applyPreset(p.id)} style={{
                          ...btnStyle, fontSize: typography.fontSize.xs,
                          background: preset === p.id ? accentColor : colors.bg,
                          color: preset === p.id ? "#fff" : colors.text.secondary,
                          border: `1px solid ${preset === p.id ? accentColor : colors.border}`,
                        }}>
                          <FontAwesomeIcon icon={p.icon} style={{ marginRight: 4 }} />{p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Preview Side */}
      <div style={previewSide}>
        <div style={labelStyle}>Aperçu</div>
        <UniversalTableBlock block={{ ...block, type: "table", data: blockData }} accentColor={accentColor} />
      </div>
    </div>
  );
}
