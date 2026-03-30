import { useMemo } from "react";
import { colors, typography, radii } from "../../../styles/tokens";

function complianceColor(pct) {
  if (pct < 40) return "#e74c3c";
  if (pct < 70) return "#f39c12";
  return "#27ae60";
}

function DonutGauge({ value, size = 200 }) {
  const radius = 80;
  const stroke = 14;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, value || 0));
  const offset = circumference - (pct / 100) * circumference;
  const color = complianceColor(pct);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" style={{ maxWidth: size, display: "block" }}>
      {/* Background track */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={colors.border}
        strokeWidth={stroke}
      />
      {/* Value arc */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${center} ${center})`}
        style={{ transition: "stroke-dashoffset 0.5s ease" }}
      />
      {/* Percentage */}
      <text
        x={center}
        y={center - 6}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontFamily: typography.fontFamily.heading,
          fontSize: "36px",
          fontWeight: 600,
          fill: colors.text.primary,
        }}
      >
        {pct}%
      </text>
      {/* Label */}
      <text
        x={center}
        y={center + 22}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontFamily: typography.fontFamily.body,
          fontSize: "11px",
          fill: colors.text.muted,
        }}
      >
        Conformité globale
      </text>
    </svg>
  );
}

function DomainBar({ domain }) {
  const pct = Math.max(0, Math.min(100, domain.compliance || 0));
  const color = complianceColor(pct);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "4px 0",
      }}
    >
      <span
        style={{
          flex: "0 0 140px",
          fontFamily: typography.fontFamily.body,
          fontSize: typography.fontSize.sm,
          color: colors.text.primary,
          fontWeight: 500,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {domain.name}
      </span>
      <div
        style={{
          flex: 1,
          height: 6,
          backgroundColor: colors.border,
          borderRadius: radii.sm,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            backgroundColor: color,
            borderRadius: radii.sm,
            transition: "width 0.3s ease",
          }}
        />
      </div>
      <span
        style={{
          flex: "0 0 80px",
          fontFamily: typography.fontFamily.body,
          fontSize: typography.fontSize.xs,
          color: colors.text.muted,
          textAlign: "right",
          whiteSpace: "nowrap",
        }}
      >
        {domain.controlsCompliant ?? "?"}/{domain.controlsTotal ?? "?"} contrôles
      </span>
    </div>
  );
}

const TREND_MAP = {
  up: { symbol: "↑", color: "#27ae60", label: "En hausse" },
  down: { symbol: "↓", color: "#e74c3c", label: "En baisse" },
  stable: { symbol: "→", color: "#f39c12", label: "Stable" },
};

export function ComplianceGaugeBlock({ block, accentColor }) {
  const data = block?.data || {};
  const accent = accentColor || colors.accentBright;
  const domains = data.domains || [];
  const overallCompliance = data.overallCompliance ?? 0;

  const trendKey = (data.trend || "").toLowerCase();
  const trend = TREND_MAP[trendKey] || { symbol: data.trend || "—", color: colors.text.muted, label: data.trend || "" };

  return (
    <div
      style={{
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: radii.lg,
        overflow: "hidden",
      }}
    >
      {data.title && (
        <div
          style={{
            padding: "12px 16px",
            borderBottom: `1px solid ${colors.border}`,
            fontFamily: typography.fontFamily.heading,
            fontSize: typography.fontSize.lg,
            fontWeight: 600,
            color: colors.text.primary,
          }}
        >
          {data.title}
        </div>
      )}

      {/* Gauge */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px 16px 12px",
        }}
      >
        <DonutGauge value={overallCompliance} />
      </div>

      {/* Domain bars */}
      {domains.length > 0 && (
        <div style={{ padding: "0 16px 12px" }}>
          <div
            style={{
              fontFamily: typography.fontFamily.body,
              fontSize: typography.fontSize.xs,
              color: colors.text.muted,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: typography.letterSpacing.wide,
              marginBottom: 8,
            }}
          >
            Domaines
          </div>
          {domains.map((d) => (
            <DomainBar key={d.id} domain={d} />
          ))}
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          display: "flex",
          gap: 16,
          padding: "10px 16px",
          borderTop: `1px solid ${colors.border}`,
          flexWrap: "wrap",
          fontFamily: typography.fontFamily.body,
          fontSize: typography.fontSize.xs,
          color: colors.text.muted,
        }}
      >
        {data.lastAudit && (
          <span>
            <strong style={{ color: colors.text.secondary }}>Dernier audit :</strong>{" "}
            {data.lastAudit}
          </span>
        )}
        {data.nextAudit && (
          <span>
            <strong style={{ color: colors.text.secondary }}>Prochain audit :</strong>{" "}
            {data.nextAudit}
          </span>
        )}
        <span>
          <strong style={{ color: colors.text.secondary }}>Tendance :</strong>{" "}
          <span style={{ color: trend.color, fontWeight: 700 }}>
            {trend.symbol}
          </span>{" "}
          {trend.label}
        </span>
      </div>
    </div>
  );
}
