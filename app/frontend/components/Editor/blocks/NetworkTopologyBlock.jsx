import { useMemo } from "react";
import { colors, typography, radii } from "../../../styles/tokens";
import { PALETTE } from "../../../lib/chartUtils";

/**
 * Isometric transform helpers.
 * Convert grid (col, row) to isometric screen (x, y).
 */
const ISO_ANGLE = Math.PI / 6; // 30°
const COS = Math.cos(ISO_ANGLE);
const SIN = Math.sin(ISO_ANGLE);
const TILE_W = 64;
const TILE_H = 32;

function toIso(col, row) {
  return {
    x: (col - row) * (TILE_W / 2),
    y: (col + row) * (TILE_H / 2),
  };
}

/* Device shapes drawn in isometric style */
const DEVICE_TYPES = {
  server:     { color: "#3498db", label: "SRV" },
  router:     { color: "#e67e22", label: "RTR" },
  switch:     { color: "#27ae60", label: "SW" },
  firewall:   { color: "#e74c3c", label: "FW" },
  workstation:{ color: "#9b59b6", label: "PC" },
  cloud:      { color: "#1abc9c", label: "☁" },
  database:   { color: "#34495e", label: "DB" },
  printer:    { color: "#95a5a6", label: "PRN" },
  phone:      { color: "#2980b9", label: "TEL" },
  ap:         { color: "#f39c12", label: "AP" },
};

function DeviceNode({ device, x, y }) {
  const meta = DEVICE_TYPES[device.type] || DEVICE_TYPES.server;
  const color = device.color || meta.color;
  const w = 48, h = 32;

  // Isometric box (3 faces)
  const topPts = `${x},${y - h} ${x + w / 2},${y - h + 12} ${x},${y - h + 24} ${x - w / 2},${y - h + 12}`;
  const leftPts = `${x - w / 2},${y - h + 12} ${x},${y - h + 24} ${x},${y} ${x - w / 2},${y - 12}`;
  const rightPts = `${x + w / 2},${y - h + 12} ${x},${y - h + 24} ${x},${y} ${x + w / 2},${y - 12}`;

  return (
    <g>
      {/* Shadow */}
      <ellipse cx={x} cy={y + 2} rx={22} ry={6} fill="rgba(0,0,0,0.08)" />
      {/* Iso box */}
      <polygon points={topPts} fill={`${color}40`} stroke={color} strokeWidth={1.2} />
      <polygon points={leftPts} fill={`${color}25`} stroke={color} strokeWidth={1} />
      <polygon points={rightPts} fill={`${color}15`} stroke={color} strokeWidth={1} />
      {/* Type abbreviation on top face */}
      <text x={x} y={y - h + 16} textAnchor="middle" fontSize={10} fontWeight={700}
        fill={color} fontFamily={typography.fontFamily.body}>
        {meta.label}
      </text>
      {/* Label below */}
      <text x={x} y={y + 14} textAnchor="middle" fontSize={9}
        fill={colors.text.primary} fontFamily={typography.fontFamily.body}>
        {device.label || ""}
      </text>
      {/* IP sub-label */}
      {device.ip && (
        <text x={x} y={y + 24} textAnchor="middle" fontSize={7}
          fill={colors.text.muted} fontFamily={typography.fontFamily.body}>
          {device.ip}
        </text>
      )}
    </g>
  );
}

function FlowConnection({ from, to, flow, maxFlow, idx }) {
  if (!from || !to) return null;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < 1) return null;

  const thick = Math.max(1.5, Math.min(6, (flow.bandwidth || 1) / (maxFlow || 1) * 6));
  const color = flow.color || colors.text.muted;

  // Offset the line start/end by 20px from center
  const angle = Math.atan2(dy, dx);
  const x1 = from.x + Math.cos(angle) * 24;
  const y1 = from.y + Math.sin(angle) * 24 - 16;
  const x2 = to.x - Math.cos(angle) * 24;
  const y2 = to.y - Math.sin(angle) * 24 - 16;

  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color} strokeWidth={thick} opacity={0.4}
        markerEnd={`url(#net-arrow-${idx})`}
        strokeDasharray={flow.dashed ? "6 3" : undefined} />
      {flow.label && (
        <>
          <rect x={(x1 + x2) / 2 - flow.label.length * 3} y={(y1 + y2) / 2 - 9}
            width={flow.label.length * 6 + 6} height={14} rx={3}
            fill={colors.surface} stroke={colors.border} strokeWidth={0.5} opacity={0.9} />
          <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 + 2}
            textAnchor="middle" fontSize={8}
            fill={colors.text.secondary} fontFamily={typography.fontFamily.body}>
            {flow.label}
          </text>
        </>
      )}
    </g>
  );
}

