import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useEditorStore } from "../../stores/editorStore";
import { SortableBlock } from "./SortableBlock";
import { useTranslation } from "../../lib/useTranslation";
import { colors, layout, radii } from "../../styles/tokens";

export function Canvas() {
  const { t } = useTranslation();
  const blocks = useEditorStore((s) => s.report?.content?.blocks || []);
  const setSelectedBlock = useEditorStore((s) => s.setSelectedBlock);
  const { setNodeRef, isOver } = useDroppable({ id: "canvas" });
  const blockIds = blocks.map((b) => b.id);

  const handleBgClick = (e) => {
    if (e.target === e.currentTarget) setSelectedBlock(null);
  };

  return (
    <div
      onClick={handleBgClick}
      style={{
        flex: 1,
        background: colors.bg,
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(26,26,24,0.07) 1px, transparent 0)",
        backgroundSize: "24px 24px",
        overflow: "auto",
        padding: 40,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div
        ref={setNodeRef}
        style={{
          width: layout.pageWidth,
          minHeight: layout.pageMinHeight,
          height: "auto",
          background: colors.surface,
          boxShadow: colors.shadow.page,
          borderRadius: 2,
          padding: layout.pagePadding,
          flexShrink: 0,
          transition: "box-shadow 0.2s",
          ...(isOver && { boxShadow: `${colors.shadow.page}, 0 0 0 2px ${colors.accentBright}` }),
        }}
      >
        <SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
          {blocks.map((block, i) => (
            <SortableBlock key={block.id} block={block} index={i} />
          ))}
        </SortableContext>

        <div style={{
          height: 40,
          border: `1.5px dashed ${isOver ? colors.accentBright : colors.border}`,
          borderRadius: radii.lg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          color: isOver ? colors.accentBright : colors.text.muted,
          letterSpacing: "0.04em",
          transition: "all 0.15s",
          marginTop: blocks.length ? 24 : 0,
        }}>
          {t("editor.drop_here")}
        </div>
      </div>
    </div>
  );
}
