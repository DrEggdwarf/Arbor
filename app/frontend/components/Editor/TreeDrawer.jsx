import { useRef, useState, useEffect } from "react";
import { useEditorStore } from "../../stores/editorStore";
import { getBlockType } from "../../stores/blockRegistry";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "../../lib/useTranslation";
import { colors, typography, layout, radii } from "../../styles/tokens";

function ContextMenu({ x, y, blockId, index, total, onClose }) {
  const { moveBlock, duplicateBlock, deleteBlock } = useEditorStore();
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const items = [
    index > 0 && { label: "Monter", icon: "arrow-up", action: () => moveBlock(index, index - 1) },
    index < total - 1 && { label: "Descendre", icon: "arrow-down", action: () => moveBlock(index, index + 1) },
    { label: "Dupliquer", icon: "copy", action: () => duplicateBlock(blockId) },
    { divider: true },
    { label: "Supprimer", icon: "trash", action: () => deleteBlock(blockId), danger: true },
  ].filter(Boolean);

  return (
    <div ref={menuRef} style={{
      position: "fixed", left: x, top: y, zIndex: 1000,
      background: colors.surface, border: `1px solid ${colors.border}`,
      borderRadius: radii.lg, boxShadow: colors.shadow.elevated,
      padding: 4, minWidth: 140,
    }}>
      {items.map((item, i) =>
        item.divider ? (
          <div key={i} style={{ height: 1, background: colors.border, margin: "4px 0" }} />
        ) : (
          <div
            key={i}
            onClick={() => { item.action(); onClose(); }}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "6px 10px", borderRadius: radii.md, cursor: "pointer",
              fontFamily: typography.fontFamily.body, fontSize: typography.fontSize.sm,
              color: item.danger ? colors.error : colors.text.primary,
              transition: "background 0.1s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = colors.bg)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <FontAwesomeIcon icon={item.icon} style={{ fontSize: 10, width: 14 }} />
            {item.label}
          </div>
        )
      )}
    </div>
  );
}

function TreeItem({ block, index, depth = 0, dragState, onDragStart, onDragOver, onDrop, onContextMenu }) {
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const setSelectedBlock = useEditorStore((s) => s.setSelectedBlock);
  const spec = getBlockType(block.type);
  const isSelected = selectedBlockId === block.id;
  const isOver = dragState.overId === block.id;
  const hasChildren = block.children?.length > 0;
  const isContainer = spec?.isContainer;

  return (
    <>
      <div
        draggable
        onDragStart={(e) => onDragStart(e, index)}
        onDragOver={(e) => onDragOver(e, index, block.id)}
        onDrop={(e) => onDrop(e, index)}
        onClick={() => setSelectedBlock(block.id)}
        onContextMenu={(e) => { e.preventDefault(); onContextMenu(e, block.id, index); }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 12px",
          paddingLeft: 12 + depth * 18,
          position: "relative",
          cursor: "grab",
          background: isSelected ? `${colors.blockSelected}15` : "transparent",
          borderLeft: isSelected ? `2.5px solid ${colors.blockSelected}` : "2.5px solid transparent",
          borderTop: isOver ? `2px solid ${colors.accentBright}` : "2px solid transparent",
          opacity: dragState.dragId === block.id ? 0.3 : 1,
          transition: "background 0.1s",
        }}
        onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = `${colors.blockHover}10`; }}
        onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
      >
        {/* Connector line for nested items */}
        {depth > 0 && (
          <span style={{
            position: "absolute",
            left: 12 + (depth - 1) * 18 + 6,
            top: 0, bottom: 0, width: 1,
            background: colors.border,
            pointerEvents: "none",
          }} />
        )}
        {isContainer && (
          <span style={{ fontSize: 9, color: colors.text.muted, width: 10, flexShrink: 0 }}>
            {hasChildren ? "▾" : "▸"}
          </span>
        )}
        <span style={{
          width: 22, height: 22, borderRadius: radii.md,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, flexShrink: 0,
          background: isSelected ? `${colors.blockSelected}20` : isContainer ? `${colors.accentBright}10` : colors.bg,
          color: isSelected ? colors.blockSelected : isContainer ? colors.accentBright : colors.text.muted,
        }}>
          <FontAwesomeIcon icon={spec?.icon || "cube"} />
        </span>
        <span style={{
          flex: 1,
          fontFamily: typography.fontFamily.body,
          fontSize: typography.fontSize.base,
          color: colors.text.primary,
          fontWeight: isContainer ? typography.fontWeight.medium : typography.fontWeight.normal,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          {block.type === "drawer" && block.data?.title ? block.data.title : (spec?.label || block.type)}
          {block.type === "horizontal-div" && hasChildren ? ` (${block.children.length})` : ""}
        </span>
      </div>
      {hasChildren && block.children.map((child, i) => (
        <TreeItem
          key={child.id}
          block={child}
          index={i}
          depth={depth + 1}
          dragState={dragState}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onContextMenu={onContextMenu}
        />
      ))}
    </>
  );
}

export function TreeDrawer() {
  const { t } = useTranslation();
  const blocks = useEditorStore((s) => s.report?.content?.blocks || []);
  const moveBlock = useEditorStore((s) => s.moveBlock);
  const dragRef = useRef({ dragIndex: null });
  const [dragState, setDragState] = useState({ dragId: null, overId: null });
  const [contextMenu, setContextMenu] = useState(null);

  const onDragStart = (e, index) => {
    dragRef.current.dragIndex = index;
    setDragState({ dragId: blocks[index]?.id, overId: null });
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e, index, blockId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragState.overId !== blockId) setDragState((s) => ({ ...s, overId: blockId }));
  };

  const onDrop = (e, toIndex) => {
    e.preventDefault();
    const fromIndex = dragRef.current.dragIndex;
    if (fromIndex !== null && fromIndex !== toIndex) moveBlock(fromIndex, toIndex);
    dragRef.current.dragIndex = null;
    setDragState({ dragId: null, overId: null });
  };

  const onDragEnd = () => {
    dragRef.current.dragIndex = null;
    setDragState({ dragId: null, overId: null });
  };

  const handleContextMenu = (e, blockId, index) => {
    setContextMenu({ x: e.clientX, y: e.clientY, blockId, index });
  };

  return (
    <div
      style={{
        width: layout.treeDrawerWidth,
        background: colors.surface,
        borderRight: `1px solid ${colors.border}`,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        flexShrink: 0,
      }}
      onDragEnd={onDragEnd}
    >
      <div style={{
        padding: "14px 16px",
        borderBottom: `1px solid ${colors.border}`,
        fontFamily: typography.fontFamily.body,
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: colors.text.muted,
      }}>
        {t("editor.tree.title")}
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {blocks.length > 0 ? (
          blocks.map((block, i) => (
            <TreeItem
              key={block.id}
              block={block}
              index={i}
              dragState={dragState}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onContextMenu={handleContextMenu}
            />
          ))
        ) : (
          <div style={{
            padding: 24,
            textAlign: "center",
            color: colors.text.muted,
            fontFamily: typography.fontFamily.body,
            fontSize: typography.fontSize.sm,
          }}>
            {t("editor.tree.empty")}
          </div>
        )}
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          blockId={contextMenu.blockId}
          index={contextMenu.index}
          total={blocks.length}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
