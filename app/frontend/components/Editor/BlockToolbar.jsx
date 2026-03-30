import { useEditorStore } from "../../stores/editorStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { colors, radii } from "../../styles/tokens";

export function BlockToolbar({ blockId, index }) {
  const { moveBlock, duplicateBlock, deleteBlock, report } = useEditorStore();
  const total = report?.content?.blocks?.length || 0;

  const btn = {
    width: 28,
    height: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.md,
    cursor: "pointer",
    color: colors.text.muted,
    fontSize: 12,
    transition: "all 0.15s",
    padding: 0,
  };

  return (
    <div style={{
      position: "absolute",
      right: 0,
      top: 0,
      display: "flex",
      flexDirection: "column",
      gap: 4,
      width: 36,
      alignItems: "center",
    }}>
      {index > 0 && (
        <button
          style={btn}
          onClick={(e) => { e.stopPropagation(); moveBlock(index, index - 1); }}
          onMouseEnter={(e) => { e.currentTarget.style.background = colors.drawer.bg; e.currentTarget.style.color = colors.text.onDark; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = colors.surface; e.currentTarget.style.color = colors.text.muted; }}
        ><FontAwesomeIcon icon="chevron-up" size="xs" /></button>
      )}
      {index < total - 1 && (
        <button
          style={btn}
          onClick={(e) => { e.stopPropagation(); moveBlock(index, index + 1); }}
          onMouseEnter={(e) => { e.currentTarget.style.background = colors.drawer.bg; e.currentTarget.style.color = colors.text.onDark; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = colors.surface; e.currentTarget.style.color = colors.text.muted; }}
        ><FontAwesomeIcon icon="chevron-down" size="xs" /></button>
      )}
      <button
        style={btn}
        onClick={(e) => { e.stopPropagation(); duplicateBlock(blockId); }}
        onMouseEnter={(e) => { e.currentTarget.style.background = colors.drawer.bg; e.currentTarget.style.color = colors.text.onDark; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = colors.surface; e.currentTarget.style.color = colors.text.muted; }}
      ><FontAwesomeIcon icon="copy" size="xs" /></button>
      <button
        style={{ ...btn, color: colors.accentBright }}
        onClick={(e) => { e.stopPropagation(); deleteBlock(blockId); }}
        onMouseEnter={(e) => { e.currentTarget.style.background = colors.error; e.currentTarget.style.color = "#fff"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = colors.surface; e.currentTarget.style.color = colors.accentBright; }}
      ><FontAwesomeIcon icon="trash" size="xs" /></button>
    </div>
  );
}
