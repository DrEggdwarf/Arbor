import { useState, useEffect, useCallback } from "react";
import { useEditorStore } from "../../../stores/editorStore";
import { blockRenderers } from "../blocks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { colors } from "../../../styles/tokens";
import { inputStyle, labelStyle, smallInput, tinyBtn, rowStyle, DEFAULT_COLORS } from "./shared";

export function ItemsChartModalEditor({ block, chartType, extraControls }) {
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const accentColor = useEditorStore((s) => s.report?.accent_color) || colors.accentBright;
  const [items, setItems] = useState(() => [...(block.data?.items || [])]);
  const [title, setTitle] = useState(block.data?.title || "");
  const [extras, setExtras] = useState(() => {
    const e = {};
    if (extraControls) extraControls.forEach((c) => { e[c.key] = block.data?.[c.key] ?? c.defaultValue; });
    return e;
  });

  const save = useCallback((newItems, newTitle, newExtras) => {
    updateBlock(block.id, { items: newItems, title: newTitle, ...newExtras });
  }, [block.id, updateBlock]);

  useEffect(() => { save(items, title, extras); }, [items, title, extras, save]);

  const updateItem = (idx, key, val) => {
    setItems((prev) => prev.map((it, i) => i === idx ? { ...it, [key]: key === "value" ? Number(val) || 0 : val } : it));
  };
  const removeItem = (idx) => setItems((prev) => prev.filter((_, i) => i !== idx));
  const addItem = () => setItems((prev) => [
    ...prev,
    { label: `Item ${prev.length + 1}`, value: 10, color: DEFAULT_COLORS[prev.length % DEFAULT_COLORS.length] },
  ]);
  const moveItem = (idx, dir) => {
    setItems((prev) => {
      const next = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  const Renderer = blockRenderers[chartType];
  const previewBlock = { ...block, data: { items, title, ...extras } };

  return (
    <div style={{ display: "flex", height: "65vh" }}>
      <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 10, borderRight: `1px solid ${colors.border}`, overflow: "auto" }}>
        <div>
          <div style={labelStyle}>Titre</div>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre" style={smallInput} />
        </div>
        {extraControls && extraControls.map((c) => (
          <div key={c.key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={labelStyle}>{c.label}</div>
            {c.type === "toggle" ? (
              <div onClick={() => setExtras((e) => ({ ...e, [c.key]: !e[c.key] }))}
                style={{ ...smallInput, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: extras[c.key] ? colors.accentBright : colors.text.muted, width: "auto" }}>
                <FontAwesomeIcon icon={extras[c.key] ? "check-circle" : "times"} style={{ fontSize: 12 }} />
                {extras[c.key] ? "Oui" : "Non"}
              </div>
            ) : null}
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
          <div style={labelStyle}>Items ({items.length})</div>
          <button onClick={addItem} style={{ ...tinyBtn, width: "auto", padding: "4px 10px", gap: 4, color: colors.accentBright, borderColor: colors.accentBright }}>
            <FontAwesomeIcon icon="plus" style={{ fontSize: 9 }} /> Ajouter
          </button>
        </div>
        <div style={{ flex: 1, overflow: "auto" }}>
          {items.map((item, i) => (
            <div key={i} style={rowStyle}>
              <input type="color" value={item.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]} onChange={(e) => updateItem(i, "color", e.target.value)} style={{ width: 28, height: 28, border: "none", borderRadius: 6, cursor: "pointer", padding: 0, flexShrink: 0 }} />
              <input value={item.label || ""} onChange={(e) => updateItem(i, "label", e.target.value)} placeholder="Label" style={{ ...smallInput, flex: 2 }} />
              <input type="number" value={item.value ?? 0} onChange={(e) => updateItem(i, "value", e.target.value)} style={{ ...smallInput, flex: 1, textAlign: "right" }} />
              <button onClick={() => moveItem(i, -1)} disabled={i === 0} style={{ ...tinyBtn, opacity: i === 0 ? 0.3 : 1 }}><FontAwesomeIcon icon="arrow-up" /></button>
              <button onClick={() => moveItem(i, 1)} disabled={i === items.length - 1} style={{ ...tinyBtn, opacity: i === items.length - 1 ? 0.3 : 1 }}><FontAwesomeIcon icon="arrow-down" /></button>
              <button onClick={() => removeItem(i)} style={{ ...tinyBtn, color: colors.error }}><FontAwesomeIcon icon="trash" /></button>
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
