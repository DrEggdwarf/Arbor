import { useState, useEffect } from "react";
import { useEditorStore } from "../../stores/editorStore";
import { useTranslation } from "../../lib/useTranslation";
import { colors, typography, spacing, layout, radii } from "../../styles/tokens";

export function Topbar() {
  const { report, updateMeta, isDirty } = useEditorStore();
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(report?.title || "");

  useEffect(() => { setTitle(report?.title || ""); }, [report?.id]);

  const saveTitle = () => {
    updateMeta("title", title);
    setEditing(false);
  };

  return (
    <div style={{
      height: layout.topbarHeight,
      background: colors.drawer.bg,
      borderBottom: `1px solid ${colors.drawer.border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 16px",
      flexShrink: 0,
    }}>
      {/* Left: Logo + Title */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{
          fontFamily: typography.fontFamily.heading,
          fontSize: typography.fontSize["2xl"],
          fontWeight: typography.fontWeight.light,
          color: colors.text.onDark,
          letterSpacing: "-0.02em",
        }}>
          Arbor
        </span>

        {editing ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => e.key === "Enter" && saveTitle()}
            autoFocus
            style={{
              fontFamily: typography.fontFamily.body,
              fontSize: typography.fontSize.md,
              color: colors.text.mutedOnDark,
              background: "transparent",
              border: "none",
              outline: "none",
              padding: "4px 8px",
              borderRadius: radii.md,
            }}
          />
        ) : (
          <span
            onClick={() => setEditing(true)}
            style={{
              fontFamily: typography.fontFamily.body,
              fontSize: typography.fontSize.md,
              color: colors.text.mutedOnDark,
              padding: "4px 8px",
              borderRadius: radii.md,
              cursor: "text",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            {report?.title}
          </span>
        )}
      </div>

      {/* Right: Status + Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: typography.fontSize.base, color: colors.text.mutedOnDark }}>
          <div style={{
            width: 6, height: 6, borderRadius: "50%",
            background: isDirty ? colors.warning : colors.success,
          }} />
          {isDirty ? t("editor.saving") : t("editor.saved")}
        </div>

        <button style={btnGhost}>{t("editor.import_json")}</button>
        <button style={btnPrimary}>{t("editor.export")}</button>
      </div>
    </div>
  );
}

const btnBase = {
  fontFamily: typography.fontFamily.body,
  fontSize: typography.fontSize.base,
  fontWeight: typography.fontWeight.medium,
  letterSpacing: "0.04em",
  padding: "6px 12px",
  borderRadius: radii.md,
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 6,
  transition: "all 0.15s",
};

const btnGhost = {
  ...btnBase,
  background: "transparent",
  color: colors.text.mutedOnDark,
  border: `1px solid ${colors.drawer.border}`,
};

const btnPrimary = {
  ...btnBase,
  background: colors.accentBright,
  color: colors.text.primary,
};
