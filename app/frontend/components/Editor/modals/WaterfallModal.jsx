import { useState, useEffect, useCallback } from "react";
import { useEditorStore } from "../../../stores/editorStore";
import { blockRenderers } from "../blocks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { colors } from "../../../styles/tokens";
import { inputStyle, labelStyle, smallInput, tinyBtn } from "./shared";

export function WaterfallEditor({ block }) {
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const accentColor = useEditorStore((s) => s.report?.accent_color) || colors.accentBright;
  const [title, setTitle] = useState(block.data?.title || "");
  const [items, setItems] = useState(() => [...(block.data?.items || [])].map((it) => ({ ...it })));

  const save = useCallback((t, its) => { updateBlock(block.id, { title: t, items: its }); }, [block.id, updateBlock]);
  useEffect(() => { save(title, items); }, [title, items, save]);

  const Renderer = blockRenderers["waterfall-chart"];
  const previewBlock = { ...block, data: { title, items } };

  return (
    <div style={{ display: "flex", height: "65vh" }}>
      <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 10, borderRight: `1px solid ${colors.border}`, overflow: "auto" }}>
        <div><div style={labelStyle}>Titre</div><input value={title} onChange={(e) => setTitle(e.target.value)} style={smallInput} /></div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={labelStyle}>Étapes ({items.length})</div>
          <button onClick={() => setItems((prev) => [...prev, { label: `Étape ${prev.length + 1}`, value: 10, type: "increase" }])}
            style={{ ...tinyBtn, width: "auto", padding: "4px 10px", color: colors.accentBright, borderColor: colors.accentBright }}>
            <FontAwesomeIcon icon="plus" style={{ fontSize: 9, marginRight: 4 }} /> Ajouter
          </button>
        </div>
        <div style={{ flex: 1, overflow: "auto" }}>
          {items.map((it, i) => (
            <div key={i} style={{ display: "flex", gap: 6, alignItems: "center", padding: "4px 0", borderBottom: `1px solid ${colors.border}` }}>
              <input value={it.label || ""} onChange={(e) => setItems((prev) => prev.map((item, j) => j === i ? { ...item, label: e.target.value } : item))} placeholder="Label" style={{ ...smallInput, flex: 2 }} />
              <input type="number" value={it.value ?? 0} onChange={(e) => setItems((prev) => prev.map((item, j) => j === i ? { ...item, value: Number(e.target.value) || 0 } : item))} style={{ ...smallInput, width: 64, textAlign: "right" }} />
              <select value={it.type || "increase"} onChange={(e) => setItems((prev) => prev.map((item, j) => j === i ? { ...item, type: e.target.value } : item))}
                style={{ ...smallInput, width: 80, cursor: "pointer" }}>
                <option value="increase">+</option>
                <option value="decrease">−</option>
                <option value="total">Total</option>
              </select>
              <button onClick={() => setItems((prev) => prev.filter((_, j) => j !== i))} style={{ ...tinyBtn, color: colors.error }}><FontAwesomeIcon icon="trash" /></button>
            </div>
          ))}
        </div>
      </div>
      <div style={{ width: "50%", padding: 20, overflow: "auto", background: colors.bg }}>
        <div style={labelStyle}>Aperçu</div>
        {Renderer && <Renderer block={previewBlock} accentColor={accentColor} />}
      </div>
    </div>
  );
}
