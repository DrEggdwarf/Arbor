import { useState, useEffect, useCallback } from "react";
import { useEditorStore } from "../../../stores/editorStore";
import { blockRenderers } from "../blocks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { colors } from "../../../styles/tokens";
import { labelStyle, smallInput, tinyBtn, splitLayout, editorSide, previewSide, DEFAULT_COLORS } from "./shared";

const SERVICE_TYPES = [
  "compute", "storage", "database", "network", "security",
  "cdn", "dns", "loadbalancer", "queue", "function", "container", "monitoring",
];

export function CloudArchitectureEditor({ block }) {
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const accentColor = useEditorStore((s) => s.report?.accent_color) || colors.accentBright;
  const [data, setData] = useState(() => ({ ...block.data }));

  const update = useCallback((patch) => setData((prev) => ({ ...prev, ...patch })), []);
  useEffect(() => { updateBlock(block.id, data); }, [data, block.id, updateBlock]);

  const services = data.services || [];
  const connections = data.connections || [];
  const zones = data.zones || [];

  const addService = () => update({ services: [...services, { id: String(Date.now()), label: "Service", type: "compute", sublabel: "" }] });
  const removeService = (i) => {
    const sid = services[i].id;
    update({
      services: services.filter((_, j) => j !== i),
      connections: connections.filter((c) => c.from !== sid && c.to !== sid),
    });
  };
  const updateService = (i, key, val) => update({ services: services.map((s, j) => j === i ? { ...s, [key]: val } : s) });

  const addConn = () => {
    if (services.length < 2) return;
    update({ connections: [...connections, { from: services[0].id, to: services[1]?.id || services[0].id, label: "" }] });
  };
  const removeConn = (i) => update({ connections: connections.filter((_, j) => j !== i) });
  const updateConn = (i, key, val) => update({ connections: connections.map((c, j) => j === i ? { ...c, [key]: val } : c) });

  const addZone = () => update({ zones: [...zones, { label: "Zone", color: DEFAULT_COLORS[zones.length % DEFAULT_COLORS.length] }] });
  const removeZone = (i) => update({ zones: zones.filter((_, j) => j !== i) });
  const updateZone = (i, key, val) => update({ zones: zones.map((z, j) => j === i ? { ...z, [key]: val } : z) });

  const Renderer = blockRenderers["cloud-architecture"];
  const previewBlock = { ...block, data };

  return (
    <div style={splitLayout}>
      <div style={editorSide}>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Titre</div>
            <input value={data.title || ""} onChange={(e) => update({ title: e.target.value })} style={smallInput} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Fournisseur</div>
            <input value={data.provider || ""} onChange={(e) => update({ provider: e.target.value })} placeholder="AWS / Azure / GCP" style={smallInput} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Région</div>
            <input value={data.region || ""} onChange={(e) => update({ region: e.target.value })} placeholder="eu-west-1" style={smallInput} />
          </div>
        </div>

        {/* Services */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={labelStyle}>Services ({services.length})</div>
          <button onClick={addService} style={{ ...tinyBtn, width: "auto", padding: "3px 8px", color: colors.accentBright, borderColor: colors.accentBright }}>
            <FontAwesomeIcon icon="plus" style={{ fontSize: 9 }} /> Service
          </button>
        </div>

        <div style={{ maxHeight: 160, overflow: "auto" }}>
          {services.map((s, i) => (
            <div key={s.id} style={{ display: "flex", gap: 4, marginBottom: 3, alignItems: "center" }}>
              <select value={s.type || "compute"} onChange={(e) => updateService(i, "type", e.target.value)} style={{ ...smallInput, width: 90, cursor: "pointer" }}>
                {SERVICE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <input value={s.label || ""} onChange={(e) => updateService(i, "label", e.target.value)} placeholder="Label" style={{ ...smallInput, flex: 1 }} />
              <input value={s.sublabel || ""} onChange={(e) => updateService(i, "sublabel", e.target.value)} placeholder="Détail" style={{ ...smallInput, flex: 1 }} />
              <button onClick={() => removeService(i)} style={tinyBtn}>
                <FontAwesomeIcon icon="times" style={{ fontSize: 9, color: colors.error }} />
              </button>
            </div>
          ))}
        </div>

        {/* Connections */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
          <div style={labelStyle}>Connexions ({connections.length})</div>
          <button onClick={addConn} disabled={services.length < 2} style={{
            ...tinyBtn, width: "auto", padding: "3px 8px",
            color: services.length < 2 ? colors.text.muted : colors.accentBright,
            borderColor: services.length < 2 ? colors.border : colors.accentBright,
            opacity: services.length < 2 ? 0.5 : 1,
          }}>
            <FontAwesomeIcon icon="plus" style={{ fontSize: 9 }} /> Lien
          </button>
        </div>

        <div style={{ maxHeight: 100, overflow: "auto" }}>
          {connections.map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 4, marginBottom: 3, alignItems: "center" }}>
              <select value={c.from || ""} onChange={(e) => updateConn(i, "from", e.target.value)} style={{ ...smallInput, flex: 1, cursor: "pointer" }}>
                {services.map((s) => <option key={s.id} value={s.id}>{s.label || s.id}</option>)}
              </select>
              <span style={{ fontSize: 10, color: colors.text.muted }}>→</span>
              <select value={c.to || ""} onChange={(e) => updateConn(i, "to", e.target.value)} style={{ ...smallInput, flex: 1, cursor: "pointer" }}>
                {services.map((s) => <option key={s.id} value={s.id}>{s.label || s.id}</option>)}
              </select>
              <input value={c.label || ""} onChange={(e) => updateConn(i, "label", e.target.value)} placeholder="Label" style={{ ...smallInput, flex: 1 }} />
              <button onClick={() => removeConn(i)} style={tinyBtn}>
                <FontAwesomeIcon icon="times" style={{ fontSize: 9, color: colors.error }} />
              </button>
            </div>
          ))}
        </div>

        {/* Zones */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
          <div style={labelStyle}>Zones ({zones.length})</div>
          <button onClick={addZone} style={{ ...tinyBtn, width: "auto", padding: "3px 8px", color: colors.accentBright, borderColor: colors.accentBright }}>
            <FontAwesomeIcon icon="plus" style={{ fontSize: 9 }} /> Zone
          </button>
        </div>

        {zones.map((z, i) => (
          <div key={i} style={{ display: "flex", gap: 4, marginBottom: 3, alignItems: "center" }}>
            <input type="color" value={z.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
              onChange={(e) => updateZone(i, "color", e.target.value)}
              style={{ width: 24, height: 24, border: "none", cursor: "pointer", padding: 0 }} />
            <input value={z.label || ""} onChange={(e) => updateZone(i, "label", e.target.value)} placeholder="Nom zone" style={{ ...smallInput, flex: 1 }} />
            <button onClick={() => removeZone(i)} style={tinyBtn}>
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
