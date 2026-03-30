/**
 * Table Migration — Arbor Universal Table
 * Converts legacy table data and 14 specialized block formats to the universal table format.
 */
import { getPresetDefaults } from "./tablePresets";

/** Normalize any table data to the new column-based format */
export function normalizeTableData(data) {
  if (!data) return emptyTable();
  // New format: has columns array
  if (Array.isArray(data.columns)) return data;
  // Legacy format: { headers: string[], rows: string[][] }
  const headers = data.headers || [];
  const legacyRows = data.rows || [];
  return {
    title: data.title || "",
    subtitle: "",
    meta: data.meta || [],
    columns: headers.map((h, i) => ({
      id: `col_${i}`, header: h, type: "rich-text", align: "left", config: {},
    })),
    rows: legacyRows.map((row, ri) => ({
      id: `row_${ri}`,
      cells: Object.fromEntries(
        (Array.isArray(row) ? row : []).map((cell, ci) => [`col_${ci}`, cell])
      ),
    })),
    groups: [], groupByColumn: null, accentBorderColumn: null,
    legend: null, summaryBar: null, showMasked: false, preset: null,
  };
}

function emptyTable() {
  return {
    title: "", subtitle: "", meta: [],
    columns: [
      { id: "col_0", header: "Colonne 1", type: "rich-text", align: "left", config: {} },
      { id: "col_1", header: "Colonne 2", type: "rich-text", align: "left", config: {} },
    ],
    rows: [{ id: "row_0", cells: { col_0: "", col_1: "" } }],
    groups: [], groupByColumn: null, accentBorderColumn: null,
    legend: null, summaryBar: null, showMasked: false, preset: null,
  };
}

