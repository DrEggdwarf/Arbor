import { colors, typography, radii } from "../../../styles/tokens";

export function HorizontalDivBlock({ block, accentColor, children }) {
  const childCount = block.children?.length || 0;

  if (!children || childCount === 0) {
    return (
      <div style={{
        padding: "20px 0",
        textAlign: "center",
        fontSize: typography.fontSize.sm,
        color: colors.text.muted,
        letterSpacing: typography.letterSpacing.wide,
        border: `1.5px dashed ${colors.border}`,
        borderRadius: radii.lg,
      }}>
        Glissez des blocs ici pour créer des colonnes
      </div>
    );
  }

  return (
    <div style={{
      display: "flex",
      gap: 0,
      alignItems: "stretch",
    }}>
      {children}
    </div>
  );
}
