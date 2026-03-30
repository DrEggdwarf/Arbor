import { useState, useEffect } from "react";
import { useEditorStore } from "../../../stores/editorStore";
import { blockRenderers } from "../blocks";
import { colors, typography, radii } from "../../../styles/tokens";
import { inputStyle, labelStyle } from "./shared";

export function CodeModalEditor({ block, onClose }) {
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const accentColor = useEditorStore((s) => s.report?.accent_color) || colors.accentBright;
  const [code, setCode] = useState(block.data?.code || "");
  const [language, setLanguage] = useState(block.data?.language || "bash");

  useEffect(() => { updateBlock(block.id, { code, language }); }, [code, language]);

  const languages = [
    { value: "bash", label: "Bash" }, { value: "powershell", label: "PowerShell" },
    { value: "python", label: "Python" }, { value: "javascript", label: "JavaScript" },
    { value: "json", label: "JSON" }, { value: "yaml", label: "YAML" },
    { value: "sql", label: "SQL" }, { value: "text", label: "Texte brut" },
  ];

  const Renderer = blockRenderers["code"];

  return (
    <div style={{ display: "flex", height: "65vh" }}>
      <div style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column", gap: 10, borderRight: `1px solid ${colors.border}` }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={labelStyle}>Langage</div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{ ...inputStyle, width: "auto", cursor: "pointer" }}
          >
            {languages.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="// Votre code ici..."
          spellCheck={false}
          style={{
            ...inputStyle, flex: 1, resize: "none",
            fontFamily: typography.fontFamily.body,
            fontSize: typography.fontSize.md,
            lineHeight: 1.7, tabSize: 2,
            background: "#0d1117", color: "#e6edf3",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: radii.lg,
          }}
        />
      </div>

      <div style={{ width: "50%", padding: 20, overflow: "auto", background: colors.bg }}>
        <div style={labelStyle}>Aperçu</div>
        {Renderer && <Renderer block={{ ...block, data: { code, language } }} accentColor={accentColor} />}
      </div>
    </div>
  );
}
