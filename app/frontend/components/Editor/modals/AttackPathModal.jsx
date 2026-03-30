import { useState, useEffect, useCallback } from "react";
import { useEditorStore } from "../../../stores/editorStore";
import { blockRenderers } from "../blocks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { colors, typography } from "../../../styles/tokens";
import { inputStyle, labelStyle, smallInput, tinyBtn, splitLayout, editorSide, previewSide, DEFAULT_COLORS } from "./shared";

const NODE_TYPES = [
  { value: "entry", label: "Entrée" }, { value: "server", label: "Serveur" },
  { value: "database", label: "Base de données" }, { value: "user", label: "Utilisateur" },
  { value: "target", label: "Cible" }, { value: "service", label: "Service" },
];

export function AttackPathEditor({ block }) {
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const accentColor = useEditorStore((s) => s.report?.accent_color) || colors.accentBright;
  const [data, setData] = useState(() => ({ ...block.data }));

  const update = useCallback((patch) => setData((prev) => ({ ...prev, ...patch })), []);
  useEffect(() => { updateBlock(block.id, data); }, [data, block.id, updateBlock]);

  const nodes = data.nodes || [];
  const edges = data.edges || [];

  const addNode = () => update({ nodes: [...nodes, { id: String(Date.now()), label: "Node", type: "server", color: DEFAULT_COLORS[nodes.length % DEFAULT_COLORS.length] }] });
  const removeNode = (i) => {
    const nodeId = nodes[i].id;
    update({
      nodes: nodes.filter((_, j) => j !== i),
      edges: edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
    });
  };
  const updateNode = (i, key, val) => update({ nodes: nodes.map((n, j) => j === i ? { ...n, [key]: val } : n) });

  const addEdge = () => {
    if (nodes.length < 2) return;
    update({ edges: [...edges, { source: nodes[0].id, target: nodes[1]?.id || nodes[0].id, label: "" }] });
  };
  const removeEdge = (i) => update({ edges: edges.filter((_, j) => j !== i) });
  const updateEdge = (i, key, val) => update({ edges: edges.map((e, j) => j === i ? { ...e, [key]: val } : e) });

  const Renderer = blockRenderers["attack-path"];
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
          <div style={labelStyle}>Nœuds ({nodes.length})</div>
          <button onClick={addNode} style={{ ...tinyBtn, width: "auto", padding: "3px 8px", color: colors.accentBright, borderColor: colors.accentBright }}>
            <FontAwesomeIcon icon="plus" style={{ fontSize: 9 }} /> Nœud
          </button>
        </div>

        <div style={{ maxHeight: 200, overflow: "auto" }}>
          {nodes.map((node, i) => (
            <div key={node.id} style={{ display: "flex", gap: 4, marginBottom: 3, alignItems: "center" }}>
              <input type="color" value={node.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]} onChange={(e) => updateNode(i, "color", e.target.value)}
                style={{ width: 24, height: 24, border: "none", cursor: "pointer", padding: 0, flexShrink: 0 }} />
              <input value={node.label || ""} onChange={(e) => updateNode(i, "label", e.target.value)} placeholder="Label" style={{ ...smallInput, flex: 2 }} />
              <select value={node.type || "server"} onChange={(e) => updateNode(i, "type", e.target.value)} style={{ ...smallInput, flex: 1, cursor: "pointer" }}>
                {NODE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <button onClick={() => removeNode(i)} style={tinyBtn}>
                <FontAwesomeIcon icon="times" style={{ fontSize: 9, color: colors.error }} />
              </button>
            </div>
          ))}
        </div>

        {/* Edges */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
          <div style={labelStyle}>Arêtes ({edges.length})</div>
          <button onClick={addEdge} disabled={nodes.length < 2} style={{
            ...tinyBtn, width: "auto", padding: "3px 8px",
            color: nodes.length < 2 ? colors.text.muted : colors.accentBright,
            borderColor: nodes.length < 2 ? colors.border : colors.accentBright,
            opacity: nodes.length < 2 ? 0.5 : 1,
          }}>
            <FontAwesomeIcon icon="plus" style={{ fontSize: 9 }} /> Arête
          </button>
        </div>

        <div style={{ flex: 1, overflow: "auto" }}>
          {edges.map((edge, i) => (
            <div key={i} style={{ display: "flex", gap: 4, marginBottom: 3, alignItems: "center" }}>
              <select value={edge.source || ""} onChange={(e) => updateEdge(i, "source", e.target.value)} style={{ ...smallInput, flex: 1, cursor: "pointer" }}>
                {nodes.map((n) => <option key={n.id} value={n.id}>{n.label || n.id}</option>)}
              </select>
              <span style={{ fontSize: 10, color: colors.text.muted }}>→</span>
              <select value={edge.target || ""} onChange={(e) => updateEdge(i, "target", e.target.value)} style={{ ...smallInput, flex: 1, cursor: "pointer" }}>
                {nodes.map((n) => <option key={n.id} value={n.id}>{n.label || n.id}</option>)}
              </select>
              <input value={edge.label || ""} onChange={(e) => updateEdge(i, "label", e.target.value)} placeholder="Label" style={{ ...smallInput, flex: 1 }} />
              <button onClick={() => removeEdge(i)} style={tinyBtn}>
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