/** Migrators for each specialized block type */
export const BLOCK_MIGRATORS = {
  "port-scan-table": (data) => ({
    ...getPresetDefaults("port-scan"),
    title: data.title || "Résultats Nmap",
    meta: [
      ...(data.target ? [{ label: "Cible", value: data.target }] : []),
      ...(data.scanDate ? [{ label: "Date", value: data.scanDate }] : []),
    ],
    rows: (data.entries || []).map((e, i) => ({
      id: `row_${i}`,
      cells: { col_port: String(e.port), col_proto: (e.protocol || "tcp").toUpperCase(), col_state: (e.state || "open").toLowerCase(), col_service: e.service || "", col_version: e.version || "", col_info: e.info || "" },
    })),
  }),

  "credentials-table": (data) => ({
    ...getPresetDefaults("credentials"),
    title: data.title || "Identifiants découverts",
    showMasked: data.showPasswords === true,
    rows: (data.credentials || []).map((c, i) => ({
      id: `row_${i}`,
      cells: { col_username: c.username || "", col_password: c.password || "", col_source: c.source || "", col_type: (c.type || "").toLowerCase(), col_location: c.location || "", col_severity: (c.severity || "medium").toLowerCase() },
    })),
  }),

  "cve-table": (data) => ({
    ...getPresetDefaults("cve-table"),
    title: data.title || "CVE identifiées",
    rows: (data.cves || []).map((c, i) => ({
      id: `row_${i}`,
      cells: { col_id: c.id || "", col_cvss: c.cvss ?? null, col_severity: c.severity || sevFromScore(c.cvss), col_affected: c.affected || "", col_status: c.remediationStatus || "open", col_description: c.description || "" },
    })),
  }),

  "firewall-rules": (data) => ({
    ...getPresetDefaults("firewall-rules"),
    title: data.title || "Règles firewall",
    rows: (data.rules || []).map((r, i) => ({
      id: `row_${i}`,
      cells: { col_num: String(r.id ?? i + 1), col_source: r.source || "", col_destination: r.destination || "", col_port: String(r.port || ""), col_proto: (r.protocol || "tcp").toUpperCase(), col_action: (r.action || "deny").toLowerCase(), col_desc: r.description || "" },
    })),
  }),

  "server-inventory": (data) => ({
    ...getPresetDefaults("server-inventory"),
    title: data.title || "Inventaire des serveurs",
    rows: (data.servers || []).map((s, i) => ({
      id: `row_${i}`,
      cells: { col_hostname: s.hostname || "", col_ip: s.ip || "", col_os: s.os || "", col_role: s.role || "", col_patch: s.patchLevel || "", col_status: (s.status || "unknown").toLowerCase() },
    })),
  }),

  "dns-records": (data) => ({
    ...getPresetDefaults("dns-records"),
    title: data.title || "Enregistrements DNS",
    meta: data.domain ? [{ label: "Domaine", value: data.domain }] : [],
    rows: (data.records || []).map((r, i) => ({
      id: `row_${i}`,
      cells: { col_type: (r.type || "A").toUpperCase(), col_name: r.name || "", col_value: r.value || "", col_ttl: String(r.ttl || ""), col_priority: r.priority != null ? String(r.priority) : "" },
    })),
  }),

  "wireless-survey": (data) => ({
    ...getPresetDefaults("wireless-survey"),
    title: data.title || "Audit Wi-Fi",
    meta: [
      ...(data.location ? [{ label: "Emplacement", value: data.location }] : []),
      ...(data.date ? [{ label: "Date", value: data.date }] : []),
    ],
    rows: (data.networks || []).map((n, i) => ({
      id: `row_${i}`,
      cells: { col_ssid: n.ssid || "[Hidden]", col_bssid: n.bssid || "", col_channel: n.channel ?? null, col_signal: n.signal ?? -50, col_encryption: n.encryption || "?", col_notes: n.notes || "" },
    })),
  }),

  "risk-register": (data) => ({
    ...getPresetDefaults("risk-register"),
    title: data.title || "Registre des risques",
    rows: (data.risks || []).map((r, i) => {
      const l = r.likelihood || 1, imp = r.impact || 1;
      return {
        id: `row_${i}`,
        cells: { col_id: r.id || "", col_name: r.name || "", col_category: r.category || "", col_likelihood: l, col_impact: imp, col_inherent: r.inherentRisk ?? l * imp, col_controls: Array.isArray(r.controls) ? r.controls.length : 0, col_residual: r.residualRisk ?? (r.inherentRisk ?? l * imp), col_owner: r.owner || "", col_status: (r.status || "active").toLowerCase() },
      };
    }),
  }),

  "action-plan": (data) => ({
    ...getPresetDefaults("action-plan"),
    title: data.title || "Plan d'Action",
    rows: (data.actions || []).map((a, i) => ({
      id: `row_${i}`, _group: a.quarter || "",
      cells: { col_id: a.id || "", col_action: a.action || "", col_responsible: a.responsible || "", col_deadline: a.deadline || "", col_priority: (a.priority || "medium").toLowerCase(), col_status: (a.status || "todo").toLowerCase(), col_progress: a.progress ?? 0, col_quarter: a.quarter || "" },
    })),
  }),

  "raci-matrix": (data) => {
    const stakeholders = data.stakeholders || [];
    const tasks = data.tasks || [];
    const assignments = data.assignments || [];
    const lookup = new Map();
    for (const a of assignments) lookup.set(`${a.task}::${a.stakeholder}`, a.role);
    const cfg = { colorMap: { R: { bg: "#27ae60" }, A: { bg: "#e74c3c" }, C: { bg: "#f39c12" }, I: { bg: "#3498db" } }, emptySymbol: "—" };
    return {
      ...getPresetDefaults("raci-matrix"),
      title: data.title || "Matrice RACI",
      columns: [
        { id: "col_task", header: "Tâche", type: "text", align: "left", config: {}, width: 180 },
        ...stakeholders.map((s) => ({ id: `col_${s.id}`, header: s.name, type: "circle-badge", align: "center", config: cfg })),
      ],
      rows: tasks.map((t, i) => ({
        id: `row_${i}`,
        cells: { col_task: t.task, ...Object.fromEntries(stakeholders.map((s) => [`col_${s.id}`, lookup.get(`${t.id}::${s.id}`) || ""])) },
      })),
    };
  },

  "compliance-checklist": (data) => {
    const sections = data.sections || [];
    const rows = [];
    const groups = [];
    for (const sec of sections) {
      groups.push({ key: sec.id, label: sec.title || sec.id });
      for (const ctrl of (sec.controls || [])) {
        rows.push({
          id: `row_${rows.length}`, _group: sec.id,
          cells: { col_section: sec.id, col_status: ctrl.status || "na", col_ctrl_id: ctrl.id || "", col_desc: ctrl.description || "", col_notes: ctrl.notes || "" },
        });
      }
    }
    return { ...getPresetDefaults("compliance-checklist"), title: data.title || "Checklist conformité", meta: data.framework ? [{ label: "Framework", value: data.framework }] : [], groups, rows };
  },

  "ebios-feared-events": (data) => ({
    ...getPresetDefaults("ebios-feared-events"),
    title: data.title || "Événements Redoutés EBIOS",
    rows: (data.events || []).map((e, i) => ({
      id: `row_${i}`,
      cells: { col_id: e.id || "", col_value: e.essentialValue || "", col_event: e.fearedEvent || "", col_severity: String(e.severity || 2), col_impact: e.impactType || "", col_source: e.source || "" },
    })),
  }),

  "ebios-scenarios": (data) => ({
    ...getPresetDefaults("ebios-scenarios"),
    title: data.title || "Scénarios de Risque EBIOS",
    rows: (data.scenarios || []).map((s, i) => ({
      id: `row_${i}`,
      cells: { col_id: s.id || "", col_name: s.name || "", col_type: (s.type || "operational").toLowerCase(), col_likelihood: s.likelihood || 2, col_severity: s.severity || 2, col_inherent: s.inherentRisk || ((s.likelihood || 2) * (s.severity || 2)), col_treatment: (s.treatment || "reduce").toLowerCase(), col_owner: s.owner || "" },
    })),
  }),

  "control-matrix": (data) => {
    const controls = data.controls || [];
    const threats = data.threats || [];
    const coverage = data.coverage || [];
    const coverageLookup = new Map();
    for (const c of coverage) coverageLookup.set(`${c.control}::${c.threat}`, c.effectiveness);
    const threatCfg = { ranges: [{ min: 4, max: 5, bg: "#27ae6018", text: "#27ae60" }, { min: 2, max: 3, bg: "#f39c1218", text: "#f39c12" }, { min: 0, max: 1, bg: "#e74c3c18", text: "#e74c3c" }] };
    return {
      ...getPresetDefaults("control-matrix"),
      title: data.title || "Matrice des Contrôles",
      columns: [
        { id: "col_id", header: "ID", type: "row-id", align: "left", config: { accentColored: false } },
        { id: "col_name", header: "Contrôle", type: "text", align: "left", config: {} },
        { id: "col_type", header: "Type", type: "badge", align: "left", config: { colorMap: { preventive: { bg: "#3498db18", text: "#3498db", label: "Préventif" }, detective: { bg: "#e67e2218", text: "#e67e22", label: "Détectif" }, corrective: { bg: "#27ae6018", text: "#27ae60", label: "Correctif" } }, shape: "rounded", uppercase: false } },
        { id: "col_freq", header: "Fréquence", type: "text", align: "left", config: {} },
        { id: "col_eff", header: "Efficacité", type: "score-badge", align: "center", config: { ranges: [{ min: 5, max: 5, bg: "#27ae6018", text: "#27ae60" }, { min: 4, max: 4, bg: "#3498db18", text: "#3498db" }, { min: 3, max: 3, bg: "#f39c1218", text: "#f39c12" }, { min: 1, max: 2, bg: "#e74c3c18", text: "#e74c3c" }] } },
        ...threats.map((t) => ({ id: `col_${t.id}`, header: t.name, type: "score-badge", align: "center", config: threatCfg })),
      ],
      rows: controls.map((c, i) => ({
        id: `row_${i}`,
        cells: {
          col_id: c.id, col_name: c.name, col_type: c.type, col_freq: c.frequency || "", col_eff: c.effectiveness,
          ...Object.fromEntries(threats.map((t) => [`col_${t.id}`, coverageLookup.get(`${c.id}::${t.id}`) ?? null])),
        },
      })),
    };
  },

  // Scope block → two sub-tables (in-scope / out-of-scope)
  "scope-block": (data) => {
    const all = [...(data.inScope || []).map((s) => ({ ...s, _scope: "in" })), ...(data.outOfScope || []).map((s) => ({ ...s, _scope: "out" }))];
    return {
      title: data.title || "Périmètre d'audit",
      subtitle: "", meta: [],
      columns: [
        { id: "col_scope", header: "Scope", type: "badge", align: "left", config: { colorMap: { in: { bg: "#27ae6018", text: "#27ae60", label: "In Scope" }, out: { bg: "#e74c3c18", text: "#e74c3c", label: "Out of Scope" } }, shape: "rounded", uppercase: false } },
        { id: "col_target", header: "Cible", type: "mono", align: "left", config: {} },
        { id: "col_type", header: "Type", type: "badge", align: "left", config: { colorMap: { network: { bg: "#3498db18", text: "#3498db" }, web: { bg: "#27ae6018", text: "#27ae60" }, api: { bg: "#9b59b618", text: "#9b59b6" }, mobile: { bg: "#e67e2218", text: "#e67e22" }, cloud: { bg: "#1abc9c18", text: "#1abc9c" } }, shape: "pill", uppercase: false } },
        { id: "col_desc", header: "Description", type: "text", align: "left", config: {} },
      ],
      rows: all.map((s, i) => ({
        id: `row_${i}`,
        cells: { col_scope: s._scope, col_target: s.target || "", col_type: (s.type || "").toLowerCase(), col_desc: s.description || "" },
      })),
      groups: [], groupByColumn: null, accentBorderColumn: null,
      legend: null, summaryBar: null, showMasked: false, preset: null,
    };
  },
};

function sevFromScore(cvss) {
  if (cvss == null) return "none";
  if (cvss >= 9) return "critical";
  if (cvss >= 7) return "high";
  if (cvss >= 4) return "medium";
  if (cvss > 0) return "low";
  return "none";
}
