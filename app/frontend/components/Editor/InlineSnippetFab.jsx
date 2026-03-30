import { useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { colors, typography, radii } from "../../styles/tokens";

/* ── Badge & cartouche snippets ── */
const BADGE_SNIPPETS = [
  { level: "critical", label: "CRITIQUE", bg: "#c0392b" },
  { level: "high",     label: "ÉLEVÉ",    bg: "#e67e22" },
  { level: "medium",   label: "MOYEN",    bg: "#f39c12" },
  { level: "low",      label: "FAIBLE",   bg: "#27ae60" },
  { level: "info",     label: "INFO",     bg: "#2980b9" },
];

function buildBadge(level, text) {
  return `<span class="arbor-badge arbor-badge-${level}">${text}</span>`;
}
function buildCartouche(text) {
  return `<code class="arbor-cartouche">${text}</code>`;
}

function copySnippet(html) {
  navigator.clipboard?.writeText(html);
}

/* ── Snippet row with copy button ── */
function SnippetRow({ label, snippet, bg, onCopy }) {
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "6px 10px", borderRadius: 6,
        transition: "background 0.12s", cursor: "pointer",
        fontFamily: typography.fontFamily.body, fontSize: 13,
      }}
      onClick={() => onCopy(snippet)}
      onMouseEnter={(e) => (e.currentTarget.style.background = colors.bg)}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <span style={{
        display: "inline-block", width: 12, height: 12, borderRadius: 3,
        background: bg, flexShrink: 0,
      }} />
      <span style={{ flex: 1, color: colors.text.primary }}>{label}</span>
      <code style={{
        fontSize: 10, color: colors.text.muted, fontFamily: typography.fontFamily.body,
        opacity: 0.6, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>
        copier →
      </code>
    </div>
  );
}

