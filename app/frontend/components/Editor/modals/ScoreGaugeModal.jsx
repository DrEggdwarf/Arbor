import { useState, useEffect } from "react";
import { useEditorStore } from "../../../stores/editorStore";
import { blockRenderers } from "../blocks";
import { colors, typography } from "../../../styles/tokens";
import { inputStyle, labelStyle } from "./shared";

export function ScoreGaugeModalEditor({ block, onClose }) {
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const accentColor = useEditorStore((s) => s.report?.accent_color) || colors.accentBright;
  const [json, setJson] = useState(JSON.stringify(block.data, null, 2));
  const [error, setError] = useState(null);

  const apply = (raw) => {
    try {
      const parsed = JSON.parse(raw);
      setError(null);
      updateBlock(block.id, parsed);
    } catch (e) { setError(e.message); }
  };

  useEffect(() => { apply(json); }, [json]);

  const Renderer = blockRenderers["score-gauge"];

  return (
    <div style={{ display: "flex", height: "60vh" }}>
      <div style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column", gap: 8, borderRight: `1px solid ${colors.border}` }}>
        <div style={labelStyle}>Configuration JSON</div>
        <div style={{ ...labelStyle, fontSize: "9px", opacity: 0.7 }}>
          {"scores: [{ label, value }], max (défaut: 9), title"}
        </div>
        <textarea
          value={json}
          onChange={(e) => { setJson(e.target.value); }}
          spellCheck={false}
          style={{
            ...inputStyle, flex: 1, resize: "none",
            fontFamily: typography.fontFamily.body, fontSize: typography.fontSize.sm,
            lineHeight: 1.6, tabSize: 2,
          }}
        />
        {error && <div style={{ color: colors.error, fontSize: typography.fontSize.xs, fontFamily: typography.fontFamily.body }}>{error}</div>}
      </div>
      <div style={{ width: "50%", padding: 20, overflow: "auto", background: colors.bg }}>
        <div style={labelStyle}>Aperçu</div>
        {Renderer && !error && <Renderer block={block} accentColor={accentColor} />}
      </div>
    </div>
  );
}
