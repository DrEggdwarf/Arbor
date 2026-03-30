/**
 * Shared styles and constants for all modal editors.
 */
import { colors, typography, radii } from "../../../styles/tokens";

export const DEFAULT_COLORS = [
  "#E8A855", "#5B8FD4", "#2ecc71", "#e74c3c",
  "#9b59b6", "#1abc9c", "#e67e22", "#34495e",
];

export const inputStyle = {
  fontFamily: typography.fontFamily.body,
  fontSize: typography.fontSize.md,
  color: colors.text.primary,
  background: colors.bg,
  border: `1px solid ${colors.border}`,
  borderRadius: radii.md,
  padding: "8px 10px",
  outline: "none",
  width: "100%",
};

export const smallInput = {
  ...inputStyle,
  padding: "6px 10px",
  fontSize: typography.fontSize.sm,
  minHeight: 32,
};

export const labelStyle = {
  fontFamily: typography.fontFamily.body,
  fontSize: typography.fontSize.sm,
  color: colors.text.muted,
  letterSpacing: "0.04em",
  marginBottom: 4,
};

export const btnStyle = {
  fontFamily: typography.fontFamily.body,
  fontSize: typography.fontSize.sm,
  padding: "6px 14px",
  borderRadius: radii.md,
  cursor: "pointer",
  border: "none",
  transition: "all 0.15s",
  fontWeight: 500,
};

export const tinyBtn = {
  width: 24, height: 24, borderRadius: 6,
  border: `1px solid ${colors.border}`,
  background: colors.bg, cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 10, color: colors.text.muted, flexShrink: 0,
};

export const rowStyle = {
  display: "flex", alignItems: "center", gap: 6,
  padding: "5px 0",
  borderBottom: `1px solid ${colors.border}`,
};

export const splitLayout = {
  display: "flex", height: "65vh",
};

export const editorSide = {
  flex: 1, padding: 16,
  display: "flex", flexDirection: "column", gap: 10,
  borderRight: `1px solid ${colors.border}`,
  overflow: "auto",
};

export const previewSide = {
  width: "50%", padding: 20,
  overflow: "auto", background: colors.bg,
};
