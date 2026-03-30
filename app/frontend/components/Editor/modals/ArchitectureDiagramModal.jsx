import { useState, useEffect, useCallback } from "react";
import { useEditorStore } from "../../../stores/editorStore";
import { blockRenderers } from "../blocks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { colors } from "../../../styles/tokens";
import { labelStyle, smallInput, tinyBtn, splitLayout, editorSide, previewSide, DEFAULT_COLORS } from "./shared";

const SHAPE_OPTIONS = [
  { value: "box", label: "Box" }, { value: "database", label: "Base de données" },
  { value: "cloud", label: "Cloud" }, { value: "user", label: "Utilisateur" },
  { value: "firewall", label: "Firewall" },
];

export function ArchitectureDiagramEditor({ block }) {
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const accentColor = useEditorStore((s) => s.report?.accent_color) || colors.accentBright;
  const [data, setData] = useState(() => ({ ...block.data }));

  const update = useCallback((patch) => setData((prev) => ({ ...prev, ...patch })), []);
  useEffect(() => { updateBlock(block.id, data); }, [data, block.id, updateBlock]);

  const nodes = data.nodes || [];
  const connections = data.connections || [];

  const addNode = () => update({ nodes: [...nodes, { id: String(Date.now()), label: "Composant", shape: "box", sublabel: "", color: DEFAULT_COLORS[nodes.length % DEFAULT_COLORS.length] }] });
  const removeNode = (i) => {
    const nid = nodes[i].id;
    update({
      nodes: nodes.filter((_, j) => j !== i),
      connections: connections.filter((c) => c.from !== nid && c.to !== nid),
    });
  };
  const updateNode = (i, key, val) => update({ nodes: nodes.map((n, j) => j === i ? { ...n, [key]: val } : n) });

  const addConn = () => {
    if (nodes.length < 2) return;
    update({ connections: [...connections, { from: nodes[0].id, to: nodes[1]?.id || nodes[0].id, label: "", dashed: false }] });
  };
  const removeConn = (i) => update({ connections: connections.filter((_, j) => j !== i) });
  const updateConn = (i, key, val) => update({ connections: connections.map((c, j) => j === i ? { ...c, [key]: val } : c) });

  const Renderer = blockRenderers["architecture-diagram"];
  const previewBlock = { ...block, data };

  return (
    <div style={splitLayout}>
      <div style={editorSide}>
        <div>
          <div style={labelStyle}>Titre</div>
          <input value={data.title || ""} onChange={(e) => update({ title: e.target.value })} style={smallInput} />
        </div>

        {/* Nodes */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={labelStyle}>Composants ({nodes.length})</div>
          <button onClick={addNode} style={{ ...tinyBtn, width: "auto", padding: "3px 8px", color: colors.accentBright, borderColor: colors.accentBright }}>
            <FontAwesomeIcon icon="plus" style={{ fontSize: 9 }} /> Composant
          </button>
        </div>

        <div style={{ maxHeight: 200, overflow: "auto" }}>
          {nodes.map((n, i) => (
            <div key={n.id} style={{ display: "flex", gap: 4, marginBottom: 3, alignItems: "center" }}>
              <input type="color" value={n.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
                onChange={(e) => updateNode(i, "color", e.target.value)}
                style={{ width: 24, height: 24, border: "none", cursor: "pointer", padding: 0 }} />
              <input value={n.label || ""} onChange={(e) => updateNode(i, "label", e.target.value)} placeholder="Label" style={{ ...smallInput, flex: 2 }} />
              <select value={n.shape || "box"} onChange={(e) => updateNode(i, "shape", e.target.value)} style={{ ...smallInput, flex: 1, cursor: "pointer" }}>
                {SHAPE_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <button onClick={() => removeNode(i)} style={tinyBtn}>
                <FontAwesomeIcon icon="times" style={{ fontSize: 9, color: colors.error }} />
              </button>
            </div>
          ))}
        </div>

        {/* Connections */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
          <div style={labelStyle}>Connexions ({connections.length})</div>
          <button onClick={addConn} disabled={nodes.length < 2} style={{
            ...tinyBtn, width: "auto", padding: "3px 8px",
            color: nodes.length < 2 ? colors.text.muted : colors.accentBright,
            borderColor: nodes.length < 2 ? colors.border : colors.accentBright,
            opacity: nodes.length < 2 ? 0.5 : 1,
          }}>
            <FontAwesomeIcon icon="plus" style={{ fontSize: 9 }} /> Lien
          </button>
        </div>

        <div style={{ flex: 1, overflow: "auto" }}>
          {connections.map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 4, marginBottom: 3, alignItems: "center" }}>
              <select value={c.from || ""} onChange={(e) => updateConn(i, "from", e.target.value)} style={{ ...smallInput, flex: 1, cursor: "pointer" }}>
                {nodes.map((n) => <option key={n.id} value={n.id}>{n.label || n.id}</option>)}
              </select>
              <span style={{ fontSize: 10, color: colors.text.muted }}>→</span>
              <select value={c.to || ""} onChange={(e) => updateConn(i, "to", e.target.value)} style={{ ...smallInput, flex: 1, cursor: "pointer" }}>
                {nodes.map((n) => <option key={n.id} value={n.id}>{n.label || n.id}</option>)}
              </select>
              <input value={c.label || ""} onChange={(e) => updateConn(i, "label", e.target.value)} placeholder="Label" style={{ ...smallInput, flex: 1 }} />
              <button onClick={() => removeConn(i)} style={tinyBtn}>
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
