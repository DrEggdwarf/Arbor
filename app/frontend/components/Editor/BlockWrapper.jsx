import { useState } from "react";
import { getBlockType } from "../../stores/blockRegistry";
import { blockRenderers } from "./blocks";
import { BlockToolbar } from "./BlockToolbar";
import { useEditorStore } from "../../stores/editorStore";
import { colors, typography, radii } from "../../styles/tokens";

export function BlockWrapper({ block, index }) {
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const setSelectedBlock = useEditorStore((s) => s.setSelectedBlock);
  const accentColor = useEditorStore((s) => s.report?.accent_color) || colors.accentBright;
  const [hovered, setHovered] = useState(false);
  const spec = getBlockType(block.type);
  const selected = selectedBlockId === block.id;
  const Renderer = blockRenderers[block.type];

  const borderColor = selected
    ? accentColor
    : hovered
      ? colors.blockHover
      : "transparent";

  return (
    <div
      onClick={(e) => { e.stopPropagation(); setSelectedBlock(block.id); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        marginBottom: 16,
        paddingRight: 44,
        marginRight: -44,
        borderRadius: 4,
        cursor: "pointer",
        minHeight: 24,
      }}
    >
      <div style={{
        outline: `1.5px ${selected ? "solid" : "dashed"} ${borderColor}`,
        outlineOffset: 2,
        borderRadius: 4,
        transition: "outline-color 0.15s",
      }}>
        {Renderer ? (
          <Renderer block={block} accentColor={accentColor}>
            {spec?.isContainer && block.children?.length > 0 && (
              block.type === "horizontal-div" ? (
                block.children.map((child, i) => (
                  <div key={child.id} style={{
                    flex: 1,
                    minWidth: 0,
                    borderLeft: i > 0 ? `1px solid ${colors.border}` : "none",
                    paddingLeft: i > 0 ? 16 : 0,
                    paddingRight: i < block.children.length - 1 ? 16 : 0,
                  }}>
                    <BlockWrapper block={child} index={i} />
                  </div>
                ))
              ) : (
                block.children.map((child, i) => (
                  <BlockWrapper key={child.id} block={child} index={i} />
                ))
              )
            )}
          </Renderer>
        ) : (
          <div style={{
            padding: 16,
            fontFamily: typography.fontFamily.body,
            fontSize: typography.fontSize.md,
            color: colors.text.secondary,
          }}>
            <strong style={{ color: colors.text.primary }}>{spec?.label || block.type}</strong>
            {block.data && Object.keys(block.data).length > 0 && (
              <pre style={{ marginTop: 8, fontSize: 9, opacity: 0.6, whiteSpace: "pre-wrap" }}>
                {JSON.stringify(block.data, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>

      {(hovered || selected) && <BlockToolbar blockId={block.id} index={index} />}
    </div>
  );
}
