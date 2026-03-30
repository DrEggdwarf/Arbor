import { useState, useEffect, useCallback } from "react";
import { useEditorStore } from "../../../stores/editorStore";
import { blockRenderers } from "../blocks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { colors } from "../../../styles/tokens";
import { labelStyle, smallInput, tinyBtn, splitLayout, editorSide, previewSide, DEFAULT_COLORS } from "./shared";

const PROTO_OPTIONS = ["TCP", "UDP", "ICMP", "HTTP", "HTTPS", "DNS", "SSH", "RDP", "SMTP", "FTP"];

export function NetworkFlowEditor({ block }) {
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const accentColor = useEditorStore((s) => s.report?.accent_color) || colors.accentBright;
  const [data, setData] = useState(() => ({ ...block.data }));

  const update = useCallback((patch) => setData((prev) => ({ ...prev, ...patch })), []);
  useEffect(() => { updateBlock(block.id, data); }, [data, block.id, updateBlock]);

  const nodes = data.nodes || [];
  const links = data.links || [];

  const addNode = () => update({ nodes: [...nodes, { label: `Host ${nodes.length + 1}`, color: DEFAULT_COLORS[nodes.length % DEFAULT_COLORS.length], sublabel: "" }] });
  const removeNode = (i) => update({
    nodes: nodes.filter((_, j) => j !== i),
    links: links.filter((l) => l.source !== i && l.target !== i),
  });
  const updateNode = (i, key, val) => update({ nodes: nodes.map((n, j) => j === i ? { ...n, [key]: val } : n) });

  const addLink = () => {
    if (nodes.length < 2) return;
    update({ links: [...links, { source: 0, target: Math.min(1, nodes.length - 1), value: 100, protocol: "TCP" }] });
  };
  const removeLink = (i) => update({ links: links.filter((_, j) => j !== i) });
  const updateLink = (i, key, val) => update({
    links: links.map((l, j) => j === i ? { ...l, [key]: ["source", "target", "value"].includes(key) ? Number(val) || 0 : val } : l),
  });

  const Renderer = blockRenderers["network-flow"];
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
          <div style={labelStyle}>Hôtes ({nodes.length})</div>
          <button onClick={addNode} style={{ ...tinyBtn, width: "auto", padding: "3px 8px", color: colors.accentBright, borderColor: colors.accentBright }}>
            <FontAwesomeIcon icon="plus" style={{ fontSize: 9 }} /> Hôte
          </button>
        </div>
        <div style={{ maxHeight: 140, overflow: "auto" }}>
          {nodes.map((n, i) => (
            <div key={i} style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 2 }}>
              <span style={{ fontSize: 9, color: colors.text.muted, width: 14 }}>{i}</span>
              <input type="color" value={n.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
                onChange={(e) => updateNode(i, "color", e.target.value)}
                style={{ width: 22, height: 22, border: "none", cursor: "pointer", padding: 0 }} />
              <input value={n.label || ""} onChange={(e) => updateNode(i, "label", e.target.value)} placeholder="Label" style={{ ...smallInput, flex: 1 }} />
              <input value={n.sublabel || ""} onChange={(e) => updateNode(i, "sublabel", e.target.value)} placeholder="IP/port" style={{ ...smallInput, flex: 1 }} />
              <button onClick={() => removeNode(i)} style={tinyBtn}>
                <FontAwesomeIcon icon="times" style={{ fontSize: 9, color: colors.error }} />
              </button>
            </div>
          ))}
        </div>

        {/* Links */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
          <div style={labelStyle}>Flux ({links.length})</div>
          <button onClick={addLink} disabled={nodes.length < 2} style={{
            ...tinyBtn, width: "auto", padding: "3px 8px",
            color: nodes.length < 2 ? colors.text.muted : colors.accentBright,
            borderColor: nodes.length < 2 ? colors.border : colors.accentBright,
            opacity: nodes.length < 2 ? 0.5 : 1,
          }}>
            <FontAwesomeIcon icon="plus" style={{ fontSize: 9 }} /> Flux
          </button>
        </div>
        <div style={{ flex: 1, overflow: "auto" }}>
          {links.map((l, i) => (
            <div key={i} style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 3 }}>
              <select value={l.source ?? 0} onChange={(e) => updateLink(i, "source", e.target.value)}
                style={{ ...smallInput, width: 80, cursor: "pointer" }}>
                {nodes.map((n, ni) => <option key={ni} value={ni}>{n.label || `N${ni}`}</option>)}
              </select>
              <span style={{ fontSize: 10, color: colors.text.muted }}>→</span>
              <select value={l.target ?? 0} onChange={(e) => updateLink(i, "target", e.target.value)}
                style={{ ...smallInput, width: 80, cursor: "pointer" }}>
                {nodes.map((n, ni) => <option key={ni} value={ni}>{n.label || `N${ni}`}</option>)}
              </select>
              <input type="number" value={l.value ?? 0} onChange={(e) => updateLink(i, "value", e.target.value)}
                placeholder="Vol." style={{ ...smallInput, width: 50, textAlign: "right" }} />
              <select value={l.protocol || "TCP"} onChange={(e) => updateLink(i, "protocol", e.target.value)}
                style={{ ...smallInput, width: 60, cursor: "pointer" }}>
                {PROTO_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <button onClick={() => removeLink(i)} style={tinyBtn}>
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
