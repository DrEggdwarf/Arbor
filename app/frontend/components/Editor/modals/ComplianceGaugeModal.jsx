import { useState, useEffect, useCallback } from "react";
import { useEditorStore } from "../../../stores/editorStore";
import { blockRenderers } from "../blocks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { colors, typography } from "../../../styles/tokens";
import { inputStyle, labelStyle, smallInput, tinyBtn, rowStyle, btnStyle, splitLayout, editorSide, previewSide } from "./shared";

const TREND_OPTIONS = [
  { value: "improving", label: "↑ En amélioration" },
  { value: "stable", label: "→ Stable" },
  { value: "declining", label: "↓ En baisse" },
];

const uid = () => crypto.randomUUID?.() || Date.now().toString(36);

export function ComplianceGaugeEditor({ block }) {
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
      domains: [...domains, { id: uid(), name: "", compliance: 0, controlsTotal: 0, controlsCompliant: 0 }],
    });
  };

  const removeDomain = (i) => {
    update({ domains: domains.filter((_, j) => j !== i) });
  };

  const updateDomain = (i, key, val) => {
    update({ domains: domains.map((d, j) => j === i ? { ...d, [key]: val } : d) });
  };

  const Renderer = blockRenderers["compliance-gauge"];
  const previewBlock = { ...block, data };

  return (
    <div style={splitLayout}>
      <div style={editorSide}>
        {/* Title */}
        <div>
          <div style={labelStyle}>Titre</div>
          <input value={data.title || ""} onChange={(e) => update({ title: e.target.value })} style={smallInput} />
        </div>

        {/* Overall compliance */}
        <div>
          <div style={labelStyle}>Conformité globale ({data.overallCompliance ?? 0}%)</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="range" min={0} max={100} step={1}
              value={data.overallCompliance ?? 0}
              onChange={(e) => update({ overallCompliance: +e.target.value })}
              style={{ flex: 1 }}
            />
            <input
              type="number" min={0} max={100}
              value={data.overallCompliance ?? 0}
              onChange={(e) => update({ overallCompliance: Math.min(100, Math.max(0, +e.target.value || 0)) })}
              style={{ ...smallInput, width: 56, textAlign: "center" }}
            />
          </div>
        </div>

        {/* Audit dates */}
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Dernier audit</div>
            <input type="date" value={data.lastAudit || ""} onChange={(e) => update({ lastAudit: e.target.value })} style={smallInput} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Prochain audit</div>
            <input type="date" value={data.nextAudit || ""} onChange={(e) => update({ nextAudit: e.target.value })} style={smallInput} />
          </div>
        </div>

        {/* Trend */}
        <div>
          <div style={labelStyle}>Tendance</div>
          <select value={data.trend || "stable"} onChange={(e) => update({ trend: e.target.value })} style={{ ...smallInput, cursor: "pointer" }}>
            {TREND_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Domains */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={labelStyle}>Domaines ({domains.length})</div>
          <button onClick={addDomain} style={{ ...tinyBtn, width: "auto", padding: "3px 8px", color: colors.accentBright, borderColor: colors.accentBright }}>
            <FontAwesomeIcon icon="plus" style={{ fontSize: 9 }} /> Domaine
          </button>
        </div>

        <div style={{ flex: 1, overflow: "auto" }}>
          {domains.map((dom, i) => (
            <div key={dom.id || i} style={{ marginBottom: 6, padding: "8px", border: `1px solid ${colors.border}`, borderRadius: 6, display: "flex", flexDirection: "column", gap: 6 }}>
              {/* Name + remove */}
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <input
                  value={dom.name || ""}
                  onChange={(e) => updateDomain(i, "name", e.target.value)}
                  placeholder="Nom du domaine"
                  style={{ ...smallInput, flex: 1, fontWeight: 600 }}
                />
                <button onClick={() => removeDomain(i)} style={{ ...tinyBtn, color: colors.error, borderColor: colors.error }}>
                  <FontAwesomeIcon icon="times" style={{ fontSize: 9 }} />
                </button>
              </div>

              {/* Compliance + Controls */}
              <div style={{ display: "flex", gap: 6 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ ...labelStyle, fontSize: 9 }}>Conformité (%)</div>
                  <input
                    type="number" min={0} max={100}
                    value={dom.compliance ?? 0}
                    onChange={(e) => updateDomain(i, "compliance", Math.min(100, Math.max(0, +e.target.value || 0)))}
                    style={{ ...smallInput, textAlign: "center" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ ...labelStyle, fontSize: 9 }}>Contrôles total</div>
                  <input
                    type="number" min={0}
                    value={dom.controlsTotal ?? 0}
                    onChange={(e) => updateDomain(i, "controlsTotal", Math.max(0, +e.target.value || 0))}
                    style={{ ...smallInput, textAlign: "center" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ ...labelStyle, fontSize: 9 }}>Conformes</div>
                  <input
                    type="number" min={0}
                    value={dom.controlsCompliant ?? 0}
                    onChange={(e) => updateDomain(i, "controlsCompliant", Math.max(0, +e.target.value || 0))}
                    style={{ ...smallInput, textAlign: "center" }}
                  />
                </div>
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
