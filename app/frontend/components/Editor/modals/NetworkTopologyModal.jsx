import { useState, useEffect, useCallback } from "react";
import { useEditorStore } from "../../../stores/editorStore";
import { blockRenderers } from "../blocks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { colors } from "../../../styles/tokens";
import { labelStyle, smallInput, tinyBtn, splitLayout, editorSide, previewSide, DEFAULT_COLORS } from "./shared";

const DEVICE_TYPES = [
  { value: "server", label: "Serveur" }, { value: "router", label: "Routeur" },
  { value: "switch", label: "Switch" }, { value: "firewall", label: "Firewall" },
  { value: "workstation", label: "Poste" }, { value: "cloud", label: "Cloud" },
  { value: "database", label: "Base de données" }, { value: "printer", label: "Imprimante" },
  { value: "phone", label: "Téléphone" }, { value: "ap", label: "Point d'accès" },
];

export function NetworkTopologyEditor({ block }) {
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const accentColor = useEditorStore((s) => s.report?.accent_color) || colors.accentBright;
  const [data, setData] = useState(() => ({ ...block.data }));

  const update = useCallback((patch) => setData((prev) => ({ ...prev, ...patch })), []);
  useEffect(() => { updateBlock(block.id, data); }, [data, block.id, updateBlock]);

  const devices = data.devices || [];
  const flows = data.flows || [];
  const zones = data.zones || [];

  // Devices
  const addDevice = () => update({
    devices: [...devices, {
      id: String(Date.now()),
      label: "Device",
      type: "server",
      ip: "",
      col: Math.floor(devices.length % 4) * 2,
      row: Math.floor(devices.length / 4) * 2,
      zone: zones[0]?.id || "",
      color: "",
    }],
  });
  const removeDevice = (i) => {
    const did = devices[i].id;
    update({
      devices: devices.filter((_, j) => j !== i),
      flows: flows.filter((f) => f.from !== did && f.to !== did),
    });
  };
  const updateDevice = (i, key, val) => update({
    devices: devices.map((d, j) => j === i ? { ...d, [key]: ["col", "row"].includes(key) ? Number(val) || 0 : val } : d),
  });

  // Flows
  const addFlow = () => {
    if (devices.length < 2) return;
    update({ flows: [...flows, { from: devices[0].id, to: devices[1]?.id || devices[0].id, label: "", bandwidth: 10 }] });
  };
  const removeFlow = (i) => update({ flows: flows.filter((_, j) => j !== i) });
  const updateFlow = (i, key, val) => update({
    flows: flows.map((f, j) => j === i ? { ...f, [key]: key === "bandwidth" ? Number(val) || 0 : val } : f),
  });

  // Zones
  const addZone = () => update({ zones: [...zones, { id: String(Date.now()), label: "Zone", color: DEFAULT_COLORS[zones.length % DEFAULT_COLORS.length] }] });
  const removeZone = (i) => update({ zones: zones.filter((_, j) => j !== i) });
  const updateZone = (i, key, val) => update({ zones: zones.map((z, j) => j === i ? { ...z, [key]: val } : z) });

  const Renderer = blockRenderers["network-topology"];
  const previewBlock = { ...block, data };

  return (
    <div style={splitLayout}>
      <div style={editorSide}>
        <div>
          <div style={labelStyle}>Titre</div>
          <input value={data.title || ""} onChange={(e) => update({ title: e.target.value })} style={smallInput} />
        </div>

        {/* Zones */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={labelStyle}>Zones ({zones.length})</div>
          <button onClick={addZone} style={{ ...tinyBtn, width: "auto", padding: "3px 8px", color: colors.accentBright, borderColor: colors.accentBright }}>
            <FontAwesomeIcon icon="plus" style={{ fontSize: 9 }} /> Zone
          </button>
        </div>
        <div style={{ maxHeight: 80, overflow: "auto" }}>
          {zones.map((z, i) => (
            <div key={z.id} style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 2 }}>
              <input type="color" value={z.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
                onChange={(e) => updateZone(i, "color", e.target.value)}
                style={{ width: 20, height: 20, border: "none", cursor: "pointer", padding: 0 }} />
              <input value={z.label || ""} onChange={(e) => updateZone(i, "label", e.target.value)} placeholder="Nom" style={{ ...smallInput, flex: 1 }} />
              <button onClick={() => removeZone(i)} style={{ ...tinyBtn, width: 20, height: 20 }}>
                <FontAwesomeIcon icon="times" style={{ fontSize: 8, color: colors.error }} />
              </button>
            </div>
          ))}
        </div>

        {/* Devices */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={labelStyle}>Appareils ({devices.length})</div>
          <button onClick={addDevice} style={{ ...tinyBtn, width: "auto", padding: "3px 8px", color: colors.accentBright, borderColor: colors.accentBright }}>
            <FontAwesomeIcon icon="plus" style={{ fontSize: 9 }} /> Appareil
          </button>
        </div>

        <div style={{ maxHeight: 200, overflow: "auto" }}>
          {devices.map((dev, i) => (
            <div key={dev.id} style={{ padding: "4px 0", borderBottom: `1px solid ${colors.border}` }}>
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <select value={dev.type || "server"} onChange={(e) => updateDevice(i, "type", e.target.value)}
                  style={{ ...smallInput, width: 80, cursor: "pointer" }}>
                  {DEVICE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                <input value={dev.label || ""} onChange={(e) => updateDevice(i, "label", e.target.value)} placeholder="Label" style={{ ...smallInput, flex: 1 }} />
                <input value={dev.ip || ""} onChange={(e) => updateDevice(i, "ip", e.target.value)} placeholder="IP" style={{ ...smallInput, width: 100 }} />
                <button onClick={() => removeDevice(i)} style={tinyBtn}>
                  <FontAwesomeIcon icon="times" style={{ fontSize: 9, color: colors.error }} />
                </button>
              </div>
              <div style={{ display: "flex", gap: 4, marginTop: 2 }}>
                <span style={{ fontSize: 9, color: colors.text.muted, paddingTop: 4 }}>Pos:</span>
                <input type="number" value={dev.col ?? 0} onChange={(e) => updateDevice(i, "col", e.target.value)} placeholder="Col" style={{ ...smallInput, width: 45 }} />
                <input type="number" value={dev.row ?? 0} onChange={(e) => updateDevice(i, "row", e.target.value)} placeholder="Row" style={{ ...smallInput, width: 45 }} />
                {zones.length > 0 && (
                  <select value={dev.zone || ""} onChange={(e) => updateDevice(i, "zone", e.target.value)}
                    style={{ ...smallInput, flex: 1, cursor: "pointer" }}>
                    <option value="">Sans zone</option>
                    {zones.map((z) => <option key={z.id} value={z.id}>{z.label}</option>)}
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Flows */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
          <div style={labelStyle}>Flux ({flows.length})</div>
          <button onClick={addFlow} disabled={devices.length < 2} style={{
            ...tinyBtn, width: "auto", padding: "3px 8px",
            color: devices.length < 2 ? colors.text.muted : colors.accentBright,
            borderColor: devices.length < 2 ? colors.border : colors.accentBright,
            opacity: devices.length < 2 ? 0.5 : 1,
          }}>
            <FontAwesomeIcon icon="plus" style={{ fontSize: 9 }} /> Flux
          </button>
        </div>

        <div style={{ flex: 1, overflow: "auto" }}>
          {flows.map((f, i) => (
            <div key={i} style={{ display: "flex", gap: 4, marginBottom: 3, alignItems: "center" }}>
              <select value={f.from || ""} onChange={(e) => updateFlow(i, "from", e.target.value)}
                style={{ ...smallInput, flex: 1, cursor: "pointer" }}>
                {devices.map((d) => <option key={d.id} value={d.id}>{d.label || d.id}</option>)}
              </select>
              <span style={{ fontSize: 10, color: colors.text.muted }}>→</span>
              <select value={f.to || ""} onChange={(e) => updateFlow(i, "to", e.target.value)}
                style={{ ...smallInput, flex: 1, cursor: "pointer" }}>
                {devices.map((d) => <option key={d.id} value={d.id}>{d.label || d.id}</option>)}
              </select>
              <input type="number" value={f.bandwidth ?? 10} onChange={(e) => updateFlow(i, "bandwidth", e.target.value)}
                placeholder="BW" style={{ ...smallInput, width: 50 }} />
              <input value={f.label || ""} onChange={(e) => updateFlow(i, "label", e.target.value)}
                placeholder="Label" style={{ ...smallInput, flex: 1 }} />
              <button onClick={() => removeFlow(i)} style={tinyBtn}>
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
