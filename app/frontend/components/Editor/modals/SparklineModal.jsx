import { useState, useEffect, useCallback } from "react";
import { useEditorStore } from "../../../stores/editorStore";
import { blockRenderers } from "../blocks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { colors } from "../../../styles/tokens";
import { inputStyle, labelStyle, smallInput } from "./shared";

export function SparklineEditor({ block }) {
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const accentColor = useEditorStore((s) => s.report?.accent_color) || colors.accentBright;
  const [title, setTitle] = useState(block.data?.title || "");
  const [values, setValues] = useState(() => [...(block.data?.values || [])]);
  const [color, setColor] = useState(block.data?.color || "#E8A855");

  const save = useCallback((t, v, c) => { updateBlock(block.id, { title: t, values: v, color: c }); }, [block.id, updateBlock]);
  useEffect(() => { save(title, values, color); }, [title, values, color, save]);

  const Renderer = blockRenderers["sparkline"];
  const previewBlock = { ...block, data: { title, values, color } };

  return (
    <div style={{ display: "flex", height: "65vh" }}>
      <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 10, borderRight: `1px solid ${colors.border}`, overflow: "auto" }}>
        <div><div style={labelStyle}>Titre</div><input value={title} onChange={(e) => setTitle(e.target.value)} style={smallInput} /></div>
        <div><div style={labelStyle}>Couleur</div><input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ width: 32, height: 32, border: "none", borderRadius: 6, cursor: "pointer", padding: 0 }} /></div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={labelStyle}>Valeurs ({values.length})</div>
          <button onClick={() => setValues((prev) => [...prev, 0])}
            style={{ fontSize: 10, padding: "2px 8px", borderRadius: 6, border: `1px solid ${colors.accentBright}`, background: "transparent", color: colors.accentBright, cursor: "pointer" }}>+</button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, flex: 1, overflow: "auto", alignContent: "flex-start" }}>
          {values.map((v, i) => (
            <div key={i} style={{ display: "flex", gap: 2 }}>
              <input type="number" value={v} onChange={(e) => setValues((prev) => prev.map((val, j) => j === i ? Number(e.target.value) || 0 : val))}
                style={{ ...smallInput, width: 48, textAlign: "right" }} />
              <button onClick={() => setValues((prev) => prev.filter((_, j) => j !== i))}
                style={{ width: 18, height: 18, borderRadius: 4, border: `1px solid ${colors.border}`, background: colors.bg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: colors.error }}><FontAwesomeIcon icon="times" /></button>
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
