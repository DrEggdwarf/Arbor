import { useState, useEffect, useCallback } from "react";
import { useEditorStore } from "../../../stores/editorStore";
import { blockRenderers } from "../blocks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { colors, typography } from "../../../styles/tokens";
import { inputStyle, labelStyle, smallInput, tinyBtn, rowStyle, splitLayout, editorSide, previewSide } from "./shared";

const TYPE_OPTIONS = ["network", "web", "api", "mobile", "cloud", "iot", "wireless"];

function ScopeTable({ items, onChange, label }) {
  const add = () => onChange([...items, { target: "", type: "web", description: "" }]);
  const remove = (i) => onChange(items.filter((_, j) => j !== i));
  const update = (i, key, val) => onChange(items.map((it, j) => j === i ? { ...it, [key]: val } : it));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div style={labelStyle}>{label} ({items.length})</div>
        <button onClick={add} style={{ ...tinyBtn, width: "auto", padding: "3px 8px", color: colors.accentBright, borderColor: colors.accentBright }}>
          <FontAwesomeIcon icon="plus" style={{ fontSize: 9 }} />
        </button>
      </div>
      {items.map((item, i) => (
        <div key={i} style={{ ...rowStyle, gap: 4 }}>
          <input value={item.target || ""} onChange={(e) => update(i, "target", e.target.value)} placeholder="Cible" style={{ ...smallInput, flex: 2 }} />
          <select value={item.type || "web"} onChange={(e) => update(i, "type", e.target.value)} style={{ ...smallInput, flex: 1, cursor: "pointer" }}>
            {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <input value={item.description || ""} onChange={(e) => update(i, "description", e.target.value)} placeholder="Description" style={{ ...smallInput, flex: 3 }} />
          <button onClick={() => remove(i)} style={tinyBtn}>
            <FontAwesomeIcon icon="times" style={{ fontSize: 9, color: colors.error }} />
          </button>
        </div>
      ))}
    </div>
  );
}

export function ScopeBlockEditor({ block }) {
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const accentColor = useEditorStore((s) => s.report?.accent_color) || colors.accentBright;
  const [data, setData] = useState(() => ({ ...block.data }));

  const update = useCallback((patch) => setData((prev) => ({ ...prev, ...patch })), []);
  useEffect(() => { updateBlock(block.id, data); }, [data, block.id, updateBlock]);

  const Renderer = blockRenderers["scope-block"];
  const previewBlock = { ...block, data };

  return (
    <div style={splitLayout}>
      <div style={editorSide}>
        <div>
          <div style={labelStyle}>Titre</div>
          <input value={data.title || ""} onChange={(e) => update({ title: e.target.value })} style={smallInput} />
        </div>

        <ScopeTable label="✓ In Scope" items={data.inScope || []} onChange={(inScope) => update({ inScope })} />
        <ScopeTable label="✗ Out of Scope" items={data.outOfScope || []} onChange={(outOfScope) => update({ outOfScope })} />

        <div>
          <div style={labelStyle}>Notes</div>
          <textarea value={data.notes || ""} onChange={(e) => update({ notes: e.target.value })} rows={2} style={{ ...inputStyle, resize: "vertical" }} />
        </div>
      </div>

      <div style={previewSide}>
        <div style={labelStyle}>Aperçu</div>
        {Renderer && <Renderer block={previewBlock} accentColor={accentColor} />}
      </div>
    </div>
  );
}
