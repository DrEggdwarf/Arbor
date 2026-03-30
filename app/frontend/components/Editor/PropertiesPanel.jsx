import { useState, useEffect } from "react";
import { useEditorStore } from "../../stores/editorStore";
import { getBlockType, blockRegistry } from "../../stores/blockRegistry";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "../../lib/useTranslation";
import { colors, typography, layout, radii } from "../../styles/tokens";

const ACCENT_SWATCHES = [
  "#6C5CE7", "#00B894", "#E17055", "#0984E3", "#FDCB6E",
  "#E84393", "#00CEC9", "#D63031", "#A29BFE", "#55EFC4",
];

const labelStyle = {
  fontFamily: typography.fontFamily.body,
  fontSize: typography.fontSize.sm,
  color: colors.text.muted,
  letterSpacing: "0.04em",
};

const inputStyle = {
  fontFamily: typography.fontFamily.body,
  fontSize: typography.fontSize.base,
  color: colors.text.primary,
  background: colors.bg,
  border: `1px solid ${colors.border}`,
  borderRadius: radii.md,
  padding: "6px 8px",
  outline: "none",
  width: "100%",
  transition: "border-color 0.15s",
};

/* ── Generic property field renderer ── */
function PropertyField({ prop, value, onChange }) {
  switch (prop.type) {
    case "text":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={labelStyle}>{prop.label}</div>
          <input value={value ?? ""} onChange={(e) => onChange(prop.key, e.target.value)} style={inputStyle} />
        </div>
      );
    case "textarea":
    case "code":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={labelStyle}>{prop.label}</div>
          <textarea
            value={value ?? ""}
            onChange={(e) => onChange(prop.key, e.target.value)}
            style={{
              ...inputStyle,
              minHeight: prop.type === "code" ? 120 : 80,
              resize: "vertical",
              lineHeight: 1.6,
            }}
          />
        </div>
      );
    case "select":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={labelStyle}>{prop.label}</div>
          <select
            value={value ?? ""}
            onChange={(e) => {
              const opt = prop.options?.find(o => String(o.value) === e.target.value);
              onChange(prop.key, opt ? opt.value : e.target.value);
            }}
            style={{ ...inputStyle, cursor: "pointer" }}
          >
            {prop.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      );
    case "range":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ ...labelStyle, display: "flex", justifyContent: "space-between" }}>
            {prop.label}
            <span>{value ?? prop.min ?? 0}{prop.unit || ""}</span>
          </div>
          <input
            type="range" value={value ?? prop.min ?? 0}
            min={prop.min} max={prop.max} step={prop.step || 1}
            onChange={(e) => onChange(prop.key, Number(e.target.value))}
            style={{ width: "100%", accentColor: colors.accentBright }}
          />
        </div>
      );
    case "toggle":
      return (
        <div
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
          onClick={() => onChange(prop.key, !value)}
        >
          <div style={labelStyle}>{prop.label}</div>
          <div style={{
            width: 36, height: 20, borderRadius: 10,
            background: value ? colors.accentBright : colors.border,
            position: "relative", transition: "background 0.2s", flexShrink: 0,
          }}>
            <div style={{
              position: "absolute", top: 2, left: value ? 18 : 2,
              width: 16, height: 16, borderRadius: "50%",
              background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
              transition: "left 0.2s",
            }} />
          </div>
        </div>
      );
    default:
      return null;
  }
}

