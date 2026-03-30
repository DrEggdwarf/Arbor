import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { colors, typography, radii } from "../../../styles/tokens";
import { RichText } from "./RichText";

export function DrawerBlock({ block, accentColor, children }) {
  const { title = "Section", open = true } = block.data;
  const [expanded, setExpanded] = useState(open);

  return (
    <div style={{
      border: `1px solid ${colors.border}`,
      borderRadius: radii.lg,
      overflow: "hidden",
    }}>
      {/* Header */}
      <div
        onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 16px",
          background: `${accentColor}0A`,
          borderBottom: expanded ? `1px solid ${colors.border}` : "none",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <FontAwesomeIcon
          icon={expanded ? "chevron-down" : "chevron-right"}
          style={{ color: accentColor, fontSize: 11, width: 12 }}
        />
        <RichText html={title} style={{
          fontFamily: typography.fontFamily.body,
          fontSize: typography.fontSize.md,
          fontWeight: typography.fontWeight.semibold,
          color: colors.text.primary,
          letterSpacing: typography.letterSpacing.wide,
        }} />
      </div>

      {/* Body */}
      {expanded && (
        <div style={{ padding: "12px 16px" }}>
          {children || (
            <div style={{
              padding: "16px 0",
              textAlign: "center",
              fontSize: typography.fontSize.sm,
              color: colors.text.muted,
              letterSpacing: typography.letterSpacing.wide,
            }}>
              Glissez des blocs ici
            </div>
          )}
        </div>
      )}
    </div>
  );
}
