import { useState, useEffect, useCallback } from "react";
import { useEditorStore } from "../../../stores/editorStore";
import { blockRenderers } from "../blocks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { colors, typography } from "../../../styles/tokens";
import { inputStyle, labelStyle, smallInput, tinyBtn, splitLayout, editorSide, previewSide } from "./shared";

const PRIO_OPTIONS = [
  { value: "critical", label: "Critique" }, { value: "high", label: "Élevé" },
  { value: "medium", label: "Moyen" }, { value: "low", label: "Faible" },
];

export function RecommendationEditor({ block }) {
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const accentColor = useEditorStore((s) => s.report?.accent_color) || colors.accentBright;
  const [data, setData] = useState(() => ({ ...block.data }));

  const update = useCallback((patch) => setData((prev) => ({ ...prev, ...patch })), []);
  useEffect(() => { updateBlock(block.id, data); }, [data, block.id, updateBlock]);

  const tools = data.tools || [];

  const Renderer = blockRenderers["recommendation"];
  const previewBlock = { ...block, data };

  return (
    <div style={splitLayout}>
      <div style={editorSide}>
        <div>
          <div style={labelStyle}>Titre</div>
          <input value={data.title || ""} onChange={(e) => update({ title: e.target.value })} style={smallInput} />
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Priorité</div>
            <select value={data.priority || "medium"} onChange={(e) => update({ priority: e.target.value })} style={{ ...smallInput, cursor: "pointer" }}>
              {PRIO_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Effort (1-5)</div>
            <input type="number" min={1} max={5} value={data.effort || 3} onChange={(e) => update({ effort: Number(e.target.value) })} style={smallInput} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Impact (1-5)</div>
            <input type="number" min={1} max={5} value={data.impact || 3} onChange={(e) => update({ impact: Number(e.target.value) })} style={smallInput} />
          </div>
        </div>

        <div>
          <div style={labelStyle}>Description</div>
          <textarea value={data.description || ""} onChange={(e) => update({ description: e.target.value })} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
        </div>

        <div>
          <div style={labelStyle}>Valeur métier</div>
          <textarea value={data.businessValue || ""} onChange={(e) => update({ businessValue: e.target.value })} rows={2} style={{ ...inputStyle, resize: "vertical" }} />
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Timeline</div>
            <input value={data.timeline || ""} onChange={(e) => update({ timeline: e.target.value })} placeholder="Q2 2024" style={smallInput} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Responsable</div>
            <input value={data.owner || ""} onChange={(e) => update({ owner: e.target.value })} placeholder="Équipe Sécurité" style={smallInput} />
          </div>
        </div>

        {/* Tools */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={labelStyle}>Outils ({tools.length})</div>
            <button onClick={() => update({ tools: [...tools, { name: "", type: "open-source", cost: "free" }] })} style={{ ...tinyBtn, width: "auto", padding: "3px 8px", color: colors.accentBright, borderColor: colors.accentBright }}>
              <FontAwesomeIcon icon="plus" style={{ fontSize: 9 }} />
            </button>
          </div>
          {tools.map((tool, i) => (
            <div key={i} style={{ display: "flex", gap: 4, marginTop: 4 }}>
              <input value={tool.name || ""} onChange={(e) => { const t = [...tools]; t[i] = { ...t[i], name: e.target.value }; update({ tools: t }); }} placeholder="Nom" style={{ ...smallInput, flex: 2 }} />
              <select value={tool.cost || "free"} onChange={(e) => { const t = [...tools]; t[i] = { ...t[i], cost: e.target.value }; update({ tools: t }); }} style={{ ...smallInput, flex: 1, cursor: "pointer" }}>
                <option value="free">Gratuit</option>
                <option value="paid">Payant</option>
              </select>
              <button onClick={() => update({ tools: tools.filter((_, j) => j !== i) })} style={tinyBtn}>
                <FontAwesomeIcon icon="times" style={{ fontSize: 9, color: colors.error }} />
              </button>
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
