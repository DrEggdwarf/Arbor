import { colors } from "../../../styles/tokens";

export function SeparatorBlock({ block, accentColor = colors.accentBright }) {
  const { style = "line" } = block.data;

  if (style === "space") return <div style={{ height: 24 }} />;

  if (style === "dots") {
    return (
      <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "12px 0" }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: accentColor, opacity: 0.5 }} />
        ))}
      </div>
    );
  }

  return <hr style={{ border: "none", borderTop: `1px solid ${accentColor}40`, margin: "12px 0" }} />;
}
