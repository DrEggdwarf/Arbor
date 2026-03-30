import { useEffect } from "react";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { colors, typography, radii, zIndex } from "../../../styles/tokens";
import { btnStyle } from "./shared";

export function ModalShell({ title, icon, onClose, children }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return createPortal(
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: zIndex.modal,
        background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 32,
      }}
    >
      <div style={{
        background: colors.surface, borderRadius: radii.xl,
        boxShadow: colors.shadow.elevated,
        width: "90vw", maxWidth: 1100, maxHeight: "85vh",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "14px 20px",
          borderBottom: `1px solid ${colors.border}`,
        }}>
          <FontAwesomeIcon icon={icon} style={{ color: colors.accentBright, fontSize: 14 }} />
          <span style={{
            fontFamily: typography.fontFamily.body,
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.semibold,
            color: colors.text.primary, flex: 1,
          }}>{title}</span>
          <button
            onClick={onClose}
            style={{
              ...btnStyle, background: "transparent",
              border: `1px solid ${colors.border}`, color: colors.text.muted,
              width: 32, height: 32, padding: 0, display: "flex",
              alignItems: "center", justifyContent: "center",
            }}
          >
            <FontAwesomeIcon icon="times" />
          </button>
        </div>
        <div style={{ flex: 1, overflow: "auto" }}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
