import { useState, useEffect, useCallback } from "react";
import { useEditorStore } from "../../../stores/editorStore";
import { blockRenderers } from "../blocks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { colors } from "../../../styles/tokens";
import { inputStyle, labelStyle, smallInput, tinyBtn, DEFAULT_COLORS } from "./shared";

export function SeriesChartModalEditor({ block, chartType, extraControls }) {
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const accentColor = useEditorStore((s) => s.report?.accent_color) || colors.accentBright;
  const [title, setTitle] = useState(block.data?.title || "");
  const [labels, setLabels] = useState(() => [...(block.data?.labels || [])]);
  const [series, setSeries] = useState(() => {
    const key = chartType === "stacked-bar" ? "series" : "datasets";
    return [...(block.data?.[key] || [])].map((s) => ({ ...s, values: [...(s.values || [])] }));
  });
  const [extras, setExtras] = useState(() => {
    const e = {};
    if (extraControls) extraControls.forEach((c) => { e[c.key] = block.data?.[c.key] ?? c.defaultValue; });
    return e;
  });

  const save = useCallback((t, l, s, ex) => {
    const key = chartType === "stacked-bar" ? "series" : "datasets";
    updateBlock(block.id, { title: t, labels: l, [key]: s, ...ex });
  }, [block.id, updateBlock, chartType]);

  useEffect(() => { save(title, labels, series, extras); }, [title, labels, series, extras, save]);

  const Renderer = blockRenderers[chartType];
  const dataKey = chartType === "stacked-bar" ? "series" : "datasets";
  const previewBlock = { ...block, data: { title, labels, [dataKey]: series, ...extras } };

  return (
    <div style={{ display: "flex", height: "65vh" }}>
      <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 10, borderRight: `1px solid ${colors.border}`, overflow: "auto" }}>
        <div>
          <div style={labelStyle}>Titre</div>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre" style={smallInput} />
        </div>
        {extraControls && extraControls.map((c) => (
          <div key={c.key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={labelStyle}>{c.label}</span>
            {c.type === "toggle" && (
              <div onClick={() => setExtras((e) => ({ ...e, [c.key]: !e[c.key] }))}
                style={{ cursor: "pointer", color: extras[c.key] ? colors.accentBright : colors.text.muted, fontSize: 12 }}>
                <FontAwesomeIcon icon={extras[c.key] ? "check-circle" : "times"} />
              </div>
            )}
            {c.type === "select" && (
              <select value={extras[c.key] || c.defaultValue} onChange={(e) => setExtras((ex) => ({ ...ex, [c.key]: e.target.value }))}
                style={{ ...smallInput, width: "auto", cursor: "pointer" }}>
                {c.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            )}
          </div>
        ))}
        <div>
          <div style={labelStyle}>Labels ({labels.length})</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {labels.map((l, i) => (
              <div key={i} style={{ display: "flex", gap: 2 }}>
                <input value={l} onChange={(e) => setLabels((prev) => prev.map((v, j) => j === i ? e.target.value : v))}
                  style={{ ...smallInput, width: 60 }} />
                <button onClick={() => {
                  setLabels((prev) => prev.filter((_, j) => j !== i));
                  setSeries((prev) => prev.map((s) => ({ ...s, values: s.values.filter((_, j) => j !== i) })));
                }} style={{ ...tinyBtn, color: colors.error, width: 20, height: 20 }}><FontAwesomeIcon icon="times" style={{ fontSize: 8 }} /></button>
              </div>
            ))}
            <button onClick={() => {
              setLabels((prev) => [...prev, `L${prev.length + 1}`]);
              setSeries((prev) => prev.map((s) => ({ ...s, values: [...s.values, 0] })));
            }} style={{ ...tinyBtn, width: "auto", padding: "2px 8px", color: colors.accentBright, borderColor: colors.accentBright, fontSize: 9 }}>+</button>
          </div>
        </div>
        <div style={labelStyle}>Séries ({series.length})</div>
        {series.map((sr, si) => (
          <div key={si} style={{ padding: 8, border: `1px solid ${colors.border}`, borderRadius: 8, marginBottom: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <input type="color" value={sr.color || DEFAULT_COLORS[si % DEFAULT_COLORS.length]}
                onChange={(e) => setSeries((prev) => prev.map((s, i) => i === si ? { ...s, color: e.target.value } : s))}
                style={{ width: 24, height: 24, border: "none", borderRadius: 6, cursor: "pointer", padding: 0 }} />
              <input value={sr.name || ""} onChange={(e) => setSeries((prev) => prev.map((s, i) => i === si ? { ...s, name: e.target.value } : s))}
                placeholder="Nom" style={{ ...smallInput, flex: 1 }} />
              <button onClick={() => setSeries((prev) => prev.filter((_, i) => i !== si))}
                style={{ ...tinyBtn, color: colors.error }}><FontAwesomeIcon icon="trash" /></button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {(sr.values || []).map((v, vi) => (
                <input key={vi} type="number" value={v} style={{ ...smallInput, width: 54, textAlign: "right" }}
                  onChange={(e) => setSeries((prev) => prev.map((s, i) => i === si ? { ...s, values: s.values.map((val, j) => j === vi ? Number(e.target.value) || 0 : val) } : s))} />
              ))}
            </div>
          </div>
        ))}
        <button onClick={() => setSeries((prev) => [...prev, { name: `Série ${prev.length + 1}`, color: DEFAULT_COLORS[prev.length % DEFAULT_COLORS.length], values: labels.map(() => 0) }])}
          style={{ ...tinyBtn, width: "auto", padding: "4px 10px", color: colors.accentBright, borderColor: colors.accentBright, alignSelf: "flex-start" }}>
          <FontAwesomeIcon icon="plus" style={{ fontSize: 9, marginRight: 4 }} /> Série
        </button>
      </div>
      <div style={{ width: "50%", padding: 20, overflow: "auto", background: colors.bg }}>
        <div style={labelStyle}>Aperçu</div>
        {Renderer && <Renderer block={previewBlock} accentColor={accentColor} />}
      </div>
    </div>
  );
}
