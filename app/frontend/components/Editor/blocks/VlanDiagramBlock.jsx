import { useMemo } from "react";
import { colors, typography, radii } from "../../../styles/tokens";
import { PALETTE } from "../../../lib/chartUtils";

export function VlanDiagramBlock({ block, accentColor }) {
  const d = block.data || {};
  const accent = accentColor || colors.accentBright;
  const vlans = d.vlans || [];

  const W = 600, H = Math.max(200, vlans.length * 80 + 40);

  return (
    <div style={styles.card}>
      {d.title && <h3 style={{ ...styles.title, borderBottomColor: accent }}>{d.title}</h3>}

      {!vlans.length ? (
        <p style={styles.empty}>Aucun VLAN défini.</p>
      ) : (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
          {vlans.map((vlan, vi) => {
            const color = vlan.color || PALETTE[vi % PALETTE.length];
            const y = 20 + vi * 80;
            const machines = vlan.machines || [];
            const segW = W - 40;

            return (
              <g key={vi}>
                {/* VLAN segment background */}
                <rect x={20} y={y} width={segW} height={60} rx={8}
                  fill={`${color}12`} stroke={color} strokeWidth={1.5} strokeDasharray="6 3" />

                {/* VLAN label */}
                <text x={30} y={y + 16} fontSize={11} fontWeight={700}
                  fill={color} fontFamily={typography.fontFamily.body}>
                  VLAN {vlan.id ?? vi + 1} — {vlan.name || "Sans nom"}
                </text>
                <text x={30} y={y + 28} fontSize={9} fill={colors.text.muted}
                  fontFamily={typography.fontFamily.body}>
                  {vlan.subnet || ""}
                </text>

                {/* Machines inside the segment */}
                {machines.map((m, mi) => {
                  const mx = 40 + mi * 100;
                  if (mx + 80 > W - 20) return null;
                  return (
                    <g key={mi} transform={`translate(${mx}, ${y + 34})`}>
                      <rect x={0} y={0} width={80} height={22} rx={4}
                        fill={colors.surface} stroke={color} strokeWidth={1} />
                      <text x={40} y={14} fontSize={9} textAnchor="middle"
                        fill={colors.text.primary} fontFamily={typography.fontFamily.body}>
                        {m.name || m.ip || `M${mi}`}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Inter-VLAN connections */}
          {(d.connections || []).map((c, ci) => {
            const fromIdx = vlans.findIndex((v) => String(v.id) === String(c.from));
            const toIdx = vlans.findIndex((v) => String(v.id) === String(c.to));
            if (fromIdx < 0 || toIdx < 0) return null;
            const fromY = 20 + fromIdx * 80 + 30;
            const toY = 20 + toIdx * 80 + 30;
            return (
              <g key={ci}>
                <line x1={W - 30} y1={fromY} x2={W - 30} y2={toY}
                  stroke={colors.text.muted} strokeWidth={1.5} strokeDasharray="4 2" />
                <circle cx={W - 30} cy={fromY} r={3} fill={colors.text.muted} />
                <circle cx={W - 30} cy={toY} r={3} fill={colors.text.muted} />
                {c.label && (
                  <text x={W - 24} y={(fromY + toY) / 2 + 3} fontSize={8}
                    fill={colors.text.muted} fontFamily={typography.fontFamily.body}>
                    {c.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
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
  empty: {
    color: colors.text.muted, fontSize: 12,
    fontStyle: "italic", textAlign: "center", padding: 16,
  },
};
