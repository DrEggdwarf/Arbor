import { useState, useEffect, useCallback } from "react";
import { useEditorStore } from "../../../stores/editorStore";
import { blockRenderers } from "../blocks";
import { colors } from "../../../styles/tokens";
import { inputStyle, labelStyle, smallInput } from "./shared";

export function GaugeChartEditor({ block }) {
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const accentColor = useEditorStore((s) => s.report?.accent_color) || colors.accentBright;
  const [title, setTitle] = useState(block.data?.title || "");
  const [value, setValue] = useState(block.data?.value ?? 72);
  const [max, setMax] = useState(block.data?.max ?? 100);
  const [unit, setUnit] = useState(block.data?.unit || "%");
  const [color, setColor] = useState(block.data?.color || "");

  const save = useCallback((t, v, m, u, c) => { updateBlock(block.id, { title: t, value: v, max: m, unit: u, color: c || undefined }); }, [block.id, updateBlock]);
  useEffect(() => { save(title, value, max, unit, color); }, [title, value, max, unit, color, save]);

  const Renderer = blockRenderers["gauge-chart"];
  const previewBlock = { ...block, data: { title, value, max, unit, color: color || undefined } };

  return (
    <div style={{ display: "flex", height: "65vh" }}>
      <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 12, borderRight: `1px solid ${colors.border}`, overflow: "auto" }}>
        <div><div style={labelStyle}>Titre</div><input value={title} onChange={(e) => setTitle(e.target.value)} style={smallInput} /></div>
        <div><div style={labelStyle}>Valeur</div><input type="number" value={value} onChange={(e) => setValue(Number(e.target.value) || 0)} style={smallInput} /><input type="range" min={0} max={max} value={value} onChange={(e) => setValue(Number(e.target.value))} style={{ width: "100%", marginTop: 4 }} /></div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}><div style={labelStyle}>Maximum</div><input type="number" value={max} onChange={(e) => setMax(Number(e.target.value) || 100)} style={smallInput} /></div>
          <div style={{ flex: 1 }}><div style={labelStyle}>Unité</div><input value={unit} onChange={(e) => setUnit(e.target.value)} style={smallInput} /></div>
        </div>
        <div><div style={labelStyle}>Couleur (vide = auto)</div><div style={{ display: "flex", gap: 8 }}><input type="color" value={color || "#2ecc71"} onChange={(e) => setColor(e.target.value)} style={{ width: 32, height: 32, border: "none", borderRadius: 6, cursor: "pointer", padding: 0 }} /><button onClick={() => setColor("")} style={{ ...smallInput, width: "auto", cursor: "pointer", color: colors.text.muted }}>Auto</button></div></div>
      </div>
      <div style={{ width: "50%", padding: 20, overflow: "auto", background: colors.bg }}>
        <div style={labelStyle}>Aperçu</div>
        {Renderer && <Renderer block={previewBlock} accentColor={accentColor} />}
      </div>
    </div>
  );
}