/* ── Help Modal ── */
function HelpModal({ onClose }) {
  const [customText, setCustomText] = useState("");
  const [copied, setCopied] = useState(null);

  const handleCopy = useCallback((html) => {
    copySnippet(html);
    setCopied(html);
    setTimeout(() => setCopied(null), 1500);
  }, []);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: colors.surface, borderRadius: 16,
          border: `1px solid ${colors.border}`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          width: 520, maxHeight: "80vh", overflow: "auto",
          fontFamily: typography.fontFamily.body,
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 24px", borderBottom: `1px solid ${colors.border}`,
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: colors.text.primary }}>
              Aide — Snippets &amp; raccourcis
            </div>
            <div style={{ fontSize: 12, color: colors.text.muted, marginTop: 2 }}>
              Cliquez pour copier, puis collez dans n'importe quel champ texte
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 28, height: 28, borderRadius: 8, border: "none",
              background: colors.bg, cursor: "pointer", color: colors.text.muted,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12,
            }}
          >
            <FontAwesomeIcon icon="times" />
          </button>
        </div>

        {/* Copied toast */}
        {copied && (
          <div style={{
            margin: "8px 24px 0", padding: "6px 12px", borderRadius: 6,
            background: "rgba(39,174,96,0.1)", color: "#27ae60",
            fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6,
          }}>
            <FontAwesomeIcon icon="check" /> Copié dans le presse-papier !
          </div>
        )}

        <div style={{ padding: "16px 24px" }}>
          {/* ── Badges sévérité ── */}
          <div style={{
            fontSize: 11, fontWeight: 700, color: colors.text.muted,
            textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8,
          }}>
            Badges sévérité
          </div>
          <div style={{
            background: colors.bg, borderRadius: 8, padding: "4px 0",
            border: `1px solid ${colors.border}`, marginBottom: 16,
          }}>
            {BADGE_SNIPPETS.map((b) => (
              <SnippetRow
                key={b.level}
                label={b.label}
                bg={b.bg}
                snippet={buildBadge(b.level, b.label)}
                onCopy={handleCopy}
              />
            ))}
          </div>

          {/* ── Cartouche ── */}
          <div style={{
            fontSize: 11, fontWeight: 700, color: colors.text.muted,
            textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8,
          }}>
            Cartouche technique
          </div>
          <div style={{
            background: colors.bg, borderRadius: 8, padding: "4px 0",
            border: `1px solid ${colors.border}`, marginBottom: 16,
          }}>
            <SnippetRow
              label="<code> technique"
              bg={colors.text.muted}
              snippet={buildCartouche("COMMANDE")}
              onCopy={handleCopy}
            />
          </div>

          {/* ── Texte personnalisé ── */}
          <div style={{
            fontSize: 11, fontWeight: 700, color: colors.text.muted,
            textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8,
          }}>
            Texte personnalisé
          </div>
          <input
            placeholder="Tapez votre texte, puis choisissez un style..."
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            style={{
              width: "100%", padding: "8px 12px",
              border: `1px solid ${colors.border}`, borderRadius: 8,
              background: colors.bg, fontSize: 13,
              fontFamily: typography.fontFamily.body,
              color: colors.text.primary, outline: "none",
            }}
          />
          {customText.trim() && (
            <div style={{
              display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap",
            }}>
              {BADGE_SNIPPETS.map((b) => (
                <button
                  key={b.level}
                  title={`Badge ${b.label}`}
                  onClick={() => handleCopy(buildBadge(b.level, customText.trim()))}
                  style={{
                    height: 26, borderRadius: 6, border: "none",
                    background: b.bg, cursor: "pointer", padding: "0 10px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontSize: 11, fontWeight: 600, gap: 4,
                    fontFamily: typography.fontFamily.body,
                  }}
                >
                  {b.label}
                </button>
              ))}
              <button
                title="Cartouche"
                onClick={() => handleCopy(buildCartouche(customText.trim()))}
                style={{
                  height: 26, borderRadius: 6, border: `1px solid ${colors.border}`,
                  background: colors.surface, cursor: "pointer", padding: "0 10px",
                  fontSize: 11, fontFamily: typography.fontFamily.body, color: colors.text.muted,
                  display: "flex", alignItems: "center", gap: 4, fontWeight: 600,
                }}
              >
                <FontAwesomeIcon icon="terminal" style={{ fontSize: 9 }} /> code
              </button>
            </div>
          )}

          {/* ── Where to use ── */}
          <div style={{ height: 1, background: colors.border, margin: "20px 0 16px" }} />
          <div style={{
            fontSize: 11, fontWeight: 700, color: colors.text.muted,
            textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8,
          }}>
            Où utiliser les badges ?
          </div>
          <div style={{
            fontSize: 12, color: colors.text.secondary, lineHeight: 1.8,
          }}>
            Les badges et cartouches fonctionnent dans <strong>tous les champs texte</strong> :<br />
            • Titres de sections<br />
            • Titres de drawers / accordéons<br />
            • Cellules et en-têtes de tableaux<br />
            • Légendes d'images<br />
            • Blocs texte (via la barre d'outils)<br />
            • Callouts<br />
            • Titres des blocs Score / Risk Assessment
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Floating action buttons (bottom-right) ── */
export function InlineSnippetFab({ onExport }) {
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <>
      {/* Button group */}
      <div style={{
        position: "fixed", bottom: 20, right: 20, zIndex: 1000,
        display: "flex", gap: 8, alignItems: "center",
      }}>
        {/* Export button */}
        <button
          onClick={onExport}
          title="Exporter le rapport"
          style={{
            height: 36, borderRadius: 10, padding: "0 14px",
            background: colors.drawer.bg, color: colors.text.onDark,
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 7,
            fontSize: 12, fontWeight: 600, fontFamily: typography.fontFamily.body,
            boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
            transition: "background 0.15s",
            letterSpacing: "0.02em",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = colors.accentBright)}
          onMouseLeave={(e) => (e.currentTarget.style.background = colors.drawer.bg)}
        >
          <FontAwesomeIcon icon="external-link-alt" style={{ fontSize: 11 }} />
          Exporter
        </button>

        {/* Help FAB */}
        <button
          onClick={() => setHelpOpen(true)}
          title="Aide — Snippets & raccourcis"
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: colors.surface, color: colors.text.muted,
            border: `1px solid ${colors.border}`, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            fontSize: 14, fontWeight: 700, fontFamily: typography.fontFamily.body,
            transition: "background 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = colors.accentBright; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = colors.accentBright; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = colors.surface; e.currentTarget.style.color = colors.text.muted; e.currentTarget.style.borderColor = colors.border; }}
        >
          ?
        </button>
      </div>

      {/* Help modal */}
      {helpOpen && <HelpModal onClose={() => setHelpOpen(false)} />}
    </>
  );
}
