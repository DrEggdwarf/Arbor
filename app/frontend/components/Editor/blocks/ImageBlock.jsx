import { useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { colors, typography, radii } from "../../../styles/tokens";
import { RichText } from "./RichText";

const ZOOM = 1.5;
const LENS_W = 300;
const LENS_H = 100;

function NavBtn({ children, onClick, disabled }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      disabled={disabled}
      style={{
        width: 28, height: 28, borderRadius: 8, border: "none",
        background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)",
        fontSize: 15, cursor: disabled ? "default" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: disabled ? 0.3 : 1, backdropFilter: "blur(8px)",
      }}
    >
      {children}
    </button>
  );
}

function ActionBtn({ children, title, onClick }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 28, height: 28, borderRadius: 8, border: "none",
        background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)",
        fontSize: 12, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(8px)",
      }}
    >
      {children}
    </button>
  );
}

export function ImageBlock({ block, accentColor = colors.accentBright }) {
  const { images = [], magnification = false } = block.data;
  const validImages = images.filter(i => i.url);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lens, setLens] = useState(null);
  const vpRef = useRef(null);

  const idx = validImages.length ? Math.min(currentIndex, validImages.length - 1) : 0;
  const multi = validImages.length > 1;
  const img = validImages[idx];

  const handleMouseMove = useCallback((e) => {
    if (!magnification || !vpRef.current) return;
    const r = vpRef.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    setLens({
      x: Math.max(0, Math.min(x - LENS_W / 2, r.width - LENS_W)),
      y: Math.max(0, Math.min(y - LENS_H / 2, r.height - LENS_H)),
      dotX: x, dotY: y,
      bgX: -(x * ZOOM - LENS_W / 2),
      bgY: -(y * ZOOM - LENS_H / 2),
      bgW: r.width * ZOOM,
      bgH: r.height * ZOOM,
    });
  }, [magnification]);

  // Empty state
  if (!validImages.length) {
    return (
      <div style={{
        border: `2px dashed ${colors.border}`,
        borderRadius: 16,
        padding: 36,
        textAlign: "center",
        color: colors.text.muted,
        fontFamily: typography.fontFamily.body,
        fontSize: typography.fontSize.sm,
      }}>
        <FontAwesomeIcon icon="image" style={{ fontSize: 24, marginBottom: 8, display: "block", opacity: 0.4 }} />
        Ajouter une image dans les propriétés
      </div>
    );
  }

  return (
    <>
      <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", background: "#000", boxShadow: colors.shadow.card, border: `1px solid ${colors.border}` }}>
        {/* Viewport */}
        <div
          ref={vpRef}
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16/9",
            overflow: "hidden",
            cursor: magnification ? "none" : "pointer",
            background: "#000",
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setLens(null)}
          onClick={() => setLightboxOpen(true)}
        >
          <img
            src={img.url}
            alt={img.caption || ""}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", userSelect: "none" }}
            draggable={false}
          />

          {/* Magnification lens */}
          {magnification && lens && (
            <>
              <div style={{
                position: "absolute",
                left: lens.x, top: lens.y,
                width: LENS_W, height: LENS_H,
                border: "2px solid rgba(255,255,255,0.35)",
                borderRadius: 12,
                backgroundImage: `url("${img.url}")`,
                backgroundRepeat: "no-repeat",
                backgroundSize: `${lens.bgW}px ${lens.bgH}px`,
                backgroundPosition: `${lens.bgX}px ${lens.bgY}px`,
                pointerEvents: "none",
                zIndex: 10,
                boxShadow: "0 8px 32px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.1)",
              }} />
              <div style={{
                position: "absolute",
                left: lens.dotX, top: lens.dotY,
                width: 6, height: 6, borderRadius: "50%",
                background: "#fff", opacity: 0.7,
                pointerEvents: "none", zIndex: 11,
                transform: "translate(-50%, -50%)",
                boxShadow: "0 0 6px rgba(0,0,0,0.3)",
              }} />
            </>
          )}
        </div>

        {/* Bottom bar */}
        <div style={{
          display: "flex", alignItems: "center",
          padding: "8px 12px", gap: 8,
          background: "rgba(0,0,0,0.7)",
        }}>
          {multi && (
            <div style={{ display: "flex", gap: 4 }}>
              <NavBtn onClick={() => setCurrentIndex(idx - 1)} disabled={idx === 0}>‹</NavBtn>
              <NavBtn onClick={() => setCurrentIndex(idx + 1)} disabled={idx === validImages.length - 1}>›</NavBtn>
            </div>
          )}
          <span style={{
            flex: 1,
            fontSize: typography.fontSize.sm,
            color: "#fff",
            fontFamily: typography.fontFamily.body,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            textShadow: "0 1px 3px rgba(0,0,0,0.4)",
          }}>
            <RichText html={img.caption || ""} />
          </span>
          {multi && (
            <span style={{ fontSize: typography.fontSize.xs, color: "rgba(255,255,255,0.7)", fontFamily: typography.fontFamily.body }}>
              {idx + 1} / {validImages.length}
            </span>
          )}
          <div style={{ display: "flex", gap: 4 }}>
            {magnification && (
              <ActionBtn title="Loupe active">
                <FontAwesomeIcon icon="search-plus" />
              </ActionBtn>
            )}
            <ActionBtn title="Agrandir" onClick={(e) => { e.stopPropagation(); setLightboxOpen(true); }}>
              <FontAwesomeIcon icon="expand" />
            </ActionBtn>
          </div>
        </div>

        {/* Dots for multi */}
        {multi && (
          <div style={{ display: "flex", justifyContent: "center", gap: 6, padding: "8px 0 6px", background: "#000" }}>
            {validImages.map((_, i) => (
              <span
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
                style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: i === idx ? accentColor : "rgba(255,255,255,0.2)",
                  cursor: "pointer", transition: "all 0.2s",
                  transform: i === idx ? "scale(1.35)" : "scale(1)",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && createPortal(
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.92)",
            backdropFilter: "blur(24px) saturate(180%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "zoom-out",
          }}
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            style={{
              position: "absolute", top: 20, right: 24,
              width: 36, height: 36, borderRadius: "50%", border: "none",
              background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)",
              fontSize: 18, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(10px)",
            }}
          >
            ✕
          </button>
          <img
            src={img.url}
            alt={img.caption || ""}
            style={{
              maxWidth: "92vw", maxHeight: "92vh",
              objectFit: "contain", borderRadius: 20,
              boxShadow: "0 20px 80px rgba(0,0,0,0.5)",
              userSelect: "none",
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>,
        document.body
      )}
    </>
  );
}
