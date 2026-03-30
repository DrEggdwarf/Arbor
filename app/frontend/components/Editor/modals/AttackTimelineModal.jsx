import { useState, useEffect, useCallback } from "react";
import { useEditorStore } from "../../../stores/editorStore";
import { blockRenderers } from "../blocks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { colors, typography } from "../../../styles/tokens";
import { inputStyle, labelStyle, smallInput, tinyBtn, splitLayout, editorSide, previewSide, DEFAULT_COLORS } from "./shared";

const STATUS_OPTIONS = [
  { value: "success", label: "✓ Succès" }, { value: "partial", label: "◐ Partiel" },
  { value: "blocked", label: "✗ Bloqué" }, { value: "skipped", label: "○ Ignoré" },
];

export function AttackTimelineEditor({ block }) {
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const accentColor = useEditorStore((s) => s.report?.accent_color) || colors.accentBright;
  const [data, setData] = useState(() => ({ ...block.data }));

  const update = useCallback((patch) => setData((prev) => ({ ...prev, ...patch })), []);
  useEffect(() => { updateBlock(block.id, data); }, [data, block.id, updateBlock]);

  const phases = data.phases || [];

  const addPhase = () => update({ phases: [...phases, {
    id: `phase-${Date.now()}`, label: "Nouvelle phase",
    color: DEFAULT_COLORS[phases.length % DEFAULT_COLORS.length],
    timestamp: "", techniques: [],
  }]});
  const removePhase = (i) => update({ phases: phases.filter((_, j) => j !== i) });
  const updatePhase = (i, key, val) => update({ phases: phases.map((p, j) => j === i ? { ...p, [key]: val } : p) });

  const addTech = (pi) => {
    const p = { ...phases[pi], techniques: [...(phases[pi].techniques || []), { id: "", name: "Nouvelle technique", status: "success" }] };
    update({ phases: phases.map((ph, j) => j === pi ? p : ph) });
  };
  const removeTech = (pi, ti) => {
    const p = { ...phases[pi], techniques: phases[pi].techniques.filter((_, j) => j !== ti) };
    update({ phases: phases.map((ph, j) => j === pi ? p : ph) });
  };
  const updateTech = (pi, ti, key, val) => {
    const techs = phases[pi].techniques.map((t, j) => j === ti ? { ...t, [key]: val } : t);
    update({ phases: phases.map((ph, j) => j === pi ? { ...ph, techniques: techs } : ph) });
  };

  const movePhase = (i, dir) => {
    const next = [...phases];
    const target = i + dir;
    if (target < 0 || target >= next.length) return;
    [next[i], next[target]] = [next[target], next[i]];
    update({ phases: next });
  };

  const Renderer = blockRenderers["attack-timeline"];
  const previewBlock = { ...block, data };

  return (
    <div style={splitLayout}>
      <div style={editorSide}>
        <div>
          <div style={labelStyle}>Titre</div>
          <input value={data.title || ""} onChange={(e) => update({ title: e.target.value })} style={smallInput} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={labelStyle}>Phases ({phases.length})</div>
          <button onClick={addPhase} style={{ ...tinyBtn, width: "auto", padding: "3px 8px", color: colors.accentBright, borderColor: colors.accentBright }}>
            <FontAwesomeIcon icon="plus" style={{ fontSize: 9 }} /> Phase
          </button>
        </div>

        <div style={{ flex: 1, overflow: "auto" }}>
          {phases.map((phase, pi) => (
            <div key={phase.id || pi} style={{ marginBottom: 12, padding: "8px", borderRadius: 6, border: `1px solid ${colors.border}`, background: `${phase.color || colors.accentBright}06` }}>
              <div style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 6 }}>
                <input type="color" value={phase.color || colors.accentBright} onChange={(e) => updatePhase(pi, "color", e.target.value)} style={{ width: 24, height: 24, border: "none", cursor: "pointer", padding: 0, flexShrink: 0 }} />
                <input value={phase.label || ""} onChange={(e) => updatePhase(pi, "label", e.target.value)} placeholder="Phase" style={{ ...smallInput, flex: 2, fontWeight: 600 }} />
                <input value={phase.timestamp || ""} onChange={(e) => updatePhase(pi, "timestamp", e.target.value)} placeholder="Timestamp" style={{ ...smallInput, flex: 1 }} />
                <button onClick={() => movePhase(pi, -1)} disabled={pi === 0} style={{ ...tinyBtn, opacity: pi === 0 ? 0.3 : 1 }}><FontAwesomeIcon icon="arrow-up" /></button>
                <button onClick={() => movePhase(pi, 1)} disabled={pi === phases.length - 1} style={{ ...tinyBtn, opacity: pi === phases.length - 1 ? 0.3 : 1 }}><FontAwesomeIcon icon="arrow-down" /></button>
                <button onClick={() => removePhase(pi)} style={tinyBtn}><FontAwesomeIcon icon="times" style={{ color: colors.error }} /></button>
              </div>

              {/* Techniques */}
              <div style={{ marginLeft: 8 }}>
                {(phase.techniques || []).map((tech, ti) => (
                  <div key={ti} style={{ display: "flex", gap: 4, marginTop: 3, alignItems: "center" }}>
                    <input value={tech.id || ""} onChange={(e) => updateTech(pi, ti, "id", e.target.value)} placeholder="T1234" style={{ ...smallInput, width: 60 }} />
                    <input value={tech.name || ""} onChange={(e) => updateTech(pi, ti, "name", e.target.value)} placeholder="Technique" style={{ ...smallInput, flex: 1 }} />
                    <select value={tech.status || "success"} onChange={(e) => updateTech(pi, ti, "status", e.target.value)} style={{ ...smallInput, width: 90, cursor: "pointer" }}>
                      {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <button onClick={() => removeTech(pi, ti)} style={tinyBtn}><FontAwesomeIcon icon="minus" style={{ fontSize: 8 }} /></button>
                  </div>
                ))}
                <button onClick={() => addTech(pi)} style={{ ...tinyBtn, width: "auto", padding: "2px 8px", marginTop: 4, fontSize: 9, color: colors.text.muted }}>
                  <FontAwesomeIcon icon="plus" style={{ fontSize: 8 }} /> Technique
                </button>
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