/* ── Image list editor ── */
function ImageListEditor({ images = [], onChange }) {
  const updateImage = (i, key, val) => {
    const updated = images.map((img, j) => j === i ? { ...img, [key]: val } : img);
    onChange("images", updated);
  };
  const addImage = () => onChange("images", [...images, { url: "", caption: "" }]);
  const removeImage = (i) => { if (images.length > 1) onChange("images", images.filter((_, j) => j !== i)); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={labelStyle}>Images</div>
      {images.map((img, i) => (
        <div key={i} style={{
          background: colors.bg, border: `1px solid ${colors.border}`,
          borderRadius: radii.lg, padding: 10,
          display: "flex", flexDirection: "column", gap: 6,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: typography.fontSize.xs, color: colors.text.muted, fontWeight: 600 }}>#{i + 1}</span>
            {images.length > 1 && (
              <button onClick={() => removeImage(i)} style={{
                marginLeft: "auto", background: "transparent", border: "none",
                color: colors.error, cursor: "pointer", fontSize: 10, padding: 2,
              }}>
                <FontAwesomeIcon icon="times" />
              </button>
            )}
          </div>
          <input
            placeholder="URL de l'image" value={img.url || ""}
            onChange={(e) => updateImage(i, "url", e.target.value)}
            style={{ ...inputStyle, fontSize: typography.fontSize.sm }}
          />
          <input
            placeholder="Légende" value={img.caption || ""}
            onChange={(e) => updateImage(i, "caption", e.target.value)}
            style={{ ...inputStyle, fontSize: typography.fontSize.sm }}
          />
          {img.url && (
            <img
              src={img.url} alt="" draggable={false}
              style={{ width: "100%", height: 60, objectFit: "cover", borderRadius: radii.md, background: "#000" }}
              onError={(e) => { e.target.style.display = "none"; }}
            />
          )}
        </div>
      ))}
      <button onClick={addImage} style={{
        ...inputStyle, cursor: "pointer", display: "flex", alignItems: "center",
        justifyContent: "center", gap: 6, color: colors.text.muted,
        border: `1px dashed ${colors.border}`, padding: "8px", background: "transparent",
      }}>
        <FontAwesomeIcon icon="plus" style={{ fontSize: 10 }} />
        Ajouter une image
      </button>
    </div>
  );
}

