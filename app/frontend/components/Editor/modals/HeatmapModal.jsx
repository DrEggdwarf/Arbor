import { useState, useEffect, useCallback } from "react";
import { useEditorStore } from "../../../stores/editorStore";
import { blockRenderers } from "../blocks";
import { colors, typography } from "../../../styles/tokens";
import { inputStyle, labelStyle, smallInput } from "./shared";

export function HeatmapEditor({ block }) {
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const accentColor = useEditorStore((s) => s.report?.accent_color) || colors.accentBright;
  const [title, setTitle] = useState(block.data?.title || "");
  const [xLabels, setXLabels] = useState(() => [...(block.data?.xLabels || [])]);
  const [yLabels, setYLabels] = useState(() => [...(block.data?.yLabels || [])]);
  const [data, setData] = useState(() => (block.data?.data || []).map((r) => [...r]));
  const [minColor, setMinColor] = useState(block.data?.minColor || "#f0ede6");
  const [maxColor, setMaxColor] = useState(block.data?.maxColor || "#e74c3c");

  const save = useCallback((t, xl, yl, d, mc, xc) => { updateBlock(block.id, { title: t, xLabels: xl, yLabels: yl, data: d, minColor: mc, maxColor: xc }); }, [block.id, updateBlock]);
  useEffect(() => { save(title, xLabels, yLabels, data, minColor, maxColor); }, [title, xLabels, yLabels, data, minColor, maxColor, save]);

  const Renderer = blockRenderers["heatmap"];
  const previewBlock = { ...block, data: { title, xLabels, yLabels, data, minColor, maxColor } };

  return (
    <div style={{ display: "flex", height: "65vh" }}>
      <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 10, borderRight: `1px solid ${colors.border}`, overflow: "auto" }}>
        <div><div style={labelStyle}>Titre</div><input value={title} onChange={(e) => setTitle(e.target.value)} style={{ ...smallInput, padding: "5px 8px" }} /></div>
        <div style={{ display: "flex", gap: 12 }}>
          <div><div style={labelStyle}>Couleur min</div><input type="color" value={minColor} onChange={(e) => setMinColor(e.target.value)} style={{ width: 32, height: 32, border: "none", borderRadius: 6, cursor: "pointer" }} /></div>
          <div><div style={labelStyle}>Couleur max</div><input type="color" value={maxColor} onChange={(e) => setMaxColor(e.target.value)} style={{ width: 32, height: 32, border: "none", borderRadius: 6, cursor: "pointer" }} /></div>
        </div>
        <div style={labelStyle}>Grille de valeurs</div>
        <div style={{ overflow: "auto", flex: 1 }}>
          <table style={{ borderCollapse: "collapse", fontSize: 11, fontFamily: typography.fontFamily.body }}>
            <thead>
              <tr>
                <th />
                {xLabels.map((xl, ci) => (
                  <th key={ci} style={{ padding: 2 }}>
                    <input value={xl} onChange={(e) => setXLabels((prev) => prev.map((v, j) => j === ci ? e.target.value : v))}
                      style={{ ...smallInput, width: 50, textAlign: "center" }} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {yLabels.map((yl, ri) => (
                <tr key={ri}>
                  <td style={{ padding: 2 }}>
                    <input value={yl} onChange={(e) => setYLabels((prev) => prev.map((v, j) => j === ri ? e.target.value : v))}
                      style={{ ...smallInput, width: 60 }} />
                  </td>
                  {(data[ri] || []).map((val, ci) => (
                    <td key={ci} style={{ padding: 2 }}>
                      <input type="number" value={val} onChange={(e) => setData((prev) => prev.map((row, r) => r === ri ? row.map((v, c) => c === ci ? Number(e.target.value) || 0 : v) : row))}
                        style={{ ...smallInput, width: 44, textAlign: "center" }} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{ width: "50%", padding: 20, overflow: "auto", background: colors.bg }}>
        <div style={labelStyle}>Aperçu</div>
        {Renderer && <Renderer block={previewBlock} accentColor={accentColor} />}
      </div>
    </div>
  );
}
