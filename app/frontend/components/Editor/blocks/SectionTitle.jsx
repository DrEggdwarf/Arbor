import { colors, typography } from "../../../styles/tokens";
import { RichText } from "./RichText";

const sizes = { 1: "28px", 2: "22px", 3: "18px", 4: "16px", 5: "14px", 6: "13px" };

export function SectionTitle({ block, accentColor = colors.accentBright }) {
  const { text = "Section", level = 2 } = block.data;
  return (
    <div style={{
      fontFamily: typography.fontFamily.heading,
      fontSize: sizes[level] || sizes[2],
      fontWeight: level <= 2 ? typography.fontWeight.semibold : typography.fontWeight.medium,
      color: colors.text.primary,
      lineHeight: typography.lineHeight.tight,
      padding: "4px 0",
      borderBottom: level <= 2 ? `2px solid ${accentColor}` : "none",
      paddingBottom: level <= 2 ? 8 : 0,
    }}>
      {text ? <RichText html={text} /> : <span style={{ opacity: 0.3 }}>Titre</span>}
    </div>
  );
}
