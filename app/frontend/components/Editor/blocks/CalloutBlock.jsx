import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { colors, typography, radii } from "../../../styles/tokens";

const variants = {
  info:    { bg: "rgba(91,143,212,0.08)",  border: colors.info,    icon: "info-circle",           color: colors.info },
  warning: { bg: "rgba(233,196,106,0.08)", border: colors.warning, icon: "exclamation-triangle",  color: "#c77c05" },
  danger:  { bg: "rgba(229,115,115,0.08)", border: colors.error,   icon: "exclamation-circle",    color: colors.error },
  success: { bg: "rgba(92,184,92,0.08)",   border: colors.success, icon: "check-circle",          color: colors.success },
};

export function CalloutBlock({ block, accentColor }) {
  const { variant = "info", content = "" } = block.data;
  const v = variants[variant] || variants.info;

  return (
    <div style={{
      borderLeft: `3px solid ${v.border}`,
      background: v.bg,
      padding: "14px 18px",
      borderRadius: "2px 10px 10px 2px",
      fontFamily: typography.fontFamily.body,
      fontSize: typography.fontSize.md,
      color: colors.text.primary,
      display: "flex",
      gap: 10,
      alignItems: "flex-start",
    }}>
      <FontAwesomeIcon icon={v.icon} style={{ color: v.color, marginTop: 2, flexShrink: 0 }} />
      <span
        style={{ whiteSpace: "pre-wrap", lineHeight: typography.lineHeight.relaxed }}
        dangerouslySetInnerHTML={{ __html: content || "" }}
      />
      {!content && <span style={{ opacity: 0.3 }}>{"Contenu de l'encart..."}</span>}
    </div>
  );
}
