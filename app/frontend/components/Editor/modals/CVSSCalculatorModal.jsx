import { useState, useEffect, useCallback } from "react";
import { useEditorStore } from "../../../stores/editorStore";
import { blockRenderers } from "../blocks";
import { colors, typography } from "../../../styles/tokens";
import { labelStyle, smallInput, splitLayout, editorSide, previewSide } from "./shared";

const METRIC_DEFS = [
  { key: "AV", label: "Attack Vector", options: [
    { value: "N", label: "Network" }, { value: "A", label: "Adjacent" },
    { value: "L", label: "Local" }, { value: "P", label: "Physical" },
  ]},
  { key: "AC", label: "Attack Complexity", options: [
    { value: "L", label: "Low" }, { value: "H", label: "High" },
  ]},
  { key: "PR", label: "Privileges Required", options: [
    { value: "N", label: "None" }, { value: "L", label: "Low" }, { value: "H", label: "High" },
  ]},
  { key: "UI", label: "User Interaction", options: [
    { value: "N", label: "None" }, { value: "R", label: "Required" },
  ]},
  { key: "S", label: "Scope", options: [
    { value: "U", label: "Unchanged" }, { value: "C", label: "Changed" },
  ]},
  { key: "C", label: "Confidentiality", options: [
    { value: "N", label: "None" }, { value: "L", label: "Low" }, { value: "H", label: "High" },
  ]},
  { key: "I", label: "Integrity", options: [
    { value: "N", label: "None" }, { value: "L", label: "Low" }, { value: "H", label: "High" },
  ]},
  { key: "A", label: "Availability", options: [
    { value: "N", label: "None" }, { value: "L", label: "Low" }, { value: "H", label: "High" },
  ]},
];

export function CVSSCalculatorEditor({ block }) {
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const accentColor = useEditorStore((s) => s.report?.accent_color) || colors.accentBright;
  const [data, setData] = useState(() => ({ ...block.data }));

  const update = useCallback((patch) => setData((prev) => ({ ...prev, ...patch })), []);
  useEffect(() => { updateBlock(block.id, data); }, [data, block.id, updateBlock]);

  const Renderer = blockRenderers["cvss-calculator"];
  const previewBlock = { ...block, data };

  return (
    <div style={splitLayout}>
      <div style={editorSide}>
        <div>
          <div style={labelStyle}>Titre</div>
          <input value={data.title || ""} onChange={(e) => update({ title: e.target.value })} style={smallInput} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8 }}>
          {METRIC_DEFS.map((m) => (
            <div key={m.key}>
              <div style={{
                fontSize: 10, fontWeight: 600, color: colors.text.muted,
                marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em",
              }}>{m.label}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {m.options.map((opt) => {
                  const selected = data[m.key] === opt.value;
                  return (
                    <button key={opt.value} onClick={() => update({ [m.key]: opt.value })} style={{
                      fontSize: 11, padding: "5px 10px", borderRadius: 6,
                      cursor: "pointer", border: `1.5px solid ${selected ? colors.accentBright : colors.border}`,
                      background: selected ? `${colors.accentBright}18` : colors.bg,
                      color: selected ? colors.accentBright : colors.text.secondary,
                      fontWeight: selected ? 700 : 400,
                      fontFamily: typography.fontFamily.body,
                      transition: "all 0.15s",
                    }}>
                      {opt.label}
                    </button>
                  );
                })}
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
