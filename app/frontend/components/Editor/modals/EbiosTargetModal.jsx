import { useState, useEffect, useCallback } from "react";
import { useEditorStore } from "../../../stores/editorStore";
import { blockRenderers } from "../blocks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { colors, typography } from "../../../styles/tokens";
import { labelStyle, smallInput, tinyBtn, splitLayout, editorSide, previewSide } from "./shared";

const VIEW_OPTIONS = [
  { value: "source", label: "Par source" },
  { value: "objectif", label: "Par objectif" },
  { value: "both", label: "Les deux" },
];

const DEFAULT_COLORS = ["#e74c3c", "#e67e22", "#9b59b6", "#2980b9", "#27ae60", "#f39c12", "#1abc9c", "#34495e"];

export function EbiosTargetEditor({ block }) {
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const accentColor = useEditorStore((s) => s.report?.accent_color) || colors.accentBright;
  const [data, setData] = useState(() => ({ ...block.data }));

  const update = useCallback((patch) => {
    setData((prev) => ({ ...prev, ...patch }));
  }, []);

  useEffect(() => { updateBlock(block.id, data); }, [data, block.id, updateBlock]);

  const niveaux = data.niveaux || [];
  const sources = data.sources || [];
  const objectifs = data.objectifs || [];
  const couples = data.couples || [];
  const apparence = data.apparence || {};

  // Sources
  const addSource = () => update({
    sources: [...sources, { nom: `SR${sources.length + 1}`, label: "", couleur: DEFAULT_COLORS[sources.length % DEFAULT_COLORS.length] }],
  });
  const removeSource = (i) => update({ sources: sources.filter((_, j) => j !== i) });
  const updateSource = (i, key, val) =>
    update({ sources: sources.map((s, j) => j === i ? { ...s, [key]: val } : s) });

  // Objectifs
  const addObjectif = () => update({
    objectifs: [...objectifs, { nom: `OV${objectifs.length + 1}`, label: "", couleur: DEFAULT_COLORS[(objectifs.length + 3) % DEFAULT_COLORS.length] }],
  });
  const removeObjectif = (i) => update({ objectifs: objectifs.filter((_, j) => j !== i) });
  const updateObjectif = (i, key, val) =>
    update({ objectifs: objectifs.map((o, j) => j === i ? { ...o, [key]: val } : o) });

  // Couples
  const addCouple = () => update({
    couples: [...couples, {
      nom: `C${couples.length + 1}`,
      source: sources[0]?.nom || "",
      objectif: objectifs[0]?.nom || "",
      pertinence: 2,
      retenu: true,
    }],
  });
  const removeCouple = (i) => update({ couples: couples.filter((_, j) => j !== i) });
  const updateCouple = (i, key, val) =>
    update({ couples: couples.map((c, j) => j === i ? { ...c, [key]: val } : c) });

  const Renderer = blockRenderers["ebios-target"];
  const previewBlock = { ...block, data };

  const sectionHeader = (label, count, onAdd, addLabel) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
      <div style={{ ...labelStyle, fontWeight: 600 }}>{label} ({count})</div>
      <button onClick={onAdd} style={{ ...tinyBtn, width: "auto", padding: "3px 8px", color: colors.accentBright, borderColor: colors.accentBright }}>
        <FontAwesomeIcon icon="plus" style={{ fontSize: 9 }} /> {addLabel}
      </button>
    </div>
  );

  return (
    <div style={splitLayout}>
      <div style={editorSide}>
        {/* Title */}
        <div>
          <div style={labelStyle}>Titre</div>
          <input value={data.title || ""} onChange={(e) => update({ title: e.target.value })} style={smallInput} />
        </div>

        {/* View */}
        <div>
          <div style={labelStyle}>Vue</div>
          <select value={data.view || "both"} onChange={(e) => update({ view: e.target.value })}
            style={{ ...smallInput, cursor: "pointer" }}>
            {VIEW_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Apparence */}
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Couleur retenu</div>
            <input type="color" value={apparence.couleurRetenu || "#2980B9"}
              onChange={(e) => update({ apparence: { ...apparence, couleurRetenu: e.target.value } })}
              style={{ width: "100%", height: 28, border: "none", cursor: "pointer", padding: 0 }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Couleur non retenu</div>
            <input type="color" value={apparence.couleurNonRetenu || "#95A5A6"}
              onChange={(e) => update({ apparence: { ...apparence, couleurNonRetenu: e.target.value } })}
              style={{ width: "100%", height: 28, border: "none", cursor: "pointer", padding: 0 }} />
          </div>
        </div>

        {/* Sources de risque */}
        {sectionHeader("Sources de risque", sources.length, addSource, "Source")}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {sources.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <input type="color" value={s.couleur || accentColor}
                onChange={(e) => updateSource(i, "couleur", e.target.value)}
                style={{ width: 24, height: 24, border: "none", cursor: "pointer", padding: 0, flexShrink: 0 }} />
              <input value={s.nom || ""} onChange={(e) => updateSource(i, "nom", e.target.value)}
                placeholder="ID" style={{ ...smallInput, width: 50 }} />
              <input value={s.label || ""} onChange={(e) => updateSource(i, "label", e.target.value)}
                placeholder="Label" style={{ ...smallInput, flex: 1 }} />
              <button onClick={() => removeSource(i)} style={tinyBtn}>
                <FontAwesomeIcon icon="times" style={{ fontSize: 9, color: colors.error }} />
              </button>
            </div>
          ))}
        </div>

        {/* Objectifs visés */}
        {sectionHeader("Objectifs visés", objectifs.length, addObjectif, "Objectif")}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {objectifs.map((o, i) => (
            <div key={i} style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <input type="color" value={o.couleur || accentColor}
                onChange={(e) => updateObjectif(i, "couleur", e.target.value)}
                style={{ width: 24, height: 24, border: "none", cursor: "pointer", padding: 0, flexShrink: 0 }} />
              <input value={o.nom || ""} onChange={(e) => updateObjectif(i, "nom", e.target.value)}
                placeholder="ID" style={{ ...smallInput, width: 50 }} />
              <input value={o.label || ""} onChange={(e) => updateObjectif(i, "label", e.target.value)}
                placeholder="Label" style={{ ...smallInput, flex: 1 }} />
              <button onClick={() => removeObjectif(i)} style={tinyBtn}>
                <FontAwesomeIcon icon="times" style={{ fontSize: 9, color: colors.error }} />
              </button>
            </div>
          ))}
        </div>

        {/* Couples SR/OV */}
        {sectionHeader("Couples SR/OV", couples.length, addCouple, "Couple")}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {couples.map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
              <input value={c.nom || ""} onChange={(e) => updateCouple(i, "nom", e.target.value)}
                placeholder="ID" style={{ ...smallInput, width: 40 }} />
              <select value={c.source || ""} onChange={(e) => updateCouple(i, "source", e.target.value)}
                style={{ ...smallInput, flex: 1, cursor: "pointer", minWidth: 60 }}>
                <option value="">Source…</option>
                {sources.map((s) => <option key={s.nom} value={s.nom}>{s.label || s.nom}</option>)}
              </select>
              <select value={c.objectif || ""} onChange={(e) => updateCouple(i, "objectif", e.target.value)}
                style={{ ...smallInput, flex: 1, cursor: "pointer", minWidth: 60 }}>
                <option value="">Objectif…</option>
                {objectifs.map((o) => <option key={o.nom} value={o.nom}>{o.label || o.nom}</option>)}
              </select>
              <select value={c.pertinence || 1} onChange={(e) => updateCouple(i, "pertinence", parseInt(e.target.value, 10))}
                style={{ ...smallInput, width: 44, cursor: "pointer" }}>
                {niveaux.map((n, ni) => <option key={ni} value={ni + 1}>{n.label}</option>)}
                {niveaux.length === 0 && [1,2,3,4].map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
              <label style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: colors.text.muted, cursor: "pointer" }}>
                <input type="checkbox" checked={c.retenu !== false}
                  onChange={(e) => updateCouple(i, "retenu", e.target.checked)} />
                R
              </label>
              <button onClick={() => removeCouple(i)} style={tinyBtn}>
                <FontAwesomeIcon icon="times" style={{ fontSize: 9, color: colors.error }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div style={previewSide}>
        <div style={labelStyle}>Aperçu</div>
        {Renderer && <Renderer block={previewBlock} accentColor={accentColor} />}
      </div>
    </div>
  );
}
