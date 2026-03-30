import { useState, useEffect, useCallback } from "react";
import { useEditorStore } from "../../../stores/editorStore";
import { blockRenderers } from "../blocks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { colors, typography } from "../../../styles/tokens";
import { inputStyle, labelStyle, smallInput, tinyBtn, rowStyle, btnStyle, splitLayout, editorSide, previewSide } from "./shared";

const uid = () => crypto.randomUUID?.() || Date.now().toString(36);

export function RiskAppetiteEditor({ block }) {
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const accentColor = useEditorStore((s) => s.report?.accent_color) || colors.accentBright;
  const [data, setData] = useState(() => ({ ...block.data }));

  const update = useCallback((patch) => {
    setData((prev) => ({ ...prev, ...patch }));
  }, []);

  useEffect(() => { updateBlock(block.id, data); }, [data, block.id, updateBlock]);

  const categories = data.categories || [];

  const addCategory = () => {
    update({
      categories: [...categories, {
        id: uid(),
        name: "",
        current: 30,
        appetite: 50,
        max: 100,
        notes: "",
      }],
    });
  };

  const removeCategory = (i) => {
    update({ categories: categories.filter((_, j) => j !== i) });
  };

  const updateCategory = (i, key, val) => {
    update({ categories: categories.map((c, j) => j === i ? { ...c, [key]: val } : c) });
  };

  const deriveStatus = (current, appetite) => {
    if (current <= appetite) return { label: "Acceptable", color: "#27ae60" };
    if (current <= appetite + 20) return { label: "Tolérable", color: "#f39c12" };
    return { label: "Inacceptable", color: "#c0392b" };
  };

  const Renderer = blockRenderers["risk-appetite"];
  const previewBlock = { ...block, data };

  return (
    <div style={splitLayout}>
      <div style={editorSide}>
        {/* Title */}
        <div>
          <div style={labelStyle}>Titre</div>
          <input value={data.title || ""} onChange={(e) => update({ title: e.target.value })} style={smallInput} />
        </div>

        {/* Description */}
        <div>
          <div style={labelStyle}>Description</div>
          <textarea
            value={data.description || ""}
            onChange={(e) => update({ description: e.target.value })}
            rows={2}
            placeholder="Description de la politique d'appétit pour le risque…"
            style={{ ...smallInput, resize: "vertical", minHeight: 40 }}
          />
        </div>

        {/* Categories header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={labelStyle}>Catégories ({categories.length})</div>
          <button onClick={addCategory} style={{ ...tinyBtn, width: "auto", padding: "3px 8px", color: colors.accentBright, borderColor: colors.accentBright }}>
            <FontAwesomeIcon icon="plus" style={{ fontSize: 9 }} /> Catégorie
          </button>
        </div>

        {/* Categories list */}
        <div style={{ flex: 1, overflow: "auto" }}>
          {categories.map((cat, i) => {
            const status = deriveStatus(cat.current ?? 0, cat.appetite ?? 50);
            return (
              <div key={cat.id || i} style={{ ...rowStyle, flexWrap: "wrap", gap: 4, padding: "6px 0" }}>
                {/* Row 1: name + status badge + remove */}
                <div style={{ display: "flex", gap: 4, width: "100%", alignItems: "center" }}>
                  <input
                    value={cat.name || ""}
                    onChange={(e) => updateCategory(i, "name", e.target.value)}
                    placeholder="Nom de la catégorie"
                    style={{ ...smallInput, flex: 1 }}
                  />
                  <span style={{
                    fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 4,
                    color: status.color, background: `${status.color}18`,
                    whiteSpace: "nowrap",
                  }}>
                    {status.label}
                  </span>
                  <button onClick={() => removeCategory(i)} style={{ ...tinyBtn, color: colors.error, borderColor: colors.error }}>
                    <FontAwesomeIcon icon="times" style={{ fontSize: 9 }} />
                  </button>
                </div>
                {/* Row 2: current + appetite + notes */}
                <div style={{ display: "flex", gap: 4, width: "100%", alignItems: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <span style={{ ...labelStyle, fontSize: 9, marginBottom: 0 }}>Actuel</span>
                    <input
                      type="number" min={0} max={100}
                      value={cat.current ?? 30}
                      onChange={(e) => updateCategory(i, "current", Math.min(100, Math.max(0, +e.target.value || 0)))}
                      style={{ ...smallInput, width: 56, textAlign: "center" }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <span style={{ ...labelStyle, fontSize: 9, marginBottom: 0 }}>Seuil</span>
                    <input
                      type="number" min={0} max={100}
                      value={cat.appetite ?? 50}
                      onChange={(e) => updateCategory(i, "appetite", Math.min(100, Math.max(0, +e.target.value || 0)))}
                      style={{ ...smallInput, width: 56, textAlign: "center" }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
                    <span style={{ ...labelStyle, fontSize: 9, marginBottom: 0 }}>Notes</span>
                    <input
                      value={cat.notes || ""}
                      onChange={(e) => updateCategory(i, "notes", e.target.value)}
                      placeholder="Notes…"
                      style={smallInput}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={previewSide}>
        <Renderer block={previewBlock} accentColor={accentColor} />
      </div>
    </div>
  );
}
