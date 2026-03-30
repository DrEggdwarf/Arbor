import { useState, useEffect, useCallback } from "react";
import { useEditorStore } from "../../../stores/editorStore";
import { blockRenderers } from "../blocks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { colors } from "../../../styles/tokens";
import { inputStyle, labelStyle, smallInput, tinyBtn, DEFAULT_COLORS } from "./shared";

export function ScatterPlotEditor({ block }) {
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const accentColor = useEditorStore((s) => s.report?.accent_color) || colors.accentBright;
  const [title, setTitle] = useState(block.data?.title || "");
  const [xLabel, setXLabel] = useState(block.data?.xLabel || "");
  const [yLabel, setYLabel] = useState(block.data?.yLabel || "");
  const [points, setPoints] = useState(() => [...(block.data?.points || [])].map((p) => ({ ...p })));

  const save = useCallback((t, xl, yl, p) => { updateBlock(block.id, { title: t, xLabel: xl, yLabel: yl, points: p }); }, [block.id, updateBlock]);
  useEffect(() => { save(title, xLabel, yLabel, points); }, [title, xLabel, yLabel, points, save]);

  const Renderer = blockRenderers["scatter-plot"];
  const previewBlock = { ...block, data: { title, xLabel, yLabel, points } };

  return (
    <div style={{ display: "flex", height: "65vh" }}>
      <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 10, borderRight: `1px solid ${colors.border}`, overflow: "auto" }}>
        <div><div style={labelStyle}>Titre</div><input value={title} onChange={(e) => setTitle(e.target.value)} style={smallInput} /></div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}><div style={labelStyle}>Axe X</div><input value={xLabel} onChange={(e) => setXLabel(e.target.value)} style={smallInput} /></div>
          <div style={{ flex: 1 }}><div style={labelStyle}>Axe Y</div><input value={yLabel} onChange={(e) => setYLabel(e.target.value)} style={smallInput} /></div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={labelStyle}>Points ({points.length})</div>
          <button onClick={() => setPoints((prev) => [...prev, { x: 5, y: 5, label: `P${prev.length + 1}`, color: DEFAULT_COLORS[prev.length % DEFAULT_COLORS.length] }])}
            style={{ ...tinyBtn, width: "auto", padding: "4px 10px", color: colors.accentBright, borderColor: colors.accentBright }}>
            <FontAwesomeIcon icon="plus" style={{ fontSize: 9, marginRight: 4 }} /> Point
          </button>
        </div>
        <div style={{ flex: 1, overflow: "auto" }}>
          {points.map((pt, i) => (
            <div key={i} style={{ display: "flex", gap: 6, alignItems: "center", padding: "4px 0", borderBottom: `1px solid ${colors.border}` }}>
              <input type="color" value={pt.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]} onChange={(e) => setPoints((prev) => prev.map((p, j) => j === i ? { ...p, color: e.target.value } : p))} style={{ width: 24, height: 24, border: "none", borderRadius: 6, cursor: "pointer", padding: 0 }} />
              <input value={pt.label || ""} onChange={(e) => setPoints((prev) => prev.map((p, j) => j === i ? { ...p, label: e.target.value } : p))} placeholder="Label" style={{ ...smallInput, flex: 2 }} />
              <input type="number" value={pt.x ?? 0} onChange={(e) => setPoints((prev) => prev.map((p, j) => j === i ? { ...p, x: Number(e.target.value) || 0 } : p))} placeholder="X" style={{ ...smallInput, width: 54, textAlign: "right" }} step="0.1" />
              <input type="number" value={pt.y ?? 0} onChange={(e) => setPoints((prev) => prev.map((p, j) => j === i ? { ...p, y: Number(e.target.value) || 0 } : p))} placeholder="Y" style={{ ...smallInput, width: 54, textAlign: "right" }} step="0.1" />
              <button onClick={() => setPoints((prev) => prev.filter((_, j) => j !== i))} style={{ ...tinyBtn, color: colors.error }}><FontAwesomeIcon icon="trash" /></button>
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
