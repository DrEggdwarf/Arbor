import { colors, typography } from "../../../styles/tokens";

export function SpacerBlock({ block, accentColor }) {
  const { height = 24 } = block.data;
  return (
    <div style={{
      height,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: `1px dashed ${colors.border}`,
      borderRadius: 4,
      opacity: 0.5,
    }}>
      <span style={{ fontSize: typography.fontSize.xs, color: colors.text.muted }}>{height}px</span>
    </div>
  );
}
