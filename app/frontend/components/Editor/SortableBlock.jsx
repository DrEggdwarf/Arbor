import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BlockWrapper } from "./BlockWrapper";
import { colors, radii } from "../../styles/tokens";

export function SortableBlock({ block, index }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isOver } = useSortable({
    id: block.id,
    data: { type: "block", index },
    animateLayoutChanges: () => true,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms ease",
    opacity: isDragging ? 0.25 : 1,
    position: "relative",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {isOver && !isDragging && (
        <div style={{
          position: "absolute",
          top: -2,
          left: 0,
          right: 44,
          height: 3,
          background: colors.accentBright,
          borderRadius: radii.full,
          zIndex: 5,
          boxShadow: `0 0 8px ${colors.accentBright}60`,
        }} />
      )}
      <BlockWrapper block={block} index={index} />
    </div>
  );
}