export function NetworkTopologyBlock({ block, accentColor }) {
  const d = block.data || {};
  const accent = accentColor || colors.accentBright;
  const devices = d.devices || [];
  const flows = d.flows || [];
  const zones = d.zones || [];

  const layout = useMemo(() => {
    if (!devices.length) return { positions: {}, W: 400, H: 300 };

    const positions = {};
    devices.forEach((dev, i) => {
      if (dev.col != null && dev.row != null) {
        const iso = toIso(dev.col, dev.row);
        positions[dev.id] = { x: iso.x, y: iso.y };
      } else {
        // Auto grid
        const cols = Math.ceil(Math.sqrt(devices.length));
        const c = i % cols;
        const r = Math.floor(i / cols);
        const iso = toIso(c * 2, r * 2);
        positions[dev.id] = { x: iso.x, y: iso.y };
      }
    });

    // Compute bounds and center
    const xs = Object.values(positions).map((p) => p.x);
    const ys = Object.values(positions).map((p) => p.y);
    const minX = Math.min(...xs) - 80;
    const maxX = Math.max(...xs) + 80;
    const minY = Math.min(...ys) - 60;
    const maxY = Math.max(...ys) + 60;
    const W = Math.max(500, maxX - minX + 100);
    const H = Math.max(280, maxY - minY + 100);

    // Offset to keep everything visible
    const offsetX = -minX + 50;
    const offsetY = -minY + 50;
    for (const id of Object.keys(positions)) {
      positions[id].x += offsetX;
      positions[id].y += offsetY;
    }

    return { positions, W, H };
  }, [devices]);

  const maxBandwidth = Math.max(1, ...flows.map((f) => f.bandwidth || 1));

  if (!devices.length) {
    return (
      <div style={{ fontFamily: typography.fontFamily.body, fontSize: 12, color: colors.text.muted, fontStyle: "italic", padding: 20, textAlign: "center" }}>
        Aucun appareil défini.
      </div>
    );
  }

  return (
    <div style={styles.card}>
      {d.title && <h3 style={{ ...styles.title, borderBottomColor: accent }}>{d.title}</h3>}

      <svg viewBox={`0 0 ${layout.W} ${layout.H}`} style={{ width: "100%", height: "auto", display: "block" }}>
        <defs>
          {flows.map((_, i) => (
            <marker key={i} id={`net-arrow-${i}`} markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill={colors.text.muted} opacity={0.5} />
            </marker>
          ))}
        </defs>

        {/* Isometric grid (subtle) */}
        <g opacity={0.06}>
          {Array.from({ length: 8 }, (_, r) =>
            Array.from({ length: 8 }, (_, c) => {
              const { x, y } = toIso(c, r);
              const ox = x + layout.W / 2 - 100;
              const oy = y + 40;
              return <circle key={`${r}-${c}`} cx={ox} cy={oy} r={1} fill={colors.text.primary} />;
            })
          )}
        </g>

        {/* Zones (background regions) */}
        {zones.map((z, zi) => {
          const zDevices = devices.filter((dev) => dev.zone === z.id);
          if (!zDevices.length) return null;
          const zPos = zDevices.map((dev) => layout.positions[dev.id]).filter(Boolean);
          const mx = Math.min(...zPos.map((p) => p.x)) - 40;
          const my = Math.min(...zPos.map((p) => p.y)) - 50;
          const mw = Math.max(...zPos.map((p) => p.x)) - mx + 80;
          const mh = Math.max(...zPos.map((p) => p.y)) - my + 80;
          const color = z.color || PALETTE[zi % PALETTE.length];
          return (
            <g key={zi}>
              <rect x={mx} y={my} width={mw} height={mh} rx={10}
                fill={`${color}08`} stroke={color} strokeWidth={1} strokeDasharray="8 4" />
              <text x={mx + 8} y={my + 14} fontSize={9} fontWeight={600}
                fill={color} fontFamily={typography.fontFamily.body}>
                {z.label || `Zone ${zi + 1}`}
              </text>
            </g>
          );
        })}

        {/* Flows (behind devices) */}
        {flows.map((f, fi) => (
          <FlowConnection key={fi}
            from={layout.positions[f.from]} to={layout.positions[f.to]}
            flow={f} maxFlow={maxBandwidth} idx={fi} />
        ))}

        {/* Devices */}
        {devices.map((dev) => {
          const pos = layout.positions[dev.id];
          if (!pos) return null;
          return <DeviceNode key={dev.id} device={dev} x={pos.x} y={pos.y} />;
        })}
      </svg>

      {/* Legend */}
      {d.showLegend !== false && (
        <div style={styles.legend}>
          {Object.entries(DEVICE_TYPES).map(([key, meta]) => {
            const hasDevice = devices.some((dev) => dev.type === key);
            if (!hasDevice) return null;
            return (
              <span key={key} style={styles.legendItem}>
                <span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: meta.color, display: "inline-block" }} />
                <span style={{ fontSize: 9, color: colors.text.muted, textTransform: "capitalize" }}>{key}</span>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.lg,
    padding: 20,
    fontFamily: typography.fontFamily.body,
  },
  title: {
    margin: "0 0 12px 0",
    fontFamily: typography.fontFamily.heading,
    fontSize: 18,
    color: colors.text.primary,
    borderBottom: "2px solid",
    paddingBottom: 8,
  },
  legend: {
    display: "flex", gap: 12, marginTop: 10, flexWrap: "wrap",
  },
  legendItem: {
    display: "inline-flex", alignItems: "center", gap: 4,
  },
};
