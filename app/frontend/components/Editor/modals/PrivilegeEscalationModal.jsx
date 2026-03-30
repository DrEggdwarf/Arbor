import { useState, useEffect, useCallback } from "react";
import { useEditorStore } from "../../../stores/editorStore";
import { blockRenderers } from "../blocks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { colors, typography } from "../../../styles/tokens";
import { inputStyle, labelStyle, smallInput, tinyBtn, splitLayout, editorSide, previewSide, DEFAULT_COLORS } from "./shared";

export function PrivilegeEscalationEditor({ block }) {
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const accentColor = useEditorStore((s) => s.report?.accent_color) || colors.accentBright;
  const [data, setData] = useState(() => ({ ...block.data }));

  const update = useCallback((patch) => setData((prev) => ({ ...prev, ...patch })), []);
  useEffect(() => { updateBlock(block.id, data); }, [data, block.id, updateBlock]);

  const chain = data.chain || [];

  const addStep = () => update({ chain: [...chain, {
    id: String(Date.now()), level: chain.length,
    privilege: "Nouveau niveau", description: "",
    color: DEFAULT_COLORS[chain.length % DEFAULT_COLORS.length], source: "",
  }]});
  const removeStep = (i) => update({ chain: chain.filter((_, j) => j !== i) });
  const updateStep = (i, key, val) => update({ chain: chain.map((s, j) => j === i ? { ...s, [key]: key === "level" ? Number(val) || 0 : val } : s) });

  const moveStep = (i, dir) => {
    const next = [...chain];
    const target = i + dir;
    if (target < 0 || target >= next.length) return;
    [next[i], next[target]] = [next[target], next[i]];
    update({ chain: next });
  };

  const Renderer = blockRenderers["privilege-escalation"];
  const previewBlock = { ...block, data };

  return (
    <div style={splitLayout}>
      <div style={editorSide}>
        <div>
          <div style={labelStyle}>Titre</div>
          <input value={data.title || ""} onChange={(e) => update({ title: e.target.value })} style={smallInput} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={labelStyle}>Étapes ({chain.length})</div>
          <button onClick={addStep} style={{ ...tinyBtn, width: "auto", padding: "3px 8px", color: colors.accentBright, borderColor: colors.accentBright }}>
            <FontAwesomeIcon icon="plus" style={{ fontSize: 9 }} /> Étape
          </button>
        </div>

        <div style={{ flex: 1, overflow: "auto" }}>
          {chain.map((step, i) => (
            <div key={step.id || i} style={{ marginBottom: 8, padding: "8px", borderRadius: 6, border: `1px solid ${colors.border}`, background: `${step.color || colors.accentBright}06` }}>
              <div style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 4 }}>
                <input type="color" value={step.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]} onChange={(e) => updateStep(i, "color", e.target.value)}
                  style={{ width: 24, height: 24, border: "none", cursor: "pointer", padding: 0, flexShrink: 0 }} />
                <input type="number" min={0} value={step.level ?? i} onChange={(e) => updateStep(i, "level", e.target.value)} style={{ ...smallInput, width: 40, textAlign: "center" }} title="Niveau" />
                <input value={step.privilege || ""} onChange={(e) => updateStep(i, "privilege", e.target.value)} placeholder="Privilège" style={{ ...smallInput, flex: 1, fontWeight: 600 }} />
                <button onClick={() => moveStep(i, -1)} disabled={i === 0} style={{ ...tinyBtn, opacity: i === 0 ? 0.3 : 1 }}><FontAwesomeIcon icon="arrow-up" /></button>
                <button onClick={() => moveStep(i, 1)} disabled={i === chain.length - 1} style={{ ...tinyBtn, opacity: i === chain.length - 1 ? 0.3 : 1 }}><FontAwesomeIcon icon="arrow-down" /></button>
                <button onClick={() => removeStep(i)} style={tinyBtn}>
                  <FontAwesomeIcon icon="times" style={{ fontSize: 9, color: colors.error }} />
                </button>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <input value={step.description || ""} onChange={(e) => updateStep(i, "description", e.target.value)} placeholder="Description" style={{ ...smallInput, flex: 2 }} />
                <input value={step.source || ""} onChange={(e) => updateStep(i, "source", e.target.value)} placeholder="Source/CVE" style={{ ...smallInput, flex: 1 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={previewSide}>
        <div style={labelStyle}>Aperçu</div>
        {Renderer && <Renderer block={previewBlock} accentColor={accentColor} />}
      </div>
    </div>
  );
}
