import { useRef, useState, useCallback, useEffect } from "react";
import { useEditorStore } from "../../../stores/editorStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { colors, typography, radii } from "../../../styles/tokens";

const toolbarBtnStyle = {
  width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center",
  background: "transparent", border: "none", borderRadius: radii.md,
  cursor: "pointer", color: colors.text.muted, fontSize: 11, padding: 0,
  transition: "all 0.12s",
};

const FORMATS = [
  { cmd: "bold", icon: "bold", title: "Gras" },
  { cmd: "italic", icon: "italic", title: "Italique" },
  { cmd: "underline", icon: "underline", title: "Souligné" },
  { cmd: "strikeThrough", icon: "strikethrough", title: "Barré" },
  { sep: true },
  { cmd: "_cartouche", icon: "terminal", title: "Cartouche technique" },
  { sep: true },
  { cmd: "_badge", title: "Badge sévérité", isBadgeMenu: true },
  { sep: true },
  { cmd: "insertUnorderedList", icon: "list-ul", title: "Liste à puces" },
  { cmd: "insertOrderedList", icon: "list-ol", title: "Liste numérotée" },
];

const BADGE_LEVELS = [
  { level: "critical", label: "Critique", color: "#842029", bg: "rgba(229,115,115,0.12)" },
  { level: "high",     label: "Élevé",    color: "#9C4221", bg: "rgba(240,160,94,0.12)" },
  { level: "medium",   label: "Moyen",    color: "#856404", bg: "rgba(233,196,106,0.12)" },
  { level: "low",      label: "Faible",   color: "#2D7A47", bg: "rgba(92,184,92,0.12)" },
  { level: "info",     label: "Info",     color: "#2C5282", bg: "rgba(91,143,212,0.12)" },
];

export function TextBlock({ block, accentColor }) {
  const { content = "" } = block.data;
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const isSelected = selectedBlockId === block.id;
  const editorRef = useRef(null);
  const [focused, setFocused] = useState(false);
  const [showBadgeMenu, setShowBadgeMenu] = useState(false);
  const isComposing = useRef(false);
  const savedRange = useRef(null);

  // Sync external content changes (from PropertiesPanel) only when not focused
  useEffect(() => {
    if (!focused && editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content || "";
    }
  }, [content, focused]);

  const handleInput = useCallback(() => {
    if (isComposing.current) return;
    const html = editorRef.current?.innerHTML || "";
    updateBlock(block.id, { content: html });
  }, [block.id, updateBlock]);

  const execFormat = useCallback((cmd, e) => {
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
    } else if (cmd.startsWith("_badge_")) {
      const level = cmd.replace("_badge_", "");
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.isCollapsed ? savedRange.current : sel.getRangeAt(0);
        if (!range) return;
        const text = range.toString() || BADGE_LEVELS.find((b) => b.level === level)?.label || level;
        const span = document.createElement("span");
        span.className = `arbor-badge arbor-badge-${level}`;
        span.textContent = text;
        range.deleteContents();
        range.insertNode(span);
        sel.collapseToEnd();
      }
      setShowBadgeMenu(false);
    } else {
      document.execCommand(cmd, false, null);
    }
    handleInput();
  }, [handleInput]);

  return (
    <div style={{ position: "relative" }}>
      {/* Mini toolbar — visible when selected or focused */}
      {(isSelected || focused) && (
        <div
          style={{
            display: "flex", alignItems: "center", gap: 2,
            marginBottom: 6, padding: "3px 4px",
            background: colors.bg, border: `1px solid ${colors.border}`,
            borderRadius: radii.md, width: "fit-content",
          }}
        >
          {FORMATS.map((f, i) =>
            f.sep ? (
              <div key={i} style={{ width: 1, height: 16, background: colors.border, margin: "0 2px" }} />
            ) : f.isBadgeMenu ? (
              <div key={f.cmd} style={{ position: "relative" }}>
                <button
                  title={f.title}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const sel = window.getSelection();
                    if (sel && sel.rangeCount > 0) savedRange.current = sel.getRangeAt(0).cloneRange();
                    setShowBadgeMenu((v) => !v);
                  }}
                  style={toolbarBtnStyle}
                  onMouseEnter={(e) => { e.currentTarget.style.background = colors.surface; e.currentTarget.style.color = accentColor; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = colors.text.muted; }}
                >
                  <FontAwesomeIcon icon="exclamation-circle" />
                </button>
                {showBadgeMenu && (
                  <div style={{
                    position: "absolute", top: 30, left: 0, zIndex: 50,
                    background: colors.surface, border: `1px solid ${colors.border}`,
                    borderRadius: radii.md, boxShadow: colors.shadow.card,
                    padding: 4, display: "flex", flexDirection: "column", gap: 2, minWidth: 90,
                  }}>
                    {BADGE_LEVELS.map((b) => (
                      <button
                        key={b.level}
                        onMouseDown={(e) => execFormat(`_badge_${b.level}`, e)}
                        style={{
                          display: "flex", alignItems: "center", gap: 6,
                          padding: "4px 8px", border: "none", borderRadius: radii.md,
                          background: "transparent", cursor: "pointer",
                          fontFamily: typography.fontFamily.body, fontSize: typography.fontSize.sm,
                          color: colors.text.primary,
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = colors.bg; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                      >
                        <span style={{
                          width: 8, height: 8, borderRadius: "50%",
                          background: b.color, flexShrink: 0,
                        }} />
                        {b.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                key={f.cmd}
                title={f.title}
                onMouseDown={(e) => execFormat(f.cmd, e)}
                style={toolbarBtnStyle}
                onMouseEnter={(e) => { e.currentTarget.style.background = colors.surface; e.currentTarget.style.color = accentColor; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = colors.text.muted; }}
              >
                <FontAwesomeIcon icon={f.icon} />
              </button>
            )
          )}
        </div>
      )}

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onFocus={() => setFocused(true)}
        onBlur={() => { setFocused(false); handleInput(); }}
        onInput={handleInput}
        onCompositionStart={() => { isComposing.current = true; }}
        onCompositionEnd={() => { isComposing.current = false; handleInput(); }}
        dangerouslySetInnerHTML={{ __html: content || "" }}
        style={{
          fontFamily: typography.fontFamily.body,
          fontSize: typography.fontSize.md,
          color: colors.text.secondary,
          lineHeight: typography.lineHeight.relaxed,
          minHeight: 20,
          outline: "none",
          cursor: "text",
        }}
        data-placeholder="Saisir du texte..."
      />

      <style>{`
        [data-placeholder]:empty::before {
          content: attr(data-placeholder);
          opacity: 0.3;
          font-style: italic;
          pointer-events: none;
        }
        [contenteditable] b, [contenteditable] strong { font-weight: 600; color: ${colors.text.primary}; }
        [contenteditable] i, [contenteditable] em { font-style: italic; }
        [contenteditable] u { text-decoration: underline; }
        [contenteditable] strike, [contenteditable] s { text-decoration: line-through; opacity: 0.6; }
        [contenteditable] ul, [contenteditable] ol { margin: 4px 0; padding-left: 20px; }
        [contenteditable] li { margin: 2px 0; }
      `}</style>
    </div>
  );
}
