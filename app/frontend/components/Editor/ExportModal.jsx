import { useState, useMemo, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { useEditorStore } from "../../stores/editorStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { colors, typography, radii, zIndex } from "../../styles/tokens";
import { normalizeTableData, BLOCK_MIGRATORS } from "../../lib/tableMigration";

const TABS = [
  { id: "html", label: "HTML", icon: "file-code" },
  { id: "pdf", label: "PDF", icon: "file-pdf" },
  { id: "json", label: "JSON Source", icon: "file-export" },
];

function buildHtmlPreview(report) {
  const accent = report.accent_color || "#E8A855";
  const blocks = report.content?.blocks || [];

  const renderUniversalTable = (data, accent) => {
    const cols = (data.columns || []).filter((c) => !c.hidden);
    const rows = data.rows || [];
    const accentCol = data.accentBorderColumn;
    const renderCell = (col, value) => {
      const cfg = col.config || {};
      switch (col.type) {
        case "badge": {
          if (value == null || value === "") return "—";
          const entry = (cfg.colorMap || {})[value] || {};
          return `<span style="padding:2px 8px;border-radius:4px;background:${entry.bg || "#E2DDD520"};color:${entry.text || "#807D76"};font-weight:600;font-size:10px;white-space:nowrap;">${esc(entry.label || value)}</span>`;
        }
        case "score-badge": {
          const ranges = cfg.ranges || [];
          const n = Number(value) || 0;
          const r = ranges.find((r) => n >= r.min && n <= r.max) || {};
          return `<span style="padding:2px 8px;border-radius:4px;background:${r.bg || "#E2DDD520"};color:${r.text || "#807D76"};font-weight:700;font-size:11px;">${n}</span>`;
        }
        case "progress": {
          const pv = Math.min(Math.max(Number(value) || 0, 0), 100);
          return `<div style="display:flex;align-items:center;gap:4px;"><div style="flex:1;height:6px;background:#E2DDD5;border-radius:3px;overflow:hidden;"><div style="width:${pv}%;height:100%;background:${accent};border-radius:3px;"></div></div><span style="font-size:9px;min-width:28px;text-align:right;">${pv}%</span></div>`;
        }
        case "masked": return `<span style="font-family:'DM Mono',monospace;letter-spacing:1px;color:#9A9488;">••••••••</span>`;
        case "status-dot": {
          const map = cfg.colorMap || {};
          const entry = map[value] || {};
          return `<span style="display:inline-flex;align-items:center;gap:4px;"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${entry.color || "#9A9488"};"></span>${esc(entry.label || value || "")}</span>`;
        }
        case "icon-status": {
          const map = cfg.iconMap || {};
          const entry = map[value] || {};
          return `<span style="color:${entry.color || "#9A9488"};font-weight:700;">${entry.symbol || "?"}</span>`;
        }
        case "row-id": return `<span style="font-weight:600;color:${accent};">${esc(value ?? "")}</span>`;
        case "circle-badge": {
          const map = cfg.colorMap || {};
          const entry = map[value] || {};
          return `<span style="display:inline-block;width:24px;height:24px;border-radius:50%;background:${entry.bg || "#9A9488"};color:${entry.text || "#fff"};font-weight:700;line-height:24px;text-align:center;font-size:11px;">${esc(value ?? "")}</span>`;
        }
        case "mono": return `<span style="font-family:'DM Mono',monospace;font-size:10px;">${esc(value ?? "")}</span>`;
        case "number": return `<span style="font-weight:600;">${value ?? ""}</span>`;
        default: return esc(value ?? "");
      }
    };
    const metaHtml = (data.meta || []).length ? `<div style="display:flex;gap:12px;margin-bottom:6px;font-size:10px;color:#9A9488;">${data.meta.map((m) => `<span><strong>${esc(m.label)}</strong> ${esc(m.value)}</span>`).join("")}</div>` : "";
    const thStyle = `padding:6px 8px;border-bottom:2px solid #E2DDD5;font-size:10px;text-transform:uppercase;color:#807D76;`;
    const headersHtml = cols.map((c) => `<th style="${thStyle}text-align:${c.align || "left"};">${esc(c.header)}</th>`).join("");
    const rowsHtml = rows.map((row, ri) => {
      const abCol = accentCol ? cols.find((c) => c.id === accentCol) : null;
      const abVal = abCol ? row.cells?.[abCol.id] : null;
      const abEntry = abCol && abVal ? (abCol.config?.colorMap || {})[abVal] : null;
      const borderLeft = abEntry ? `border-left:3px solid ${abEntry.bg || accent};` : "";
      return `<tr style="background:${ri % 2 ? "#F5F3EE" : "#FDFCF9"};${borderLeft}">${cols.map((c) => `<td style="padding:6px 8px;border-bottom:1px solid #E2DDD5;text-align:${c.align || "left"};">${renderCell(c, row.cells?.[c.id])}</td>`).join("")}</tr>`;
    }).join("");
    return `<div style="margin:12px 0;font-family:'DM Mono',monospace;">
      ${data.title ? `<h3 style="font-family:'Fraunces',serif;margin:0 0 8px;">${esc(data.title)}</h3>` : ""}
      ${data.subtitle ? `<div style="font-size:11px;color:#4A4840;margin-bottom:6px;">${esc(data.subtitle)}</div>` : ""}
      ${metaHtml}
      <table style="width:100%;border-collapse:collapse;font-size:11px;">
        <thead><tr style="background:#F5F3EE;">${headersHtml}</tr></thead>
        <tbody>${rowsHtml}</tbody>
      </table>
    </div>`;
  };

  const TABLE_BLOCK_TYPES = new Set(["table","port-scan-table","credentials-table","cve-table","firewall-rules","server-inventory","dns-records","wireless-survey","risk-register","action-plan","raci-matrix","compliance-checklist","ebios-feared-events","ebios-scenarios","control-matrix"]);

  const renderBlock = (block) => {
    const d = block.data || {};

    // Universal table handler — all table-derivative blocks
    if (TABLE_BLOCK_TYPES.has(block.type)) {
      const migrator = BLOCK_MIGRATORS[block.type];
      const tableData = migrator ? migrator(d) : normalizeTableData(d);
      return renderUniversalTable(tableData, accent);
    }

    switch (block.type) {
      case "section-title": {
        const Tag = `h${d.level || 2}`;
        const isMain = (d.level || 2) <= 2;
        return `<${Tag} style="font-family:'Fraunces',serif;margin:24px 0 12px;${isMain ? `border-bottom:2px solid ${accent};padding-bottom:8px;` : ""}">${esc(d.text || "")}</${Tag}>`;
      }
      case "text":
        return `<div style="font-family:'DM Mono',monospace;font-size:13px;line-height:1.7;color:#4A4840;margin:8px 0;">${d.content || ""}</div>`;
      case "code":
        return `<pre style="background:#0d1117;color:#e6edf3;padding:16px 20px;border-radius:12px;font-family:'DM Mono',monospace;font-size:13px;line-height:1.75;overflow-x:auto;margin:12px 0;"><code>${esc(d.code || "")}</code></pre>`;
      case "callout": {
        const vmap = { info: "#5B8FD4", warning: "#E9C46A", danger: "#E57373", success: "#5CB85C" };
        const col = vmap[d.variant] || vmap.info;
        return `<div style="border-left:3px solid ${col};background:${col}12;padding:14px 18px;border-radius:2px 10px 10px 2px;margin:12px 0;font-family:'DM Mono',monospace;font-size:13px;">${esc(d.content || "")}</div>`;
      }
      case "separator":
        return d.style === "dots" ? `<div style="text-align:center;color:${accent};margin:16px 0;letter-spacing:8px;">• • •</div>` : `<hr style="border:none;border-top:1px solid ${accent}40;margin:16px 0;" />`;
      case "spacer":
        return `<div style="height:${d.height || 24}px;"></div>`;
      case "image":
        return (d.images || []).map((img) => `<figure style="margin:12px 0;text-align:center;"><img src="${esc(img.url)}" alt="${esc(img.caption || "")}" style="max-width:100%;border-radius:8px;" />${img.caption ? `<figcaption style="font-family:'DM Mono',monospace;font-size:11px;color:#807D76;margin-top:6px;">${esc(img.caption)}</figcaption>` : ""}</figure>`).join("");
      case "drawer": {
        const inner = (block.children || []).map(renderBlock).join("");
        return `<details${d.open ? " open" : ""} style="margin:12px 0;border:1px solid #E2DDD5;border-radius:10px;"><summary style="padding:10px 16px;cursor:pointer;font-family:'DM Mono',monospace;font-weight:600;">${esc(d.title || "Section")}</summary><div style="padding:12px 16px;">${inner}</div></details>`;
      }
      case "horizontal-div": {
        const cols = (block.children || []).map(renderBlock);
        return `<div style="display:flex;gap:24px;margin:12px 0;">${cols.map((c) => `<div style="flex:1;min-width:0;">${c}</div>`).join("")}</div>`;
      }
      // Score / Risk blocks
      case "score-gauge": {
        const scores = d.scores || [];
        return `<div style="margin:12px 0;font-family:'DM Mono',monospace;">${d.title ? `<h3 style="font-family:'Fraunces',serif;margin:0 0 12px;">${esc(d.title)}</h3>` : ""}${scores.map((s) => `<div style="display:flex;align-items:center;gap:8px;margin:4px 0;"><span style="font-size:12px;min-width:120px;">${esc(s.label)}</span><div style="flex:1;height:8px;background:#E2DDD5;border-radius:4px;overflow:hidden;"><div style="width:${Math.round((s.value / (d.max || 9)) * 100)}%;height:100%;background:${accent};border-radius:4px;"></div></div><span style="font-size:12px;font-weight:600;">${s.value}/${d.max || 9}</span></div>`).join("")}</div>`;
      }
      case "risk-matrix":
        return `<div style="margin:12px 0;text-align:center;font-family:'DM Mono',monospace;font-size:12px;color:#807D76;">[Matrice de risques — ${(d.points || []).length} point(s)]</div>`;
      case "risk-assessment":
        return `<div style="margin:12px 0;font-family:'DM Mono',monospace;">${d.title ? `<h3 style="font-family:'Fraunces',serif;">${esc(d.title)}</h3>` : ""}<p style="font-size:12px;color:#807D76;">[Évaluation des risques OWASP]</p></div>`;
      // Graph blocks
      case "bar-chart": case "line-chart": case "pie-chart": case "gauge-chart":
      case "radar-chart": case "heatmap": case "stacked-bar": case "area-chart":
      case "scatter-plot": case "sparkline": case "funnel-chart": case "waterfall-chart":
      case "treemap": case "sankey-diagram":
        return `<div style="margin:12px 0;padding:20px;border:1px solid #E2DDD5;border-radius:10px;text-align:center;font-family:'DM Mono',monospace;font-size:12px;color:#807D76;">${d.title ? `<div style="font-weight:600;margin-bottom:4px;">${esc(d.title)}</div>` : ""}[Graphique: ${esc(block.type)}]</div>`;
      // Pentest blocks
      case "vulnerability-card": {
        const sevColors = { critical: "#c0392b", high: "#e67e22", medium: "#f39c12", low: "#27ae60" };
        const sevCol = sevColors[d.severity] || sevColors.medium;
        return `<div style="margin:12px 0;border:1px solid #E2DDD5;border-left:4px solid ${sevCol};border-radius:10px;padding:14px 18px;font-family:'DM Mono',monospace;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
            <span class="arbor-badge arbor-badge-${d.severity || "medium"}">${esc((d.severity || "medium").toUpperCase())}</span>
            ${d.cvss != null ? `<span style="font-size:12px;font-weight:700;color:${sevCol};">CVSS ${d.cvss}</span>` : ""}
            <strong style="font-family:'Fraunces',serif;">${esc(d.title || "Vulnérabilité")}</strong>
          </div>
          ${d.description ? `<p style="font-size:13px;line-height:1.6;margin:4px 0;">${esc(d.description)}</p>` : ""}
          ${d.remediation ? `<p style="font-size:12px;color:#4A4840;margin:4px 0;"><strong>Remédiation:</strong> ${esc(d.remediation)}</p>` : ""}
          ${(d.tags || []).length ? `<div style="margin-top:6px;">${d.tags.map((t) => `<span style="font-size:10px;padding:2px 6px;border-radius:3px;background:#F5F3EE;border:1px solid #E2DDD5;margin-right:4px;">${esc(t)}</span>`).join("")}</div>` : ""}
        </div>`;
      }
      case "findings-summary": {
        const items = [
          { label: "Critique", count: d.critical || 0, color: "#c0392b" },
          { label: "Élevé", count: d.high || 0, color: "#e67e22" },
          { label: "Moyen", count: d.medium || 0, color: "#f39c12" },
          { label: "Faible", count: d.low || 0, color: "#27ae60" },
          { label: "Info", count: d.info || 0, color: "#2980b9" },
        ];
        const total = items.reduce((s, it) => s + it.count, 0);
        return `<div style="margin:12px 0;font-family:'DM Mono',monospace;">
          ${d.title ? `<h3 style="font-family:'Fraunces',serif;margin:0 0 8px;">${esc(d.title)}</h3>` : ""}
          <div style="font-size:28px;font-weight:700;margin-bottom:8px;">${total} <span style="font-size:12px;font-weight:400;color:#807D76;">vulnérabilités</span></div>
          ${items.map((it) => `<div style="display:flex;align-items:center;gap:8px;margin:3px 0;"><div style="width:10px;height:10px;border-radius:2px;background:${it.color};"></div><span style="font-size:12px;flex:1;">${esc(it.label)}</span><strong style="font-size:13px;">${it.count}</strong></div>`).join("")}
        </div>`;
      }
      case "scope-block": {
        const renderScopeTable = (items, label, color) => {
          if (!items?.length) return "";
          return `<div style="margin-bottom:12px;"><h4 style="color:${color};font-family:'Fraunces',serif;margin:0 0 6px;">${label}</h4>
            <table style="width:100%;border-collapse:collapse;font-size:12px;">
              <thead><tr><th style="text-align:left;padding:4px 8px;border-bottom:2px solid #E2DDD5;">Cible</th><th style="text-align:left;padding:4px 8px;border-bottom:2px solid #E2DDD5;">Type</th><th style="text-align:left;padding:4px 8px;border-bottom:2px solid #E2DDD5;">Description</th></tr></thead>
              <tbody>${items.map((it) => `<tr><td style="padding:4px 8px;border-bottom:1px solid #E2DDD5;">${esc(it.target)}</td><td style="padding:4px 8px;border-bottom:1px solid #E2DDD5;"><span style="background:#3498db;color:#fff;padding:1px 6px;border-radius:9999px;font-size:10px;">${esc(it.type)}</span></td><td style="padding:4px 8px;border-bottom:1px solid #E2DDD5;">${esc(it.description)}</td></tr>`).join("")}</tbody>
            </table></div>`;
        };
        return `<div style="margin:12px 0;border:1px solid #E2DDD5;border-radius:10px;padding:16px;font-family:'DM Mono',monospace;">
          ${d.title ? `<h3 style="font-family:'Fraunces',serif;border-bottom:2px solid ${accent};padding-bottom:6px;margin:0 0 12px;">${esc(d.title)}</h3>` : ""}
          ${renderScopeTable(d.inScope, "✓ In Scope", "#27ae60")}
          ${renderScopeTable(d.outOfScope, "✗ Out of Scope", "#c0392b")}
          ${d.notes ? `<p style="font-size:12px;font-style:italic;color:#807D76;margin-top:8px;">${esc(d.notes)}</p>` : ""}
        </div>`;
      }
      case "recommendation": {
        const prioColors = { critical: "#c0392b", high: "#e67e22", medium: "#f39c12", low: "#27ae60" };
        const prioCol = prioColors[d.priority] || prioColors.medium;
        return `<div style="margin:12px 0;border:1px solid #E2DDD5;border-radius:10px;overflow:hidden;font-family:'DM Mono',monospace;">
          <div style="display:flex;align-items:center;gap:8px;padding:10px 16px;background:${prioCol}08;border-bottom:1px solid #E2DDD5;">
            <span class="arbor-badge" style="background:${prioCol};">${esc((d.priority || "medium").toUpperCase())}</span>
            <strong style="font-family:'Fraunces',serif;">${esc(d.title || "Recommandation")}</strong>
          </div>
          <div style="padding:12px 16px;font-size:13px;">
            ${d.description ? `<p style="margin:0 0 8px;">${esc(d.description)}</p>` : ""}
            ${d.timeline || d.owner ? `<div style="font-size:11px;color:#807D76;">${d.timeline ? `📅 ${esc(d.timeline)}` : ""} ${d.owner ? `👤 ${esc(d.owner)}` : ""}</div>` : ""}
          </div>
        </div>`;
      }
      case "cvss-calculator": {
        return `<div style="margin:12px 0;border:1px solid #E2DDD5;border-radius:10px;padding:16px;font-family:'DM Mono',monospace;">
          ${d.title ? `<h3 style="font-family:'Fraunces',serif;margin:0 0 8px;">${esc(d.title)}</h3>` : ""}
          <div style="font-size:12px;color:#807D76;">CVSS:3.1/AV:${d.AV || "?"}/AC:${d.AC || "?"}/PR:${d.PR || "?"}/UI:${d.UI || "?"}/S:${d.S || "?"}/C:${d.C || "?"}/I:${d.I || "?"}/A:${d.A || "?"}</div>
        </div>`;
      }
      case "attack-timeline": {
        const phases = d.phases || [];
        const stSymbols = { success: "✓", partial: "◐", blocked: "✗", skipped: "○" };
        return `<div style="margin:12px 0;font-family:'DM Mono',monospace;">
          ${d.title ? `<h3 style="font-family:'Fraunces',serif;margin:0 0 12px;">${esc(d.title)}</h3>` : ""}
          ${phases.map((p) => `<div style="margin-bottom:12px;padding-left:16px;border-left:3px solid ${p.color || accent};">
            <div style="font-weight:700;color:${p.color || accent};font-family:'Fraunces',serif;">${esc(p.label)} ${p.timestamp ? `<span style="font-size:10px;color:#807D76;font-weight:400;">${esc(p.timestamp)}</span>` : ""}</div>
            ${(p.techniques || []).map((t) => `<div style="font-size:12px;margin:2px 0;">${stSymbols[t.status] || "•"} ${t.id ? `<span style="font-size:10px;color:#807D76;">${esc(t.id)}</span> ` : ""}${esc(t.name)}</div>`).join("")}
          </div>`).join("")}
        </div>`;
      }
      case "attack-path":
        return `<div style="margin:12px 0;padding:20px;border:1px solid #E2DDD5;border-radius:10px;text-align:center;font-family:'DM Mono',monospace;">
          ${d.title ? `<h3 style="font-family:'Fraunces',serif;margin:0 0 8px;">${esc(d.title)}</h3>` : ""}
          <div style="font-size:12px;color:#807D76;">${(d.nodes || []).map((n) => esc(n.label)).join(" → ")}</div>
        </div>`;
      case "privilege-escalation": {
        const chain = d.chain || [];
        return `<div style="margin:12px 0;font-family:'DM Mono',monospace;">
          ${d.title ? `<h3 style="font-family:'Fraunces',serif;margin:0 0 12px;">${esc(d.title)}</h3>` : ""}
          ${chain.map((s, i) => `<div style="display:flex;align-items:center;gap:10px;margin:4px 0;padding:8px 12px;border:2px solid ${s.color || accent};border-radius:8px;background:${s.color || accent}08;">
            <span style="width:28px;height:28px;border-radius:50%;background:${s.color || accent};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;">${s.level != null ? s.level : i}</span>
            <div><strong style="color:${s.color || accent};">${esc(s.privilege)}</strong>${s.description ? `<div style="font-size:11px;color:#4A4840;">${esc(s.description)}</div>` : ""}${s.source ? `<div style="font-size:10px;color:#807D76;">${esc(s.source)}</div>` : ""}</div>
          </div>`).join(`<div style="text-align:center;color:#E2DDD5;font-size:16px;">↓</div>`)}
        </div>`;
      }

      // ─── GRC ─────────────────────────────────
      case "ebios-target": {
        const sources = d.sources || [];
        const objectifs = d.objectifs || [];
        const couples = d.couples || [];
        const retenu = couples.filter((c) => c.retenu);
        const nonRetenu = couples.filter((c) => !c.retenu);
        const couleurR = d.apparence?.couleurRetenu || "#2980B9";
        const couleurNR = d.apparence?.couleurNonRetenu || "#95A5A6";
        return `<div style="margin:12px 0;font-family:'DM Mono',monospace;">
          ${d.title ? `<h3 style="font-family:'Fraunces',serif;margin:0 0 10px;">${esc(d.title)}</h3>` : ""}
          <div style="padding:16px;border:1px solid #E2DDD5;border-radius:8px;">
            <p style="font-size:11px;color:#6B6860;margin:0 0 8px;">⚠ La cible EBIOS RM est un diagramme SVG interactif. Voici le résumé des couples :</p>
            <div style="margin-bottom:8px;">
              <strong style="font-size:11px;">Sources :</strong>
              ${sources.map((s) => `<span style="display:inline-block;margin:2px 4px;padding:2px 8px;border-radius:4px;font-size:10px;background:${s.couleur || "#e74c3c"}15;border:1px solid ${s.couleur || "#e74c3c"};color:${s.couleur || "#e74c3c"};font-weight:600;">${esc(s.label || s.nom)}</span>`).join("")}
            </div>
            <div style="margin-bottom:8px;">
              <strong style="font-size:11px;">Objectifs :</strong>
              ${objectifs.map((o) => `<span style="display:inline-block;margin:2px 4px;padding:2px 8px;border-radius:4px;font-size:10px;background:${o.couleur || "#2980b9"}15;border:1px solid ${o.couleur || "#2980b9"};color:${o.couleur || "#2980b9"};font-weight:600;">${esc(o.label || o.nom)}</span>`).join("")}
            </div>
            <table style="width:100%;border-collapse:collapse;font-size:10px;margin-top:8px;">
              <tr style="background:#F5F3EE;border-bottom:1px solid #E2DDD5;">
                <th style="padding:4px 6px;text-align:left;">Couple</th>
                <th style="padding:4px 6px;text-align:left;">Source</th>
                <th style="padding:4px 6px;text-align:left;">Objectif</th>
                <th style="padding:4px 6px;text-align:center;">Pertinence</th>
                <th style="padding:4px 6px;text-align:center;">Retenu</th>
              </tr>
              ${couples.map((c) => `<tr style="border-bottom:1px solid #E2DDD5;">
                <td style="padding:4px 6px;font-weight:600;">${esc(c.nom)}</td>
                <td style="padding:4px 6px;">${esc(c.source)}</td>
                <td style="padding:4px 6px;">${esc(c.objectif)}</td>
                <td style="padding:4px 6px;text-align:center;">${c.pertinence || "—"}</td>
                <td style="padding:4px 6px;text-align:center;color:${c.retenu ? couleurR : couleurNR};font-weight:700;">${c.retenu ? "●" : "○"}</td>
              </tr>`).join("")}
            </table>
          </div>
        </div>`;
      }
      case "gap-analysis": {
        const domains = d.domains || [];
        const prioColor = { critical: "#c0392b", high: "#e67e22", medium: "#f39c12", low: "#27ae60" };
        return `<div style="margin:12px 0;font-family:'DM Mono',monospace;">
          ${d.title ? `<h3 style="font-family:'Fraunces',serif;margin:0 0 10px;">${esc(d.title)}</h3>` : ""}
          <table style="width:100%;border-collapse:collapse;font-size:11px;">
            <tr style="background:#F5F3EE;"><th style="padding:6px 8px;text-align:left;border-bottom:2px solid #E2DDD5;">Domaine</th><th style="padding:6px 8px;text-align:center;border-bottom:2px solid #E2DDD5;">Actuel</th><th style="padding:6px 8px;text-align:center;border-bottom:2px solid #E2DDD5;">Cible</th><th style="padding:6px 8px;text-align:center;border-bottom:2px solid #E2DDD5;">Écart</th><th style="padding:6px 8px;text-align:center;border-bottom:2px solid #E2DDD5;">Priorité</th></tr>
            ${domains.map((dom, i) => `<tr style="background:${i % 2 ? "#F5F3EE" : "#FDFCF9"};">
              <td style="padding:6px 8px;font-weight:600;">${esc(dom.name)}</td>
              <td style="padding:6px 8px;text-align:center;">${dom.currentLevel}/5</td>
              <td style="padding:6px 8px;text-align:center;">${dom.targetLevel}/5</td>
              <td style="padding:6px 8px;text-align:center;font-weight:700;color:${(dom.gap || 0) >= 3 ? "#c0392b" : (dom.gap || 0) >= 2 ? "#e67e22" : "#27ae60"};">${dom.gap || (dom.targetLevel - dom.currentLevel)}</td>
              <td style="padding:6px 8px;text-align:center;"><span style="padding:2px 8px;border-radius:4px;background:${prioColor[dom.priority] || "#9A9488"};color:#fff;font-size:10px;font-weight:600;">${esc(dom.priority)}</span></td>
            </tr>`).join("")}
          </table>
        </div>`;
      }
      case "maturity-radar": {
        const axes = d.axes || [];
        const n = axes.length;
        if (!n) return "";
        const cx = 200, cy = 200, R = 150;
        const currentCol = d.currentColor || "#E8A855";
        const targetCol = d.targetColor || "#5B8FD4";
        const pt = (i, val, max) => {
          const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
          return { x: cx + Math.cos(angle) * R * (val / (max || 5)), y: cy + Math.sin(angle) * R * (val / (max || 5)) };
        };
        const poly = (getter) => axes.map((a, i) => { const p = pt(i, getter(a), a.max || 5); return `${p.x},${p.y}`; }).join(" ");
        const gridLines = [1,2,3,4,5].map((lv) => `<polygon points="${axes.map((a, i) => { const p = pt(i, lv, 5); return `${p.x},${p.y}`; }).join(" ")}" fill="none" stroke="#E2DDD5" stroke-width="0.5" />`).join("");
        const axisLines = axes.map((a, i) => { const p = pt(i, 5, 5); return `<line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}" stroke="#E2DDD5" stroke-width="0.5" /><text x="${pt(i, 5.6, 5).x}" y="${pt(i, 5.6, 5).y}" text-anchor="middle" font-size="9" fill="#4A4840" font-family="'DM Mono',monospace">${esc(a.label)}</text>`; }).join("");
        return `<div style="margin:12px 0;font-family:'DM Mono',monospace;">
          ${d.title ? `<h3 style="font-family:'Fraunces',serif;margin:0 0 10px;">${esc(d.title)}</h3>` : ""}
          <svg viewBox="0 0 400 440" width="100%" style="max-width:400px;">
            ${gridLines}${axisLines}
            <polygon points="${poly((a) => a.target)}" fill="${targetCol}15" stroke="${targetCol}" stroke-width="1.5" stroke-dasharray="4 3" />
            <polygon points="${poly((a) => a.current)}" fill="${currentCol}30" stroke="${currentCol}" stroke-width="2" />
            ${axes.map((a, i) => { const pc = pt(i, a.current, a.max || 5); return `<circle cx="${pc.x}" cy="${pc.y}" r="3" fill="${currentCol}" />`; }).join("")}
            <text x="140" y="430" font-size="10" fill="${currentCol}" font-family="'DM Mono',monospace">● Actuel</text>
            <text x="240" y="430" font-size="10" fill="${targetCol}" font-family="'DM Mono',monospace">◯ Cible</text>
          </svg>
        </div>`;
      }
      case "risk-appetite": {
        const cats = d.categories || [];
        const statusCol = (c) => c.current > c.appetite ? (c.current > c.appetite * 1.2 ? "#c0392b" : "#f39c12") : "#27ae60";
        return `<div style="margin:12px 0;font-family:'DM Mono',monospace;">
          ${d.title ? `<h3 style="font-family:'Fraunces',serif;margin:0 0 10px;">${esc(d.title)}</h3>` : ""}
          ${d.description ? `<p style="font-size:11px;color:#4A4840;margin:0 0 12px;">${esc(d.description)}</p>` : ""}
          ${cats.map((c) => `<div style="margin:8px 0;">
            <div style="display:flex;align-items:center;gap:8px;font-size:11px;margin-bottom:3px;">
              <span style="font-weight:600;min-width:120px;">${esc(c.name)}</span>
              <div style="flex:1;height:12px;background:#F5F3EE;border-radius:6px;position:relative;overflow:visible;">
                <div style="width:${c.current}%;height:100%;background:${statusCol(c)};border-radius:6px;"></div>
                <div style="position:absolute;left:${c.appetite}%;top:-2px;width:2px;height:16px;background:#2C2B28;border-radius:1px;"></div>
              </div>
              <span style="font-size:10px;font-weight:700;min-width:30px;text-align:right;">${c.current}%</span>
            </div>
          </div>`).join("")}
        </div>`;
      }
      case "compliance-gauge": {
        const overall = d.overallCompliance || 0;
        const domains = d.domains || [];
        const gaugeCol = overall >= 70 ? "#27ae60" : overall >= 40 ? "#f39c12" : "#c0392b";
        const circum = 2 * Math.PI * 80;
        const offset = circum * (1 - overall / 100);
        return `<div style="margin:12px 0;font-family:'DM Mono',monospace;">
          ${d.title ? `<h3 style="font-family:'Fraunces',serif;margin:0 0 10px;">${esc(d.title)}</h3>` : ""}
          <div style="text-align:center;">
            <svg viewBox="0 0 200 200" width="160" height="160">
              <circle cx="100" cy="100" r="80" fill="none" stroke="#E2DDD5" stroke-width="12" />
              <circle cx="100" cy="100" r="80" fill="none" stroke="${gaugeCol}" stroke-width="12" stroke-dasharray="${circum}" stroke-dashoffset="${offset}" transform="rotate(-90 100 100)" stroke-linecap="round" />
              <text x="100" y="95" text-anchor="middle" font-size="28" font-weight="700" fill="${gaugeCol}" font-family="'DM Mono',monospace">${overall}%</text>
              <text x="100" y="115" text-anchor="middle" font-size="9" fill="#9A9488" font-family="'DM Mono',monospace">Conformité globale</text>
            </svg>
          </div>
          ${domains.map((dom) => {
            const col = dom.compliance >= 70 ? "#27ae60" : dom.compliance >= 40 ? "#f39c12" : "#c0392b";
            return `<div style="display:flex;align-items:center;gap:8px;margin:4px 0;font-size:11px;">
              <span style="min-width:100px;font-weight:500;">${esc(dom.name)}</span>
              <div style="flex:1;height:6px;background:#F5F3EE;border-radius:3px;overflow:hidden;"><div style="width:${dom.compliance}%;height:100%;background:${col};border-radius:3px;"></div></div>
              <span style="font-size:10px;color:#9A9488;min-width:60px;text-align:right;">${dom.controlsCompliant}/${dom.controlsTotal}</span>
            </div>`;
          }).join("")}
          ${d.lastAudit ? `<div style="font-size:10px;color:#9A9488;margin-top:8px;">Dernier audit : ${esc(d.lastAudit)} | Prochain : ${esc(d.nextAudit || "N/A")}</div>` : ""}
        </div>`;
      }

      // ===== NETWORK =====
      case "certificate-info": {
        const daysLeft = d.validTo ? Math.ceil((new Date(d.validTo) - new Date()) / 86400000) : null;
        const col = daysLeft != null ? (daysLeft > 30 ? "#27ae60" : daysLeft > 7 ? "#f39c12" : "#c0392b") : "#9A9488";
        return `<div style="margin:12px 0;font-family:'DM Mono',monospace;">
          ${d.title ? `<h3 style="font-family:'Fraunces',serif;margin:0 0 8px;">${esc(d.title)}</h3>` : ""}
          <div style="background:#F5F3EE;border-radius:8px;padding:12px;display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:10px;">
            <div><strong>Sujet :</strong> ${esc(d.subject || "")}</div>
            <div><strong>Émetteur :</strong> ${esc(d.issuer || "")}</div>
            <div><strong>Valide du :</strong> ${esc(d.validFrom || "")}</div>
            <div><strong>Valide au :</strong> <span style="color:${col};font-weight:700;">${esc(d.validTo || "")}</span>${daysLeft != null ? ` (${daysLeft}j)` : ""}</div>
            <div><strong>Algo :</strong> ${esc(d.algorithm || "")}</div>
            <div><strong>Clé :</strong> ${esc(d.keySize || "")} bits</div>
            <div><strong>Chaîne :</strong> <span style="color:${d.chainValid ? "#27ae60" : "#c0392b"};font-weight:700;">${d.chainValid ? "Valide" : "Invalide"}</span></div>
            ${(d.san || []).length ? `<div style="grid-column:1/-1;"><strong>SAN :</strong> ${(d.san || []).map((s) => esc(s)).join(", ")}</div>` : ""}
          </div>
        </div>`;
      }
      case "subnet-map": {
        const addresses = d.addresses || [];
        const col = d.columns || 16;
        const statusColors = { used: "#3498db", free: "#27ae60", reserved: "#f39c12", gateway: "#9b59b6", broadcast: "#e74c3c" };
        return `<div style="margin:12px 0;font-family:'DM Mono',monospace;">
          ${d.title ? `<h3 style="font-family:'Fraunces',serif;margin:0 0 8px;">${esc(d.title)}</h3>` : ""}
          ${d.subnet ? `<div style="font-size:10px;color:#9A9488;margin-bottom:6px;">${esc(d.subnet)} (${esc(d.mask || "")})</div>` : ""}
          <div style="display:flex;flex-wrap:wrap;gap:2px;max-width:${col * 30}px;">
            ${addresses.map((a) => `<div style="width:26px;height:26px;border-radius:3px;background:${(statusColors[a.status] || "#E2DDD5")}30;border:1px solid ${statusColors[a.status] || "#E2DDD5"};display:flex;align-items:center;justify-content:center;font-size:7px;color:${statusColors[a.status] || "#9A9488"};" title="${esc(a.ip)} ${esc(a.hostname || "")}">${esc(a.ip.split(".").pop())}</div>`).join("")}
          </div>
          <div style="display:flex;gap:10px;margin-top:6px;font-size:9px;color:#9A9488;">
            ${Object.entries(statusColors).map(([k, c]) => `<span><span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:${c};margin-right:3px;"></span>${k}</span>`).join("")}
          </div>
        </div>`;
      }
      case "vlan-diagram": {
        const vlans = d.vlans || [];
        return `<div style="margin:12px 0;font-family:'DM Mono',monospace;">
          ${d.title ? `<h3 style="font-family:'Fraunces',serif;margin:0 0 8px;">${esc(d.title)}</h3>` : ""}
          <div style="display:flex;flex-wrap:wrap;gap:10px;">
            ${vlans.map((v) => `<div style="flex:1;min-width:160px;border:2px solid ${v.color || "#3498db"};border-radius:8px;padding:8px;">
              <div style="font-weight:700;font-size:11px;color:${v.color || "#3498db"};margin-bottom:4px;">VLAN ${esc(v.id)} — ${esc(v.name)}</div>
              <div style="font-size:9px;color:#9A9488;margin-bottom:6px;">${esc(v.subnet || "")}</div>
              ${(v.machines || []).map((m) => `<div style="font-size:9px;padding:2px 4px;background:${v.color || "#3498db"}10;border-radius:3px;margin:2px 0;">${esc(m.name)} <span style="color:#9A9488;">${esc(m.ip)}</span></div>`).join("")}
            </div>`).join("")}
          </div>
        </div>`;
      }
      case "network-flow": {
        const nodes = d.nodes || [];
        const links = d.links || [];
        return `<div style="margin:12px 0;font-family:'DM Mono',monospace;">
          ${d.title ? `<h3 style="font-family:'Fraunces',serif;margin:0 0 8px;">${esc(d.title)}</h3>` : ""}
          <table style="width:100%;border-collapse:collapse;font-size:10px;">
            <tr style="background:#F5F3EE;"><th style="padding:5px;border-bottom:2px solid #E2DDD5;">Source</th><th style="padding:5px;border-bottom:2px solid #E2DDD5;">Destination</th><th style="padding:5px;border-bottom:2px solid #E2DDD5;">Protocole</th><th style="padding:5px;border-bottom:2px solid #E2DDD5;">Volume</th></tr>
            ${links.map((l, i) => `<tr style="background:${i % 2 ? "#F5F3EE" : "#FDFCF9"};"><td style="padding:5px;"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${(nodes[l.source] || {}).color || "#9A9488"};margin-right:4px;"></span>${esc((nodes[l.source] || {}).label || "")}</td><td style="padding:5px;"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${(nodes[l.target] || {}).color || "#9A9488"};margin-right:4px;"></span>${esc((nodes[l.target] || {}).label || "")}</td><td style="padding:5px;">${esc(l.protocol || "")}</td><td style="padding:5px;font-weight:600;">${esc(l.value)}</td></tr>`).join("")}}
          </table>
        </div>`;
      }
      case "architecture-diagram": {
        const nodes = d.nodes || [];
        const connections = d.connections || [];
        return `<div style="margin:12px 0;font-family:'DM Mono',monospace;">
          ${d.title ? `<h3 style="font-family:'Fraunces',serif;margin:0 0 8px;">${esc(d.title)}</h3>` : ""}
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px;">${nodes.map((n) => `<div style="padding:6px 12px;border-radius:6px;background:${n.color || "#3498db"}15;border:1px solid ${n.color || "#3498db"};font-size:10px;font-weight:600;color:${n.color || "#3498db"};">${esc(n.label)}</div>`).join("")}</div>
          <div style="font-size:9px;color:#9A9488;">${connections.map((c) => { const f = nodes.find((n) => n.id === c.from); const t = nodes.find((n) => n.id === c.to); return `${esc((f || {}).label || c.from)} → ${esc((t || {}).label || c.to)} (${esc(c.label || "")})`; }).join(" | ")}</div>
        </div>`;
      }
      case "cloud-architecture": {
        const services = d.services || [];
        const connections = d.connections || [];
        const typeCol = { compute: "#e67e22", database: "#9b59b6", storage: "#3498db", loadbalancer: "#27ae60", network: "#e74c3c", security: "#c0392b", messaging: "#f39c12" };
        return `<div style="margin:12px 0;font-family:'DM Mono',monospace;">
          ${d.title ? `<h3 style="font-family:'Fraunces',serif;margin:0 0 8px;">${esc(d.title)}</h3>` : ""}
          ${d.provider ? `<div style="font-size:10px;color:#9A9488;margin-bottom:6px;">${esc(d.provider)} — ${esc(d.region || "")}</div>` : ""}
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px;">${services.map((s) => `<div style="padding:6px 12px;border-radius:6px;background:${(typeCol[s.type] || "#9A9488")}15;border:1px solid ${typeCol[s.type] || "#9A9488"};font-size:10px;"><div style="font-weight:600;color:${typeCol[s.type] || "#9A9488"};">${esc(s.label)}</div><div style="font-size:8px;color:#9A9488;">${esc(s.sublabel || "")}</div></div>`).join("")}</div>
          <div style="font-size:9px;color:#9A9488;">${connections.map((c) => { const f = services.find((s) => s.id === c.from); const t = services.find((s) => s.id === c.to); return `${esc((f || {}).label || c.from)} → ${esc((t || {}).label || c.to)} (${esc(c.label || "")})`; }).join(" | ")}</div>
        </div>`;
      }
      case "network-topology": {
        const devices = d.devices || [];
        const zones = d.zones || [];
        const flows = d.flows || [];
        const typeIcons = { server: "🖥️", router: "🔄", switch: "🔀", firewall: "🛡️", workstation: "💻", cloud: "☁️", database: "🗄️", printer: "🖨️", phone: "📱", ap: "📡" };
        return `<div style="margin:12px 0;font-family:'DM Mono',monospace;">
          ${d.title ? `<h3 style="font-family:'Fraunces',serif;margin:0 0 8px;">${esc(d.title)}</h3>` : ""}
          ${zones.length ? `<div style="display:flex;gap:6px;margin-bottom:8px;">${zones.map((z) => `<span style="padding:2px 8px;border-radius:3px;background:${z.color || "#3498db"}20;color:${z.color || "#3498db"};font-size:9px;font-weight:600;">${esc(z.label)}</span>`).join("")}</div>` : ""}
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px;">${devices.map((dev) => `<div style="padding:6px 10px;border-radius:6px;border:1px solid #E2DDD5;background:#FDFCF9;font-size:10px;text-align:center;"><div>${typeIcons[dev.type] || "📦"}</div><div style="font-weight:600;">${esc(dev.label)}</div><div style="font-size:8px;color:#9A9488;">${esc(dev.ip || "")}</div></div>`).join("")}</div>
          <div style="font-size:9px;color:#9A9488;">${flows.map((f) => { const src = devices.find((dev) => dev.id === f.from); const dst = devices.find((dev) => dev.id === f.to); return `${esc((src || {}).label || f.from)} → ${esc((dst || {}).label || f.to)} (${esc(f.label || "")})`; }).join(" | ")}</div>
        </div>`;
      }
      default:
        return "";
    }
  };

  const body = blocks.map(renderBlock).join("\n");
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(report.title || "Rapport")}</title>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600&family=DM+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; }
    body { max-width: 794px; margin: 40px auto; padding: 64px 72px; background: #FDFCF9; color: #1A1A18; }
    .arbor-cartouche { display:inline; font-family:'DM Mono',monospace; font-size:0.9em; background:rgba(26,26,24,0.06); color:#1A1A18; padding:2px 6px; border-radius:4px; border:1px solid rgba(26,26,24,0.1); cursor:pointer; }
    .arbor-badge { display:inline; font-family:'DM Mono',monospace; font-size:0.78em; font-weight:600; padding:2px 8px; border-radius:4px; letter-spacing:0.04em; text-transform:uppercase; white-space:nowrap; color:#fff; border:none; vertical-align:middle; line-height:1.4; }
    .arbor-badge-critical { background:#c0392b; }
    .arbor-badge-high { background:#e67e22; }
    .arbor-badge-medium { background:#f39c12; color:#fff; }
    .arbor-badge-low { background:#27ae60; }
    .arbor-badge-info { background:#2980b9; }
  </style>
</head>
<body>
${body}
</body>
</html>`;
}

function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"); }

export function ExportModal({ onClose }) {
  const report = useEditorStore((s) => s.report);
  const setReport = useEditorStore((s) => s.setReport);
  const [tab, setTab] = useState("html");
  const [jsonSource, setJsonSource] = useState("");
  const [jsonError, setJsonError] = useState(null);

  // Init JSON tab
  useEffect(() => {
    if (report) setJsonSource(JSON.stringify(report.content, null, 2));
  }, []);

  const htmlPreview = useMemo(() => report ? buildHtmlPreview(report) : "", [report, report?.content]);

  const handleJsonChange = useCallback((newVal) => {
    setJsonSource(newVal);
    try {
      const parsed = JSON.parse(newVal);
      setJsonError(null);
      // Apply live to store
      setReport({ ...report, content: parsed });
    } catch (e) {
      setJsonError(e.message);
    }
  }, [report, setReport]);

  const handleDownloadHtml = useCallback(() => {
    const blob = new Blob([htmlPreview], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report?.title || "rapport"}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }, [htmlPreview, report]);

  const handleDownloadJson = useCallback(() => {
    const blob = new Blob([jsonSource], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report?.title || "rapport"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [jsonSource, report]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return createPortal(
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: zIndex.modal,
        background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{
        background: colors.surface, borderRadius: radii.xl,
        boxShadow: colors.shadow.elevated,
        width: "92vw", maxWidth: 1200, height: "85vh",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        {/* Header with tabs */}
        <div style={{
          display: "flex", alignItems: "center",
          borderBottom: `1px solid ${colors.border}`,
          padding: "0 20px",
        }}>
          <span style={{
            fontFamily: typography.fontFamily.body,
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.semibold,
            color: colors.text.primary,
            padding: "14px 0", marginRight: 24,
          }}>
            Export
          </span>

          <div style={{ display: "flex", gap: 0, flex: 1 }}>
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  fontFamily: typography.fontFamily.body,
                  fontSize: typography.fontSize.sm,
                  padding: "14px 16px",
                  background: "transparent",
                  border: "none",
                  borderBottom: tab === t.id ? `2px solid ${colors.accentBright}` : "2px solid transparent",
                  color: tab === t.id ? colors.accentBright : colors.text.muted,
                  cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 6,
                  transition: "all 0.15s",
                  fontWeight: tab === t.id ? 600 : 400,
                }}
              >
                <FontAwesomeIcon icon={t.icon} style={{ fontSize: 11 }} />
                {t.label}
              </button>
            ))}
          </div>

          {/* Download buttons */}
          {tab === "html" && (
            <button
              onClick={handleDownloadHtml}
              style={{
                fontFamily: typography.fontFamily.body, fontSize: typography.fontSize.sm,
                padding: "7px 14px", borderRadius: radii.md,
                background: colors.drawer.bg, color: colors.text.onDark,
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              <FontAwesomeIcon icon="download" style={{ fontSize: 10 }} />
              Télécharger
            </button>
          )}
          {tab === "json" && (
            <button
              onClick={handleDownloadJson}
              style={{
                fontFamily: typography.fontFamily.body, fontSize: typography.fontSize.sm,
                padding: "7px 14px", borderRadius: radii.md,
                background: colors.drawer.bg, color: colors.text.onDark,
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              <FontAwesomeIcon icon="download" style={{ fontSize: 10 }} />
              Télécharger
            </button>
          )}

          <button
            onClick={onClose}
            style={{
              marginLeft: 12,
              background: "transparent", border: `1px solid ${colors.border}`,
              borderRadius: radii.md, width: 32, height: 32,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: colors.text.muted,
            }}
          >
            <FontAwesomeIcon icon="times" />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: "hidden" }}>
          {tab === "html" && (
            <iframe
              srcDoc={htmlPreview}
              style={{ width: "100%", height: "100%", border: "none", background: "#FDFCF9" }}
              sandbox="allow-same-origin"
              title="HTML Preview"
            />
          )}

          {tab === "pdf" && (
            <div style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
              height: "100%", color: colors.text.muted,
              fontFamily: typography.fontFamily.body, fontSize: typography.fontSize.lg,
              flexDirection: "column", gap: 12,
            }}>
              <FontAwesomeIcon icon="file-pdf" style={{ fontSize: 48, opacity: 0.2 }} />
              <span>Export PDF — Bientôt disponible</span>
            </div>
          )}

          {tab === "json" && (
            <div style={{ display: "flex", height: "100%" }}>
              {/* Editable JSON */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", borderRight: `1px solid ${colors.border}` }}>
                {jsonError && (
                  <div style={{
                    padding: "8px 16px",
                    background: `${colors.error}15`,
                    color: colors.error,
                    fontFamily: typography.fontFamily.body,
                    fontSize: typography.fontSize.sm,
                    borderBottom: `1px solid ${colors.error}30`,
                  }}>
                    JSON invalide : {jsonError}
                  </div>
                )}
                <textarea
                  value={jsonSource}
                  onChange={(e) => handleJsonChange(e.target.value)}
                  spellCheck={false}
                  style={{
                    flex: 1, resize: "none", border: "none", outline: "none",
                    padding: 20,
                    fontFamily: typography.fontFamily.body,
                    fontSize: typography.fontSize.sm,
                    lineHeight: 1.6, tabSize: 2,
                    background: "#0d1117", color: "#e6edf3",
                  }}
                />
              </div>

              {/* Live HTML preview */}
              <div style={{ width: "50%" }}>
                <iframe
                  srcDoc={htmlPreview}
                  style={{ width: "100%", height: "100%", border: "none", background: "#FDFCF9" }}
                  sandbox="allow-same-origin"
                  title="JSON Live Preview"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
