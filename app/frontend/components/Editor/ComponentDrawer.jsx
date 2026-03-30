import { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useDraggable } from "@dnd-kit/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "../../lib/useTranslation";
import { blockRegistry, categories, categoryLabels } from "../../stores/blockRegistry";
import { blockPreviews } from "./blockPreviews";
import { colors, typography, spacing, layout, radii } from "../../styles/tokens";

function DraggableCard({ block }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `drawer-${block.type}`,
    data: { type: "component", block },
  });
  const [hover, setHover] = useState(false);
  const [tooltipPos, setTooltipPos] = useState(null);
  const cardRef = useRef(null);
  const Preview = blockPreviews[block.type];

  useEffect(() => {
    if (hover && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setTooltipPos({ left: rect.right + 12, top: rect.top + rect.height / 2 });
    }
  }, [hover]);

  return (
    <div ref={cardRef} style={{ position: "relative", display: "flex" }}>
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={{
          background: colors.drawer.cardBg,
          border: `1px solid ${colors.drawer.cardBorder}`,
          borderRadius: radii.lg,
          padding: "10px 8px",
          cursor: "grab",
          transition: "all 0.15s",
          textAlign: "center",
          userSelect: "none",
          opacity: isDragging ? 0.4 : 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 62,
          flex: 1,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = colors.accent;
          e.currentTarget.style.transform = "translateY(-1px)";
          setHover(true);
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = colors.drawer.cardBorder;
          e.currentTarget.style.transform = "";
          setHover(false);
        }}
      >
      <div style={{ fontSize: 14, marginBottom: 4, color: colors.accent }}>
        <FontAwesomeIcon icon={block.icon} />
      </div>
      <div style={{
        fontFamily: typography.fontFamily.body,
        fontSize: typography.fontSize.sm,
        color: colors.text.onDark,
        lineHeight: 1.3,
      }}>
        {block.label}
      </div>
    </div>

      {/* Preview tooltip — rendered via portal to escape overflow:hidden */}
      {hover && Preview && !isDragging && tooltipPos && createPortal(
        <div
          style={{
            position: "fixed",
            left: tooltipPos.left,
            top: tooltipPos.top,
            transform: "translateY(-50%)",
            zIndex: 9999,
            pointerEvents: "none",
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: 12,
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            padding: 8,
            width: 216,
          }}
        >
          <div style={{ borderRadius: 6, overflow: "hidden" }}>
            <Preview />
          </div>
          <div style={{
            marginTop: 6, fontSize: 11, fontWeight: 600,
            color: colors.text.primary, textAlign: "center",
            fontFamily: typography.fontFamily.body,
          }}>
            {block.label}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export function ComponentDrawer() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(() => {
    const init = {};
    categories.forEach((c) => { init[c] = c === "content" || c === "layout" || c === "media"; });
    return init;
  });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const result = {};
    categories.forEach((cat) => {
      result[cat] = blockRegistry.filter(
        (b) => b.category === cat && (b.label.toLowerCase().includes(q) || b.type.includes(q))
      );
    });
    return result;
  }, [search]);

  return (
    <div style={{
      width: layout.drawerWidth,
      background: colors.drawer.bg,
      borderRight: `1px solid ${colors.drawer.border}`,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      flexShrink: 0,
    }}>
      {/* Search */}
      <div style={{ padding: 12, borderBottom: `1px solid ${colors.drawer.border}` }}>
        <input
          placeholder={t("editor.drawer.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            background: colors.drawer.surface,
            border: `1px solid ${colors.drawer.border}`,
            borderRadius: radii.md,
            padding: "7px 10px",
            fontFamily: typography.fontFamily.body,
            fontSize: typography.fontSize.base,
            color: colors.text.onDark,
            outline: "none",
          }}
        />
      </div>

      {/* Categories */}
      <div style={{ flex: 1, overflowY: "auto", padding: 8 }}>
        {categories.map((cat) => {
          const blocks = filtered[cat];
          if (!blocks?.length && search) return null;
          const hasBlocks = blocks?.length > 0;
          return (
            <div key={cat} style={{ marginBottom: 16 }}>
              <div
                onClick={() => hasBlocks && setExpanded((p) => ({ ...p, [cat]: !p[cat] }))}
                style={{
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.medium,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: hasBlocks ? "#9A968E" : "#5A574F",
                  padding: "4px 6px 8px",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                {expanded[cat] ? <FontAwesomeIcon icon="chevron-down" size="xs" /> : <FontAwesomeIcon icon="chevron-right" size="xs" />} {categoryLabels[cat] || cat}
              {!hasBlocks && <span style={{ fontSize: 9, opacity: 0.5, marginLeft: 6, fontStyle: "italic", textTransform: "none", letterSpacing: 0 }}>bientôt</span>}
              </div>

              {expanded[cat] && hasBlocks && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, alignItems: "stretch" }}>
                  {blocks.map((b) => (
                    <DraggableCard key={b.type} block={b} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
