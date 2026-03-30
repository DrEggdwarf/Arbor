import { useState, useEffect, useCallback } from "react";
import { useEditorStore } from "../../../stores/editorStore";
import { blockRenderers } from "../blocks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { colors } from "../../../styles/tokens";
import { labelStyle, smallInput, tinyBtn, splitLayout, editorSide, previewSide, DEFAULT_COLORS } from "./shared";

export function VlanDiagramEditor({ block }) {
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const accentColor = useEditorStore((s) => s.report?.accent_color) || colors.accentBright;
  const [data, setData] = useState(() => ({ ...block.data }));

  const update = useCallback((patch) => setData((prev) => ({ ...prev, ...patch })), []);
  useEffect(() => { updateBlock(block.id, data); }, [data, block.id, updateBlock]);

  const vlans = data.vlans || [];
  const connections = data.connections || [];

  const addVlan = () => update({ vlans: [...vlans, { id: vlans.length + 10, name: "", subnet: "", color: DEFAULT_COLORS[vlans.length % DEFAULT_COLORS.length], machines: [] }] });
  const removeVlan = (i) => {
    const vid = String(vlans[i]?.id);
    update({
      vlans: vlans.filter((_, j) => j !== i),
      connections: connections.filter((c) => String(c.from) !== vid && String(c.to) !== vid),
    });
  };
  const updateVlan = (i, key, val) => update({ vlans: vlans.map((v, j) => j === i ? { ...v, [key]: val } : v) });

  const addMachine = (vi) => {
    const newVlans = vlans.map((v, j) => j === vi ? { ...v, machines: [...(v.machines || []), { name: "", ip: "" }] } : v);
    update({ vlans: newVlans });
  };
  const removeMachine = (vi, mi) => {
    const newVlans = vlans.map((v, j) => j === vi ? { ...v, machines: (v.machines || []).filter((_, k) => k !== mi) } : v);
    update({ vlans: newVlans });
  };
  const updateMachine = (vi, mi, key, val) => {
    const newVlans = vlans.map((v, j) => j === vi ? {
      ...v, machines: (v.machines || []).map((m, k) => k === mi ? { ...m, [key]: val } : m),
    } : v);
    update({ vlans: newVlans });
  };

  const addConnection = () => {
    if (vlans.length < 2) return;
    update({ connections: [...connections, { from: vlans[0]?.id, to: vlans[1]?.id, label: "" }] });
  };
  const removeConn = (i) => update({ connections: connections.filter((_, j) => j !== i) });
  const updateConn = (i, key, val) => update({ connections: connections.map((c, j) => j === i ? { ...c, [key]: val } : c) });

  const Renderer = blockRenderers["vlan-diagram"];
  const previewBlock = { ...block, data };

  return (
    <div style={splitLayout}>
      <div style={editorSide}>
        <div>
          <div style={labelStyle}>Titre</div>
          <input value={data.title || ""} onChange={(e) => update({ title: e.target.value })} style={smallInput} />
        </div>

        {/* VLANs */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={labelStyle}>VLANs ({vlans.length})</div>
          <button onClick={addVlan} style={{ ...tinyBtn, width: "auto", padding: "3px 8px", color: colors.accentBright, borderColor: colors.accentBright }}>
            <FontAwesomeIcon icon="plus" style={{ fontSize: 9 }} /> VLAN
          </button>
        </div>

        <div style={{ maxHeight: 300, overflow: "auto" }}>
          {vlans.map((v, vi) => (
            <div key={vi} style={{ padding: "8px 0", borderBottom: `1px solid ${colors.border}` }}>
              <div style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 4 }}>
                <input type="color" value={v.color || DEFAULT_COLORS[vi % DEFAULT_COLORS.length]}
                  onChange={(e) => updateVlan(vi, "color", e.target.value)}
                  style={{ width: 24, height: 24, border: "none", cursor: "pointer", padding: 0 }} />
                <input type="number" value={v.id ?? ""} onChange={(e) => updateVlan(vi, "id", Number(e.target.value) || 0)} placeholder="ID" style={{ ...smallInput, width: 50 }} />
                <input value={v.name || ""} onChange={(e) => updateVlan(vi, "name", e.target.value)} placeholder="Nom" style={{ ...smallInput, flex: 1 }} />
                <input value={v.subnet || ""} onChange={(e) => updateVlan(vi, "subnet", e.target.value)} placeholder="Subnet" style={{ ...smallInput, flex: 1 }} />
                <button onClick={() => removeVlan(vi)} style={tinyBtn}>
                  <FontAwesomeIcon icon="times" style={{ fontSize: 9, color: colors.error }} />
                </button>
              </div>
              {/* Machines */}
              <div style={{ marginLeft: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 9, color: colors.text.muted }}>Machines ({(v.machines || []).length})</span>
                  <button onClick={() => addMachine(vi)} style={{ ...tinyBtn, width: "auto", padding: "2px 6px", fontSize: 9 }}>
                    <FontAwesomeIcon icon="plus" style={{ fontSize: 8 }} />
                  </button>
                </div>
                {(v.machines || []).map((m, mi) => (
                  <div key={mi} style={{ display: "flex", gap: 4, alignItems: "center", marginTop: 2 }}>
                    <input value={m.name || ""} onChange={(e) => updateMachine(vi, mi, "name", e.target.value)} placeholder="Nom" style={{ ...smallInput, flex: 1, fontSize: 10 }} />
                    <input value={m.ip || ""} onChange={(e) => updateMachine(vi, mi, "ip", e.target.value)} placeholder="IP" style={{ ...smallInput, flex: 1, fontSize: 10 }} />
                    <button onClick={() => removeMachine(vi, mi)} style={{ ...tinyBtn, width: 18, height: 18 }}>
                      <FontAwesomeIcon icon="times" style={{ fontSize: 8, color: colors.error }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Connections */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <div style={labelStyle}>Connexions inter-VLAN ({connections.length})</div>
          <button onClick={addConnection} disabled={vlans.length < 2} style={{
            ...tinyBtn, width: "auto", padding: "3px 8px",
            color: vlans.length < 2 ? colors.text.muted : colors.accentBright,
            borderColor: vlans.length < 2 ? colors.border : colors.accentBright,
            opacity: vlans.length < 2 ? 0.5 : 1,
          }}>
            <FontAwesomeIcon icon="plus" style={{ fontSize: 9 }} /> Lien
          </button>
        </div>

        {connections.map((c, ci) => (
          <div key={ci} style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 3 }}>
            <select value={c.from ?? ""} onChange={(e) => updateConn(ci, "from", e.target.value)} style={{ ...smallInput, flex: 1, cursor: "pointer" }}>
              {vlans.map((v) => <option key={v.id} value={v.id}>VLAN {v.id}</option>)}
            </select>
            <span style={{ fontSize: 10, color: colors.text.muted }}>↔</span>
            <select value={c.to ?? ""} onChange={(e) => updateConn(ci, "to", e.target.value)} style={{ ...smallInput, flex: 1, cursor: "pointer" }}>
              {vlans.map((v) => <option key={v.id} value={v.id}>VLAN {v.id}</option>)}
            </select>
            <input value={c.label || ""} onChange={(e) => updateConn(ci, "label", e.target.value)} placeholder="Label" style={{ ...smallInput, flex: 1 }} />
            <button onClick={() => removeConn(ci)} style={tinyBtn}>
              <FontAwesomeIcon icon="times" style={{ fontSize: 9, color: colors.error }} />
            </button>
          </div>
        ))}
      </div>

      <div style={previewSide}>
        <div style={labelStyle}>Aperçu</div>
        {Renderer && <Renderer block={previewBlock} accentColor={accentColor} />}
      </div>
    </div>
  );
}
