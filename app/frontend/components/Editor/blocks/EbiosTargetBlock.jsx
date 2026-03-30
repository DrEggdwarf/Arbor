import { useMemo } from "react";
import { colors, typography, radii } from "../../../styles/tokens";

/* ── EBIOS RM Cible — Concentric target diagram ── */

const SVG_W = 400;
const SVG_H = 440; // extra space for integrated legend
const CX = SVG_W / 2;
const CY = 190; // shifted up to leave room for legend at bottom
const RAYON = 150;
const GAP_DEG = 10; // gap between sectors in degrees

const DEFAULT_NIVEAUX = [
  { label: "1", couleur: "#27ae60" },
  { label: "2", couleur: "#f1c40f" },
  { label: "3", couleur: "#e67e22" },
  { label: "4", couleur: "#e74c3c" },
];

const COULEUR_RETENU = "#2980B9";
const COULEUR_NON_RETENU = "#95A5A6";

function deg2rad(d) { return (d * Math.PI) / 180; }

function polarToXY(cx, cy, r, angleDeg) {
  const rad = deg2rad(angleDeg - 90); // -90 so 0° = top
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx, cy, r, startDeg, endDeg) {
  const s = polarToXY(cx, cy, r, startDeg);
  const e = polarToXY(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M${s.x},${s.y} A${r},${r} 0 ${large} 1 ${e.x},${e.y}`;
}

function truncate(text, max) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
}

/**
 * Compute sector layout: each item gets an angular slice with GAP_DEG gaps between.
 * Returns array of { startDeg, endDeg, midDeg } for each item.
 */
function computeSectors(count) {
  if (count === 0) return [];
  const totalGap = count * GAP_DEG;
  const available = 360 - totalGap;
  const sliceSize = available / count;
  const sectors = [];
  let cursor = 0;
  for (let i = 0; i < count; i++) {
    sectors.push({
      startDeg: cursor + GAP_DEG / 2,
      endDeg: cursor + GAP_DEG / 2 + sliceSize,
      midDeg: cursor + GAP_DEG / 2 + sliceSize / 2,
    });
    cursor += sliceSize + GAP_DEG;
  }
  return sectors;
}

/**
 * Render one cible view — either by "source" or "objectif".
 */
function CibleSVG({ niveaux, items, couples, sectorKey, couleurRetenu, couleurNonRetenu }) {
  const niv = niveaux.length > 0 ? niveaux : DEFAULT_NIVEAUX;
  const sectors = computeSectors(items.length);
  const clrRetenu = couleurRetenu || COULEUR_RETENU;
  const clrNonRetenu = couleurNonRetenu || COULEUR_NON_RETENU;

  // Compute all sector boundary angles (N items → N boundary lines)
  const boundaryAngles = [];
  for (let i = 0; i < sectors.length; i++) {
    // Boundary at the start of each sector gap
    boundaryAngles.push(sectors[i].startDeg - GAP_DEG / 2);
  }

  // For each couple, find which sector + which ring
  const dots = couples.map((c) => {
    const sectorIdx = items.findIndex((it) => it.nom === c[sectorKey]);
    if (sectorIdx < 0) return null;
    const sector = sectors[sectorIdx];
    const pertinence = Math.max(1, Math.min(niv.length, c.pertinence || 1));
    const ringStep = RAYON / niv.length;
    const r = ringStep * (pertinence - 0.5);
    // Spread couples within sector evenly
    const couplesInSector = couples.filter((cc) => cc[sectorKey] === c[sectorKey]);
    const idx = couplesInSector.indexOf(c);
    const count = couplesInSector.length;
    const angleRange = sector.endDeg - sector.startDeg;
    const anglePad = angleRange * 0.15;
    const usable = angleRange - 2 * anglePad;
    const angle = count === 1
      ? sector.midDeg
      : sector.startDeg + anglePad + (usable * idx) / (count - 1);
    const pos = polarToXY(CX, CY, r, angle);
    const clr = c.retenu ? clrRetenu : clrNonRetenu;
    return { ...c, x: pos.x, y: pos.y, color: clr };
  }).filter(Boolean);

  // Legend items to render inside SVG
  const legendY = CY + RAYON + 30;

  return (
    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" style={{ display: "block", maxWidth: SVG_W }}>
      {/* Concentric rings — draw outermost first */}
      {niv.map((n, i) => {
        const r = RAYON * ((i + 1) / niv.length);
        return (
          <circle
            key={`ring-${i}`}
            cx={CX} cy={CY} r={r}
            fill={n.couleur}
            fillOpacity={0.12}
            stroke={n.couleur}
            strokeWidth={1.2}
            strokeOpacity={0.35}
          />
        );
      }).reverse()}

      {/* Dashed sector boundary lines — from center to beyond outer ring */}
      {boundaryAngles.map((angle, i) => {
        const outer = polarToXY(CX, CY, RAYON + 8, angle);
        return (
          <line
            key={`bnd-${i}`}
            x1={CX} y1={CY}
            x2={outer.x} y2={outer.y}
            stroke={colors.text.muted}
            strokeWidth={1.2}
            strokeDasharray="6 4"
            opacity={0.5}
          />
        );
      })}

      {/* Sector labels — item names in an arc outside the target */}
      {sectors.map((sec, i) => {
        const labelR = RAYON + 20;
        const pos = polarToXY(CX, CY, labelR, sec.midDeg);
        return (
          <text
            key={`lbl-${i}`}
            x={pos.x} y={pos.y}
            fontSize={9}
            fontFamily={typography.fontFamily.body}
            fill={items[i]?.couleur || colors.text.secondary}
            fontWeight={600}
            textAnchor="middle"
            dominantBaseline="central"
            opacity={0.85}
          >
            {truncate(items[i]?.label || items[i]?.nom || "", 18)}
          </text>
        );
      })}

      {/* Ring level numbers — positioned along the first sector boundary line */}
      {niv.map((n, i) => {
        const r = RAYON * ((i + 1) / niv.length) - (RAYON / niv.length / 2);
        // Place labels along the 12-o'clock direction (0°)
        const pos = polarToXY(CX, CY, r, 0);
        return (
          <g key={`nlbl-${i}`}>
            <circle cx={pos.x} cy={pos.y} r={8} fill={colors.surface} fillOpacity={0.85} />
            <text
              x={pos.x} y={pos.y + 0.5}
              fontSize={8}
              fontFamily={typography.fontFamily.body}
              fill={n.couleur}
              fontWeight={700}
              textAnchor="middle"
              dominantBaseline="central"
            >
              {n.label}
            </text>
          </g>
        );
      })}

      {/* Couple dots */}
      {dots.map((d, i) => (
        <g key={`dot-${i}`}>
          <circle cx={d.x} cy={d.y} r={8} fill={d.color} opacity={0.9} />
          <text
            x={d.x} y={d.y + 0.5}
            fontSize={6.5}
            fontFamily={typography.fontFamily.body}
            fill="#fff"
            fontWeight={700}
            textAnchor="middle"
            dominantBaseline="central"
          >
            {truncate(d.nom, 4)}
          </text>
        </g>
      ))}

      {/* ── Integrated Legend ── */}
      {(() => {
        const legendItems = [
          { type: "circle", color: clrRetenu, label: "Couple retenu" },
          { type: "circle", color: clrNonRetenu, label: "Non retenu" },
          ...niv.map((n) => ({ type: "rect", color: n.couleur, label: `Niv. ${n.label}` })),
        ];
        const itemW = SVG_W / legendItems.length;
        const startX = (SVG_W - legendItems.length * itemW) / 2;
        return (
          <g>
            {/* Separator line */}
            <line x1={40} y1={legendY - 8} x2={SVG_W - 40} y2={legendY - 8}
              stroke={colors.border} strokeWidth={0.5} opacity={0.5} />
            {legendItems.map((it, i) => {
              const x = startX + i * itemW + itemW / 2;
              return (
                <g key={`leg-${i}`}>
                  {it.type === "circle" ? (
                    <circle cx={x - 20} cy={legendY + 4} r={4.5}
                      fill={it.color} opacity={0.85} />
                  ) : (
                    <rect x={x - 24} y={legendY} width={9} height={9} rx={1.5}
                      fill={it.color} opacity={0.55} />
                  )}
                  <text x={x - 12} y={legendY + 5}
                    fontSize={8} fontFamily={typography.fontFamily.body}
                    fill={colors.text.muted} dominantBaseline="central">
                    {it.label}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })()}
    </svg>
  );
}

export function EbiosTargetBlock({ block, accentColor }) {
  const d = block.data || {};
  const niveaux = d.niveaux || DEFAULT_NIVEAUX;
  const sources = d.sources || [];
  const objectifs = d.objectifs || [];
  const couples = d.couples || [];
  const apparence = d.apparence || {};
  const view = d.view || "source"; // "source" | "objectif" | "both"

  const hasContent = (sources.length > 0 || objectifs.length > 0) && couples.length > 0;

  if (!hasContent) {
    return (
      <div style={{
        border: `2px dashed ${colors.border}`, borderRadius: radii.lg,
        padding: 32, textAlign: "center",
        color: colors.text.muted, fontSize: typography.fontSize.sm,
        fontFamily: typography.fontFamily.body,
      }}>
        Configurer la cible EBIOS RM dans les propriétés
      </div>
    );
  }

  const viewSource = view === "source" || view === "both";
  const viewObjectif = view === "objectif" || view === "both";
  const showBoth = view === "both";

  return (
    <div style={{ fontFamily: typography.fontFamily.body, margin: "8px 0" }}>
      {d.title && (
        <div style={{
          fontSize: 15, fontWeight: 700, color: colors.text.primary,
          marginBottom: 12, fontFamily: typography.fontFamily.heading,
        }}>{d.title}</div>
      )}

      <div style={{
        display: "flex", gap: 12, flexWrap: "wrap",
      }}>
        {viewSource && sources.length > 0 && (
          <div style={{
            flex: showBoth ? "1 1 45%" : "1 1 100%", minWidth: 260,
            border: `1px solid ${colors.border}`, borderRadius: radii.lg,
            background: colors.surface, overflow: "hidden",
          }}>
            <div style={{
              padding: "8px 12px", borderBottom: `1px solid ${colors.border}`,
              fontSize: typography.fontSize.sm, fontWeight: 600,
              color: colors.text.secondary, fontFamily: typography.fontFamily.heading,
              textAlign: "center",
            }}>
              Vision par source de risque
            </div>
            <div style={{ padding: 8, display: "flex", justifyContent: "center" }}>
              <CibleSVG
                niveaux={niveaux}
                items={sources}
                couples={couples}
                sectorKey="source"
                couleurRetenu={apparence.couleurRetenu}
                couleurNonRetenu={apparence.couleurNonRetenu}
              />
            </div>
          </div>
        )}

        {viewObjectif && objectifs.length > 0 && (
          <div style={{
            flex: showBoth ? "1 1 45%" : "1 1 100%", minWidth: 260,
            border: `1px solid ${colors.border}`, borderRadius: radii.lg,
            background: colors.surface, overflow: "hidden",
          }}>
            <div style={{
              padding: "8px 12px", borderBottom: `1px solid ${colors.border}`,
              fontSize: typography.fontSize.sm, fontWeight: 600,
              color: colors.text.secondary, fontFamily: typography.fontFamily.heading,
              textAlign: "center",
            }}>
              Vision par objectif visé
            </div>
            <div style={{ padding: 8, display: "flex", justifyContent: "center" }}>
              <CibleSVG
                niveaux={niveaux}
                items={objectifs}
                couples={couples}
                sectorKey="objectif"
                couleurRetenu={apparence.couleurRetenu}
                couleurNonRetenu={apparence.couleurNonRetenu}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
