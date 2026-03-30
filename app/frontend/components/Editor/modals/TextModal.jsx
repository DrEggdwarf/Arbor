import { useState, useEffect, useRef, useCallback } from "react";
import { useEditorStore } from "../../../stores/editorStore";
import { blockRenderers } from "../blocks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { colors, typography, radii } from "../../../styles/tokens";
import { inputStyle, labelStyle } from "./shared";

export function TextModalEditor({ block, onClose }) {
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const accentColor = useEditorStore((s) => s.report?.accent_color) || colors.accentBright;
  const editorRef = useRef(null);
  const isComposing = useRef(false);

  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = block.data?.content || "";
  }, []);

  const handleInput = useCallback(() => {
    if (isComposing.current) return;
    updateBlock(block.id, { content: editorRef.current?.innerHTML || "" });
  }, [block.id, updateBlock]);

  const exec = (cmd, e) => {
    e.preventDefault();
    editorRef.current?.focus();
    if (cmd === "_cartouche") {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
        const range = sel.getRangeAt(0);
        const text = range.toString();
        const badge = document.createElement("code");
        badge.className = "arbor-cartouche";
        badge.textContent = text;
        badge.title = "Cliquer pour copier";
        range.deleteContents();
        range.insertNode(badge);
        sel.collapseToEnd();
      }
    } else {
      document.execCommand(cmd, false, null);
    }
    handleInput();
  };

  const formats = [
    { cmd: "bold", icon: "bold", title: "Gras" },
    { cmd: "italic", icon: "italic", title: "Italique" },
    { cmd: "underline", icon: "underline", title: "Souligné" },
    { cmd: "strikeThrough", icon: "strikethrough", title: "Barré" },
    { sep: true },
    { cmd: "_cartouche", icon: "terminal", title: "Cartouche technique" },
    { sep: true },
    { cmd: "insertUnorderedList", icon: "list-ul", title: "Liste à puces" },
    { cmd: "insertOrderedList", icon: "list-ol", title: "Liste numérotée" },
  ];

  const Renderer = blockRenderers["text"];

  return (
    <div style={{ display: "flex", height: "60vh" }}>
      <div style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column", gap: 8, borderRight: `1px solid ${colors.border}` }}>
        <div style={{ display: "flex", gap: 2, padding: "4px 6px", background: colors.bg, borderRadius: radii.md, width: "fit-content" }}>
          {formats.map((f, i) =>
            f.sep ? (
              <div key={i} style={{ width: 1, height: 20, background: colors.border, margin: "0 4px" }} />
            ) : (
              <button
                key={f.cmd}
                title={f.title}
                onMouseDown={(e) => exec(f.cmd, e)}
                style={{
                  width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
                  background: "transparent", border: "none", borderRadius: radii.md,
                  cursor: "pointer", color: colors.text.muted, fontSize: 12, padding: 0,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = accentColor; e.currentTarget.style.background = colors.surface; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = colors.text.muted; e.currentTarget.style.background = "transparent"; }}
              >
                <FontAwesomeIcon icon={f.icon} />
              </button>
            )
          )}
        </div>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onCompositionStart={() => { isComposing.current = true; }}
          onCompositionEnd={() => { isComposing.current = false; handleInput(); }}
          style={{
            ...inputStyle, flex: 1, overflow: "auto",
            lineHeight: typography.lineHeight.relaxed,
            minHeight: 200, borderRadius: radii.lg,
          }}
          data-placeholder="Saisir du texte..."
        />
      </div>

      <div style={{ width: "45%", padding: 20, overflow: "auto", background: colors.bg }}>
        <div style={labelStyle}>Aperçu</div>
        {Renderer && <Renderer block={block} accentColor={accentColor} />}
      </div>
    </div>
  );
}