/* ── Table editor ── */
function TableEditor({ data, onChange }) {
  const { headers = [], rows = [] } = data;
  const updateHeader = (i, v) => { const h = [...headers]; h[i] = v; onChange("headers", h); };
  const updateCell = (ri, ci, v) => {
    const r = rows.map((row, i) => i === ri ? row.map((c, j) => j === ci ? v : c) : [...row]);
    onChange("rows", r);
  };
  const addCol = () => { onChange("headers", [...headers, `Col ${headers.length + 1}`]); onChange("rows", rows.map(r => [...r, ""])); };
  const addRow = () => onChange("rows", [...rows, headers.map(() => "")]);
  const rmCol = (ci) => { if (headers.length <= 1) return; onChange("headers", headers.filter((_, i) => i !== ci)); onChange("rows", rows.map(r => r.filter((_, i) => i !== ci))); };
  const rmRow = (ri) => onChange("rows", rows.filter((_, i) => i !== ri));

  const cellInput = { ...inputStyle, fontSize: typography.fontSize.xs, padding: "3px 5px" };
  const miniBtn = {
    fontFamily: typography.fontFamily.body, fontSize: typography.fontSize.xs,
    background: "transparent", border: `1px solid ${colors.border}`,
    borderRadius: 3, padding: "1px 5px", cursor: "pointer", color: colors.text.muted,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ ...labelStyle, display: "flex", justifyContent: "space-between" }}>
        Tableau
        <div style={{ display: "flex", gap: 4 }}>
          <button onClick={addCol} style={miniBtn}>+Col</button>
          <button onClick={addRow} style={miniBtn}>+Lig</button>
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} style={{ padding: 2 }}>
                  <div style={{ display: "flex", gap: 2 }}>
                    <input value={h} onChange={(e) => updateHeader(i, e.target.value)} style={{ ...cellInput, fontWeight: 600 }} />
                    {headers.length > 1 && (
                      <button onClick={() => rmCol(i)} style={{ background: "transparent", border: "none", color: colors.text.muted, cursor: "pointer", fontSize: 8, padding: 2 }}>
                        <FontAwesomeIcon icon="times" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {(Array.isArray(row) ? row : []).map((cell, ci) => (
                  <td key={ci} style={{ padding: 2 }}>
                    <input value={cell} onChange={(e) => updateCell(ri, ci, e.target.value)} style={cellInput} />
                  </td>
                ))}
                <td style={{ padding: 2 }}>
                  <button onClick={() => rmRow(ri)} style={{ background: "transparent", border: "none", color: colors.text.muted, cursor: "pointer", fontSize: 8, padding: 2 }}>
                    <FontAwesomeIcon icon="times" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Children editor for containers ── */
function ChildrenEditor({ block, label }) {
  const { addChildBlock, removeChildBlock, setSelectedBlock } = useEditorStore();
  const children = block.children || [];

  // Non-container block types that can be added as children
  const childTypes = blockRegistry.filter((b) => !b.isContainer);

  const handleAdd = (type) => {
    const spec = getBlockType(type);
    addChildBlock(block.id, type, { ...(spec?.defaultData || {}) });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ ...labelStyle, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {label}
        <span style={{ fontSize: typography.fontSize.xs, color: colors.text.muted }}>{children.length}</span>
      </div>

      {/* Existing children list */}
      {children.map((child, i) => {
        const childSpec = getBlockType(child.type);
        return (
          <div key={child.id} style={{
            display: "flex", alignItems: "center", gap: 6,
            background: colors.bg, borderRadius: radii.md, padding: "5px 8px",
          }}>
            <FontAwesomeIcon icon={childSpec?.icon || "cube"} style={{ color: colors.text.muted, fontSize: 10, width: 14 }} />
            <span
              onClick={() => setSelectedBlock(child.id)}
              style={{
                flex: 1, cursor: "pointer",
                fontFamily: typography.fontFamily.body, fontSize: typography.fontSize.xs,
                color: colors.text.primary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}
            >
              {childSpec?.label || child.type}
            </span>
            <button onClick={() => removeChildBlock(block.id, child.id)} style={{
              background: "transparent", border: "none", color: colors.text.muted,
              cursor: "pointer", fontSize: 9, padding: 2,
            }}>
              <FontAwesomeIcon icon="times" />
            </button>
          </div>
        );
      })}

      {/* Add child dropdown */}
      <select
        value=""
        onChange={(e) => { if (e.target.value) handleAdd(e.target.value); }}
        style={{
          ...inputStyle, cursor: "pointer", color: colors.text.muted,
          fontSize: typography.fontSize.xs,
        }}
      >
        <option value="">+ Ajouter un bloc...</option>
        {childTypes.map((bt) => (
          <option key={bt.type} value={bt.type}>{bt.label}</option>
        ))}
      </select>
    </div>
  );
}

/* ── Recursive block finder ── */
function findBlockDeep(blocks, id) {
  if (!blocks) return null;
  for (const b of blocks) {
    if (b.id === id) return b;
    if (b.children?.length) {
      const found = findBlockDeep(b.children, id);
      if (found) return found;
    }
  }
  return null;
}

/* ── Properties Panel ── */
export function PropertiesPanel({ onOpenModal }) {
  const { t } = useTranslation();
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const report = useEditorStore((s) => s.report);
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const updateMeta = useEditorStore((s) => s.updateMeta);

  const block = selectedBlockId ? findBlockDeep(report?.content?.blocks, selectedBlockId) : null;
  const spec = block ? getBlockType(block.type) : null;

  const handleChange = (key, value) => {
    if (!selectedBlockId) return;
    updateBlock(selectedBlockId, { [key]: value });
  };

  return (
    <div style={{
      width: layout.propertiesPanelWidth,
      background: colors.surface,
      borderLeft: `1px solid ${colors.border}`,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{
        padding: "14px 16px",
        borderBottom: `1px solid ${colors.border}`,
        fontFamily: typography.fontFamily.body,
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: colors.text.muted,
      }}>
        {t("editor.properties")}
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflow: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
        {block && spec ? (
          <>
            {/* Block type badge */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 10px", background: colors.bg, borderRadius: radii.lg,
            }}>
              <FontAwesomeIcon icon={spec.icon} style={{ color: colors.accentBright, fontSize: 12 }} />
              <span style={{
                fontFamily: typography.fontFamily.body,
                fontSize: typography.fontSize.sm,
                color: colors.text.primary,
                fontWeight: typography.fontWeight.medium,
              }}>
                {spec.label}
              </span>
            </div>

            <div style={{ height: 1, background: colors.border }} />

            {/* Expand button for complex blocks */}
            {["table", "code", "text", "score-gauge", "risk-matrix", "risk-assessment", "bar-chart", "line-chart", "pie-chart", "gauge-chart", "radar-chart", "heatmap", "stacked-bar", "area-chart", "scatter-plot", "sparkline", "funnel-chart", "waterfall-chart", "treemap", "sankey-diagram", "vulnerability-card", "scope-block", "recommendation", "credentials-table", "cve-table", "cvss-calculator", "attack-timeline", "attack-path", "privilege-escalation", "ebios-feared-events", "ebios-scenarios", "ebios-target", "compliance-checklist", "gap-analysis", "risk-register", "maturity-radar", "risk-appetite", "action-plan", "raci-matrix", "control-matrix", "compliance-gauge"].includes(block.type) && onOpenModal && (
              <button
                onClick={() => onOpenModal(block.id, block.type)}
                style={{
                  fontFamily: typography.fontFamily.body, fontSize: typography.fontSize.sm,
                  padding: "7px 10px", borderRadius: radii.md,
                  border: `1px solid ${colors.border}`,
                  background: colors.bg, color: colors.text.secondary,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                  letterSpacing: "0.02em", transition: "all 0.15s", width: "100%",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.accentBright; e.currentTarget.style.color = colors.accentBright; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.color = colors.text.secondary; }}
              >
                <FontAwesomeIcon icon="expand" style={{ fontSize: 11 }} />
                Ouvrir l{"'"}éditeur
              </button>
            )}

            {/* Dynamic properties */}
            {spec.properties?.map((prop) => {
              if (prop.type === "image-list") {
                return <ImageListEditor key={prop.key} images={block.data?.images} onChange={handleChange} />;
              }
              if (prop.type === "table-editor") {
                return <TableEditor key={prop.key} data={block.data || {}} onChange={handleChange} />;
              }
              if (prop.type === "children-editor") {
                return <ChildrenEditor key={prop.key} block={block} label={prop.label} />;
              }
              return <PropertyField key={prop.key} prop={prop} value={block.data?.[prop.key]} onChange={handleChange} />;
            })}
          </>
        ) : (
          <>
            {/* Report settings when no block selected */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={labelStyle}>Type de rapport</div>
              <select
                value={report?.report_type || "pentest"}
                onChange={(e) => {
                  const newType = e.target.value;
                  updateMeta("report_type", newType);
                  // Force immediate persist (don't wait for autosave)
                  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
                  if (report?.id) {
                    fetch(`/reports/${report.id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken, Accept: "application/json" },
                      body: JSON.stringify({ report: { report_type: newType } }),
                    });
                  }
                }}
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                {["pentest", "grc", "infra", "audit"].map((rt) => (
                  <option key={rt} value={rt}>{t(`reports.types.${rt}`)}</option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={labelStyle}>Accent</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
                {ACCENT_SWATCHES.map((c) => (
                  <div
                    key={c}
                    onClick={() => updateMeta("accent_color", c)}
                    style={{
                      width: 22, height: 22, borderRadius: radii.md,
                      background: c, cursor: "pointer", transition: "transform 0.1s",
                      border: report?.accent_color === c ? `2px solid ${colors.text.primary}` : "2px solid transparent",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
                  />
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                <input
                  type="color"
                  value={report?.accent_color || "#E8A855"}
                  onChange={(e) => updateMeta("accent_color", e.target.value)}
                  style={{ width: 28, height: 28, padding: 0, border: `1px solid ${colors.border}`, borderRadius: radii.md, cursor: "pointer", background: "transparent" }}
                />
                <input
                  value={report?.accent_color || "#E8A855"}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) updateMeta("accent_color", v);
                  }}
                  maxLength={7}
                  style={{ ...inputStyle, width: 80, fontFamily: typography.fontFamily.body, fontSize: typography.fontSize.sm, textTransform: "uppercase" }}
                />
              </div>
            </div>

            <div style={{ height: 1, background: colors.border }} />

            <div style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
              color: colors.text.muted, fontFamily: typography.fontFamily.body,
              fontSize: typography.fontSize.sm, textAlign: "center",
            }}>
              {t("editor.no_selection")}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
