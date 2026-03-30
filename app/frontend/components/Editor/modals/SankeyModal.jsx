import { useState, useEffect, useCallback } from "react";
import { useEditorStore } from "../../../stores/editorStore";
import { blockRenderers } from "../blocks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { colors } from "../../../styles/tokens";
import { inputStyle, labelStyle, smallInput, tinyBtn, DEFAULT_COLORS } from "./shared";

export function SankeyEditor({ block }) {
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const accentColor = useEditorStore((s) => s.report?.accent_color) || colors.accentBright;
  const [title, setTitle] = useState(block.data?.title || "");
  const [nodes, setNodes] = useState(() => [...(block.data?.nodes || [])].map((n) => ({ ...n })));
  const [links, setLinks] = useState(() => [...(block.data?.links || [])].map((l) => ({ ...l })));

  const save = useCallback((t, n, l) => { updateBlock(block.id, { title: t, nodes: n, links: l }); }, [block.id, updateBlock]);
  useEffect(() => { save(title, nodes, links); }, [title, nodes, links, save]);

  const Renderer = blockRenderers["sankey-diagram"];
  const previewBlock = { ...block, data: { title, nodes, links } };

  return (
    <div style={{ display: "flex", height: "65vh" }}>
      <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 10, borderRight: `1px solid ${colors.border}`, overflow: "auto" }}>
        <div><div style={labelStyle}>Titre</div><input value={title} onChange={(e) => setTitle(e.target.value)} style={smallInput} /></div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={labelStyle}>Nœuds ({nodes.length})</div>
          <button onClick={() => setNodes((prev) => [...prev, { label: `N${prev.length + 1}`, color: DEFAULT_COLORS[prev.length % DEFAULT_COLORS.length] }])}
            style={{ ...tinyBtn, width: "auto", padding: "4px 10px", color: colors.accentBright, borderColor: colors.accentBright }}>
            <FontAwesomeIcon icon="plus" style={{ fontSize: 9, marginRight: 4 }} /> Nœud
          </button>
        </div>
        {nodes.map((n, i) => (
          <div key={i} style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 10, color: colors.text.muted, width: 16 }}>{i}</span>
            <input type="color" value={n.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]} onChange={(e) => setNodes((prev) => prev.map((nd, j) => j === i ? { ...nd, color: e.target.value } : nd))} style={{ width: 24, height: 24, border: "none", borderRadius: 6, cursor: "pointer", padding: 0 }} />
            <input value={n.label || ""} onChange={(e) => setNodes((prev) => prev.map((nd, j) => j === i ? { ...nd, label: e.target.value } : nd))} style={{ ...smallInput, flex: 1 }} />
            <button onClick={() => { setNodes((prev) => prev.filter((_, j) => j !== i)); setLinks((prev) => prev.filter((l) => l.source !== i && l.target !== i)); }} style={{ ...tinyBtn, color: colors.error }}><FontAwesomeIcon icon="trash" /></button>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <div style={labelStyle}>Liens ({links.length})</div>
          <button onClick={() => setLinks((prev) => [...prev, { source: 0, target: Math.min(1, nodes.length - 1), value: 10 }])}
            style={{ ...tinyBtn, width: "auto", padding: "4px 10px", color: colors.accentBright, borderColor: colors.accentBright }}>
            <FontAwesomeIcon icon="plus" style={{ fontSize: 9, marginRight: 4 }} /> Lien
          </button>
        </div>
        {links.map((l, i) => (
          <div key={i} style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <select value={l.source ?? 0} onChange={(e) => setLinks((prev) => prev.map((lk, j) => j === i ? { ...lk, source: Number(e.target.value) } : lk))}
              style={{ ...smallInput, width: 70, cursor: "pointer" }}>
              {nodes.map((n, ni) => <option key={ni} value={ni}>{n.label || `N${ni}`}</option>)}
            </select>
            <span style={{ fontSize: 11, color: colors.text.muted }}>→</span>
            <select value={l.target ?? 0} onChange={(e) => setLinks((prev) => prev.map((lk, j) => j === i ? { ...lk, target: Number(e.target.value) } : lk))}
              style={{ ...smallInput, width: 70, cursor: "pointer" }}>
              {nodes.map((n, ni) => <option key={ni} value={ni}>{n.label || `N${ni}`}</option>)}
            </select>
            <input type="number" value={l.value ?? 0} onChange={(e) => setLinks((prev) => prev.map((lk, j) => j === i ? { ...lk, value: Number(e.target.value) || 0 } : lk))} style={{ ...smallInput, width: 54, textAlign: "right" }} />
            <button onClick={() => setLinks((prev) => prev.filter((_, j) => j !== i))} style={{ ...tinyBtn, color: colors.error }}><FontAwesomeIcon icon="trash" /></button>
          </div>
        ))}
      </div>
      <div style={{ width: "50%", padding: 20, overflow: "auto", background: colors.bg }}>
        <div style={labelStyle}>Aperçu</div>
        {Renderer && <Renderer block={previewBlock} accentColor={accentColor} />}
      </div>
    </div>
  );
}
