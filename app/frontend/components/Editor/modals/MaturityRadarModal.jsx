import { useState, useEffect, useCallback } from "react";
import { useEditorStore } from "../../../stores/editorStore";
import { blockRenderers } from "../blocks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { colors, typography } from "../../../styles/tokens";
import { inputStyle, labelStyle, smallInput, tinyBtn, rowStyle, btnStyle, splitLayout, editorSide, previewSide } from "./shared";

const uid = () => crypto.randomUUID?.() || Date.now().toString(36);

export function MaturityRadarEditor({ block }) {
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const accentColor = useEditorStore((s) => s.report?.accent_color) || colors.accentBright;
  const [data, setData] = useState(() => ({ ...block.data }));

  const update = useCallback((patch) => {
    setData((prev) => ({ ...prev, ...patch }));
  }, []);

  useEffect(() => { updateBlock(block.id, data); }, [data, block.id, updateBlock]);

  const axes = data.axes || [];

  const addAxis = () => {
    update({
      axes: [...axes, { label: "", current: 2, target: 4, max: 5 }],
    });
  };

  const removeAxis = (i) => {
    update({ axes: axes.filter((_, j) => j !== i) });
  };

  const updateAxis = (i, key, val) => {
    update({ axes: axes.map((a, j) => j === i ? { ...a, [key]: val } : a) });
  };

  const Renderer = blockRenderers["maturity-radar"];
  const previewBlock = { ...block, data };

  return (
    <div style={splitLayout}>
      <div style={editorSide}>
        {/* Title */}
        <div>
          <div style={labelStyle}>Titre</div>
          <input value={data.title || ""} onChange={(e) => update({ title: e.target.value })} style={smallInput} />
        </div>

        {/* Colors */}
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Couleur actuel</div>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <div style={{ width: 20, height: 20, borderRadius: 4, background: data.currentColor || accentColor, border: `1px solid ${colors.border}`, flexShrink: 0 }} />
              <input
                value={data.currentColor || ""}
                onChange={(e) => update({ currentColor: e.target.value })}
                placeholder={accentColor}
                style={smallInput}
              />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Couleur cible</div>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <div style={{ width: 20, height: 20, borderRadius: 4, background: data.targetColor || "#5B8FD4", border: `1px solid ${colors.border}`, flexShrink: 0 }} />
              <input
                value={data.targetColor || ""}
                onChange={(e) => update({ targetColor: e.target.value })}
                placeholder="#5B8FD4"
                style={smallInput}
              />
            </div>
          </div>
        </div>

        {/* Axes header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={labelStyle}>Axes ({axes.length})</div>
          <button onClick={addAxis} style={{ ...tinyBtn, width: "auto", padding: "3px 8px", color: colors.accentBright, borderColor: colors.accentBright }}>
            <FontAwesomeIcon icon="plus" style={{ fontSize: 9 }} /> Axe
          </button>
        </div>

        {/* Axes list */}
        <div style={{ flex: 1, overflow: "auto" }}>
          {axes.map((ax, i) => (
            <div key={i} style={{ ...rowStyle, gap: 4 }}>
              <input
                value={ax.label || ""}
                onChange={(e) => updateAxis(i, "label", e.target.value)}
                placeholder="Nom de l'axe"
                style={{ ...smallInput, flex: 1 }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "center" }}>
                <span style={{ ...labelStyle, fontSize: 9, marginBottom: 0 }}>Actuel</span>
                <input
                  type="number" min={0} max={5} step={1}
                  value={ax.current ?? 2}
                  onChange={(e) => updateAxis(i, "current", Math.min(5, Math.max(0, +e.target.value || 0)))}
                  style={{ ...smallInput, width: 48, textAlign: "center" }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "center" }}>
                <span style={{ ...labelStyle, fontSize: 9, marginBottom: 0 }}>Cible</span>
                <input
                  type="number" min={0} max={5} step={1}
                  value={ax.target ?? 4}
                  onChange={(e) => updateAxis(i, "target", Math.min(5, Math.max(0, +e.target.value || 0)))}
                  style={{ ...smallInput, width: 48, textAlign: "center" }}
                />
              </div>
              <button onClick={() => removeAxis(i)} style={{ ...tinyBtn, color: colors.error, borderColor: colors.error, alignSelf: "center" }}>
                <FontAwesomeIcon icon="times" style={{ fontSize: 9 }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div style={previewSide}>
        <Renderer block={previewBlock} accentColor={accentColor} />
      </div>
    </div>
  );
}
