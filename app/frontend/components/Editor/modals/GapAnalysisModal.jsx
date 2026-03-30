import { useState, useEffect, useCallback } from "react";
import { useEditorStore } from "../../../stores/editorStore";
import { blockRenderers } from "../blocks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { colors, typography } from "../../../styles/tokens";
import { inputStyle, labelStyle, smallInput, tinyBtn, rowStyle, btnStyle, splitLayout, editorSide, previewSide } from "./shared";

const FRAMEWORK_OPTIONS = [
  { value: "", label: "Aucun" },
  { value: "iso-27001", label: "ISO 27001" },
  { value: "nist-csf", label: "NIST CSF" },
  { value: "nis2", label: "NIS2" },
];

const PRIORITY_OPTIONS = ["critical", "high", "medium", "low"];
const PRIORITY_LABELS = { critical: "Critique", high: "Élevé", medium: "Moyen", low: "Faible" };

const uid = () => crypto.randomUUID?.() || Date.now().toString(36);

export function GapAnalysisEditor({ block }) {
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const accentColor = useEditorStore((s) => s.report?.accent_color) || colors.accentBright;
  const [data, setData] = useState(() => ({ ...block.data }));

  const update = useCallback((patch) => {
    setData((prev) => ({ ...prev, ...patch }));
  }, []);

  useEffect(() => { updateBlock(block.id, data); }, [data, block.id, updateBlock]);

  const domains = data.domains || [];

  const addDomain = () => {
    update({
      domains: [...domains, {
        id: uid(),
        name: "",
        currentLevel: 1,
        targetLevel: 3,
        gap: 2,
        priority: "medium",
        owner: "",
      }],
    });
  };

  const removeDomain = (i) => {
    update({ domains: domains.filter((_, j) => j !== i) });
  };

  const updateDomain = (i, key, val) => {
    update({
      domains: domains.map((d, j) => {
        if (j !== i) return d;
        const updated = { ...d, [key]: val };
        if (key === "currentLevel" || key === "targetLevel") {
          updated.gap = (updated.targetLevel || 0) - (updated.currentLevel || 0);
        }
        return updated;
      }),
    });
  };

  const Renderer = blockRenderers["gap-analysis"];
  const previewBlock = { ...block, data };

  return (
    <div style={splitLayout}>
      <div style={editorSide}>
        {/* Title */}
        <div>
          <div style={labelStyle}>Titre</div>
          <input value={data.title || ""} onChange={(e) => update({ title: e.target.value })} style={smallInput} />
        </div>

        {/* Framework */}
        <div>
          <div style={labelStyle}>Référentiel</div>
          <select value={data.framework || ""} onChange={(e) => update({ framework: e.target.value })} style={{ ...smallInput, cursor: "pointer" }}>
            {FRAMEWORK_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Domains header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={labelStyle}>Domaines ({domains.length})</div>
          <button onClick={addDomain} style={{ ...tinyBtn, width: "auto", padding: "3px 8px", color: colors.accentBright, borderColor: colors.accentBright }}>
            <FontAwesomeIcon icon="plus" style={{ fontSize: 9 }} /> Domaine
          </button>
        </div>

        {/* Domains list */}
        <div style={{ flex: 1, overflow: "auto" }}>
          {domains.map((dom, i) => (
            <div key={dom.id || i} style={{ ...rowStyle, flexWrap: "wrap", gap: 4, padding: "6px 0" }}>
              {/* Row 1: name + remove */}
              <div style={{ display: "flex", gap: 4, width: "100%", alignItems: "center" }}>
                <input
                  value={dom.name || ""}
                  onChange={(e) => updateDomain(i, "name", e.target.value)}
                  placeholder="Nom du domaine"
                  style={{ ...smallInput, flex: 1 }}
                />
                <button onClick={() => removeDomain(i)} style={{ ...tinyBtn, color: colors.error, borderColor: colors.error }}>
                  <FontAwesomeIcon icon="times" style={{ fontSize: 9 }} />
                </button>
              </div>
              {/* Row 2: levels + priority + owner */}
              <div style={{ display: "flex", gap: 4, width: "100%", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <span style={{ ...labelStyle, fontSize: 9, marginBottom: 0 }}>Actuel</span>
                  <input
                    type="number" min={1} max={5}
                    value={dom.currentLevel ?? 1}
                    onChange={(e) => updateDomain(i, "currentLevel", Math.min(5, Math.max(1, +e.target.value || 1)))}
                    style={{ ...smallInput, width: 48, textAlign: "center" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <span style={{ ...labelStyle, fontSize: 9, marginBottom: 0 }}>Cible</span>
                  <input
                    type="number" min={1} max={5}
                    value={dom.targetLevel ?? 3}
                    onChange={(e) => updateDomain(i, "targetLevel", Math.min(5, Math.max(1, +e.target.value || 1)))}
                    style={{ ...smallInput, width: 48, textAlign: "center" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <span style={{ ...labelStyle, fontSize: 9, marginBottom: 0 }}>Écart</span>
                  <div style={{ ...smallInput, width: 40, textAlign: "center", background: colors.surface, color: colors.text.muted }}>
                    {(dom.targetLevel || 0) - (dom.currentLevel || 0)}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
                  <span style={{ ...labelStyle, fontSize: 9, marginBottom: 0 }}>Priorité</span>
                  <select
                    value={dom.priority || "medium"}
                    onChange={(e) => updateDomain(i, "priority", e.target.value)}
                    style={{ ...smallInput, cursor: "pointer" }}
                  >
                    {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>)}
                  </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
                  <span style={{ ...labelStyle, fontSize: 9, marginBottom: 0 }}>Responsable</span>
                  <input
                    value={dom.owner || ""}
                    onChange={(e) => updateDomain(i, "owner", e.target.value)}
                    placeholder="Resp."
                    style={smallInput}
                  />
                </div>
              </div>
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
