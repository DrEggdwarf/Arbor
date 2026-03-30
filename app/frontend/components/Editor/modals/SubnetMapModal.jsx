import { useState, useEffect, useCallback } from "react";
import { useEditorStore } from "../../../stores/editorStore";
import { blockRenderers } from "../blocks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { colors } from "../../../styles/tokens";
import { labelStyle, smallInput, tinyBtn, splitLayout, editorSide, previewSide } from "./shared";

const STATUS_OPTIONS = ["used", "free", "reserved", "gateway", "broadcast"];

export function SubnetMapEditor({ block }) {
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const accentColor = useEditorStore((s) => s.report?.accent_color) || colors.accentBright;
  const [data, setData] = useState(() => ({ ...block.data }));

  const update = useCallback((patch) => setData((prev) => ({ ...prev, ...patch })), []);
  useEffect(() => { updateBlock(block.id, data); }, [data, block.id, updateBlock]);

  const addresses = data.addresses || [];
  const addAddr = () => update({ addresses: [...addresses, { ip: "", hostname: "", status: "free" }] });
  const removeAddr = (i) => update({ addresses: addresses.filter((_, j) => j !== i) });
  const updateAddr = (i, key, val) => update({ addresses: addresses.map((a, j) => j === i ? { ...a, [key]: val } : a) });

  const Renderer = blockRenderers["subnet-map"];
  const previewBlock = { ...block, data };

  return (
    <div style={splitLayout}>
      <div style={editorSide}>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Titre</div>
            <input value={data.title || ""} onChange={(e) => update({ title: e.target.value })} style={smallInput} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Colonnes</div>
            <input type="number" min={4} max={32} value={data.columns || 16} onChange={(e) => update({ columns: Number(e.target.value) || 16 })} style={smallInput} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Sous-réseau</div>
            <input value={data.subnet || ""} onChange={(e) => update({ subnet: e.target.value })} style={smallInput} placeholder="192.168.1.0/24" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Masque</div>
            <input value={data.mask || ""} onChange={(e) => update({ mask: e.target.value })} style={smallInput} placeholder="255.255.255.0" />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={labelStyle}>Adresses ({addresses.length})</div>
          <button onClick={addAddr} style={{ ...tinyBtn, width: "auto", padding: "3px 8px", color: colors.accentBright, borderColor: colors.accentBright }}>
            <FontAwesomeIcon icon="plus" style={{ fontSize: 9 }} /> Ajouter
          </button>
        </div>

        <div style={{ flex: 1, overflow: "auto" }}>
          {addresses.map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 3 }}>
              <input value={a.ip || ""} onChange={(e) => updateAddr(i, "ip", e.target.value)} placeholder="192.168.1.1" style={{ ...smallInput, flex: 1 }} />
              <input value={a.hostname || ""} onChange={(e) => updateAddr(i, "hostname", e.target.value)} placeholder="Hostname" style={{ ...smallInput, flex: 1 }} />
              <select value={a.status || "free"} onChange={(e) => updateAddr(i, "status", e.target.value)} style={{ ...smallInput, width: 80, cursor: "pointer" }}>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={() => removeAddr(i)} style={tinyBtn}>
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
