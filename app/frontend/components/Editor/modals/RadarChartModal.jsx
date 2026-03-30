import { useState, useEffect, useCallback } from "react";
import { useEditorStore } from "../../../stores/editorStore";
import { blockRenderers } from "../blocks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { colors } from "../../../styles/tokens";
import { inputStyle, labelStyle, smallInput, tinyBtn } from "./shared";

export function RadarChartEditor({ block }) {
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const accentColor = useEditorStore((s) => s.report?.accent_color) || colors.accentBright;
  const [title, setTitle] = useState(block.data?.title || "");
  const [axes, setAxes] = useState(() => [...(block.data?.axes || [])].map((a) => ({ ...a })));
  const [color, setColor] = useState(block.data?.color || "#E8A855");

  const save = useCallback((t, a, c) => { updateBlock(block.id, { title: t, axes: a, color: c }); }, [block.id, updateBlock]);
  useEffect(() => { save(title, axes, color); }, [title, axes, color, save]);

  const Renderer = blockRenderers["radar-chart"];
  const previewBlock = { ...block, data: { title, axes, color } };

  return (
    <div style={{ display: "flex", height: "65vh" }}>
      <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 10, borderRight: `1px solid ${colors.border}`, overflow: "auto" }}>
        <div><div style={labelStyle}>Titre</div><input value={title} onChange={(e) => setTitle(e.target.value)} style={smallInput} /></div>
        <div><div style={labelStyle}>Couleur</div><input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ width: 32, height: 32, border: "none", borderRadius: 6, cursor: "pointer", padding: 0 }} /></div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={labelStyle}>Axes ({axes.length})</div>
          <button onClick={() => setAxes((prev) => [...prev, { label: `Axe ${prev.length + 1}`, value: 5, max: 10 }])}
            style={{ ...tinyBtn, width: "auto", padding: "4px 10px", color: colors.accentBright, borderColor: colors.accentBright }}>
            <FontAwesomeIcon icon="plus" style={{ fontSize: 9, marginRight: 4 }} /> Axe
          </button>
        </div>
        <div style={{ flex: 1, overflow: "auto" }}>
          {axes.map((ax, i) => (
            <div key={i} style={{ display: "flex", gap: 6, alignItems: "center", padding: "4px 0", borderBottom: `1px solid ${colors.border}` }}>
              <input value={ax.label || ""} onChange={(e) => setAxes((prev) => prev.map((a, j) => j === i ? { ...a, label: e.target.value } : a))} placeholder="Label" style={{ ...smallInput, flex: 2 }} />
              <input type="number" value={ax.value ?? 0} onChange={(e) => setAxes((prev) => prev.map((a, j) => j === i ? { ...a, value: Number(e.target.value) || 0 } : a))} style={{ ...smallInput, flex: 1, textAlign: "right" }} />
              <span style={{ fontSize: 10, color: colors.text.muted }}>/</span>
              <input type="number" value={ax.max ?? 10} onChange={(e) => setAxes((prev) => prev.map((a, j) => j === i ? { ...a, max: Number(e.target.value) || 10 } : a))} style={{ ...smallInput, width: 44, textAlign: "right" }} />
              <button onClick={() => setAxes((prev) => prev.filter((_, j) => j !== i))} style={{ ...tinyBtn, color: colors.error }}><FontAwesomeIcon icon="trash" /></button>
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
