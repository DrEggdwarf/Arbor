/**
 * Table Presets — Arbor Universal Table
 * Each preset defines columns, sample rows, and optional features.
 */

// ── Shared color maps ─────────────────────────────────────────
const SEVERITY_MAP = {
  critical: { bg: "#c0392b", text: "#fff", label: "Critique" },
  high: { bg: "#e67e22", text: "#fff", label: "Élevé" },
  medium: { bg: "#f39c12", text: "#fff", label: "Moyen" },
  low: { bg: "#27ae60", text: "#fff", label: "Faible" },
};

const RISK_SCORE_RANGES = [
  { min: 16, max: 25, bg: "#F8D7DA", text: "#842029" },
  { min: 10, max: 15, bg: "#FDDCB5", text: "#9C4221" },
  { min: 5, max: 9, bg: "#FFF3CD", text: "#856404" },
  { min: 0, max: 4, bg: "#D4EDDA", text: "#2D7A47" },
];

const RACI_CONFIG = {
  colorMap: {
    R: { bg: "#27ae60" },
    A: { bg: "#e74c3c" },
    C: { bg: "#f39c12" },
    I: { bg: "#3498db" },
  },
  emptySymbol: "—",
};

const EBIOS_SEVERITY_RANGES = [
  { min: 4, max: 4, bg: "#c0392b18", text: "#c0392b" },
  { min: 3, max: 3, bg: "#e67e2218", text: "#e67e22" },
  { min: 2, max: 2, bg: "#f39c1218", text: "#f39c12" },
  { min: 1, max: 1, bg: "#27ae6018", text: "#27ae60" },
];

// ── Presets ────────────────────────────────────────────────────
export const TABLE_PRESETS = [
  // 1. Port Scan
  {
    id: "port-scan",
    label: "Scan de ports",
    icon: "search",
    category: "network",
    defaultTitle: "Résultats Nmap",
    defaultMeta: [{ label: "Cible", value: "192.168.1.1" }, { label: "Date", value: "2026-03-30" }],
    columns: [
      { id: "col_port", header: "Port", type: "mono", align: "left", config: {} },
      { id: "col_proto", header: "Proto", type: "text", align: "left", config: {} },
      { id: "col_state", header: "État", type: "badge", align: "left", config: { colorMap: { open: { bg: "#27ae60", text: "#fff" }, closed: { bg: "#e74c3c", text: "#fff" }, filtered: { bg: "#e67e22", text: "#fff" }, "open|filtered": { bg: "#f39c12", text: "#fff" } }, shape: "pill", uppercase: true } },
      { id: "col_service", header: "Service", type: "text", align: "left", config: {} },
      { id: "col_version", header: "Version", type: "mono", align: "left", config: {} },
      { id: "col_info", header: "Info", type: "text", align: "left", config: {} },
    ],
    sampleRows: [
      { id: "row_0", cells: { col_port: "22", col_proto: "TCP", col_state: "open", col_service: "ssh", col_version: "OpenSSH 8.9", col_info: "" } },
      { id: "row_1", cells: { col_port: "80", col_proto: "TCP", col_state: "open", col_service: "http", col_version: "nginx 1.24", col_info: "" } },
      { id: "row_2", cells: { col_port: "443", col_proto: "TCP", col_state: "open", col_service: "https", col_version: "nginx 1.24", col_info: "" } },
      { id: "row_3", cells: { col_port: "3306", col_proto: "TCP", col_state: "filtered", col_service: "mysql", col_version: "", col_info: "Firewall" } },
    ],
  },

  // 2. Credentials
  {
    id: "credentials",
    label: "Identifiants",
    icon: "key",
    category: "pentest",
    defaultTitle: "Identifiants découverts",
    defaultMeta: [],
    showMasked: false,
    columns: [
      { id: "col_username", header: "Username", type: "mono", align: "left", config: {} },
      { id: "col_password", header: "Password", type: "masked", align: "left", config: {} },
      { id: "col_source", header: "Source", type: "text", align: "left", config: {} },
      { id: "col_type", header: "Type", type: "badge", align: "left", config: { colorMap: { database: { bg: "transparent", text: "#807D76" }, ssh: { bg: "transparent", text: "#807D76" }, web: { bg: "transparent", text: "#807D76" }, ldap: { bg: "transparent", text: "#807D76" }, ftp: { bg: "transparent", text: "#807D76" } }, shape: "pill", uppercase: false } },
      { id: "col_location", header: "Location", type: "text", align: "left", config: {} },
      { id: "col_severity", header: "Severity", type: "badge", align: "left", config: { colorMap: { critical: { bg: "#c0392b", text: "#fff", label: "Critical" }, high: { bg: "#e67e22", text: "#fff", label: "High" }, medium: { bg: "#f39c12", text: "#fff", label: "Medium" }, low: { bg: "#27ae60", text: "#fff", label: "Low" } }, shape: "pill", uppercase: true } },
    ],
    sampleRows: [
      { id: "row_0", cells: { col_username: "admin", col_password: "P@ssw0rd!", col_source: "Brute force", col_type: "database", col_location: "MySQL 192.168.1.10", col_severity: "critical" } },
      { id: "row_1", cells: { col_username: "backup", col_password: "backup123", col_source: "Config file", col_type: "ssh", col_location: "SSH 192.168.1.20", col_severity: "high" } },
    ],
  },

  // 3. CVE Table
  {
    id: "cve-table",
    label: "Table CVE",
    icon: "shield-alt",
    category: "pentest",
    defaultTitle: "CVE identifiées",
    defaultMeta: [],
    columns: [
      { id: "col_id", header: "CVE", type: "row-id", align: "left", config: { accentColored: false } },
      { id: "col_cvss", header: "CVSS", type: "score-badge", align: "center", config: { ranges: [{ min: 9.0, max: 10, bg: "#c0392b18", text: "#c0392b" }, { min: 7.0, max: 8.9, bg: "#e67e2218", text: "#e67e22" }, { min: 4.0, max: 6.9, bg: "#f39c1218", text: "#f39c12" }, { min: 0.1, max: 3.9, bg: "#27ae6018", text: "#27ae60" }, { min: 0, max: 0, bg: "#95a5a618", text: "#95a5a6" }] } },
      { id: "col_severity", header: "Sév.", type: "badge", align: "left", config: { colorMap: { critical: { bg: "#c0392b", text: "#fff", label: "CRITIQUE" }, high: { bg: "#e67e22", text: "#fff", label: "ÉLEVÉ" }, medium: { bg: "#f39c12", text: "#fff", label: "MOYEN" }, low: { bg: "#27ae60", text: "#fff", label: "FAIBLE" }, none: { bg: "#95a5a6", text: "#fff", label: "AUCUN" } }, shape: "rounded", uppercase: true } },
      { id: "col_affected", header: "Composant", type: "text", align: "left", config: {} },
      { id: "col_status", header: "Statut", type: "badge", align: "left", config: { colorMap: { open: { bg: "#e74c3c18", text: "#e74c3c", label: "Non corrigé" }, in_progress: { bg: "#e67e2218", text: "#e67e22", label: "En cours" }, fixed: { bg: "#27ae6018", text: "#27ae60", label: "Corrigé" }, accepted: { bg: "#3498db18", text: "#3498db", label: "Accepté" }, wontfix: { bg: "#95a5a618", text: "#95a5a6", label: "Ignoré" } }, shape: "rounded", uppercase: false } },
      { id: "col_description", header: "Description", type: "text", align: "left", config: {} },
    ],
    sampleRows: [
      { id: "row_0", cells: { col_id: "CVE-2024-21762", col_cvss: 9.8, col_severity: "critical", col_affected: "FortiOS 7.2.x", col_status: "fixed", col_description: "FortiOS RCE via SSL VPN" } },
      { id: "row_1", cells: { col_id: "CVE-2023-44487", col_cvss: 7.5, col_severity: "high", col_affected: "nginx 1.24", col_status: "in_progress", col_description: "HTTP/2 Rapid Reset DDoS" } },
    ],
  },

  // 4. Firewall Rules
  {
    id: "firewall-rules",
    label: "Règles firewall",
    icon: "shield-alt",
    category: "network",
    defaultTitle: "Règles firewall",
    defaultMeta: [],
    columns: [
      { id: "col_num", header: "#", type: "row-id", align: "left", config: { accentColored: false } },
      { id: "col_source", header: "Source", type: "mono", align: "left", config: {} },
      { id: "col_destination", header: "Destination", type: "mono", align: "left", config: {} },
      { id: "col_port", header: "Port", type: "mono", align: "left", config: {} },
      { id: "col_proto", header: "Proto", type: "text", align: "left", config: {} },
      { id: "col_action", header: "Action", type: "badge", align: "left", config: { colorMap: { allow: { bg: "#27ae60", text: "#fff" }, deny: { bg: "#e74c3c", text: "#fff" }, drop: { bg: "#c0392b", text: "#fff" }, reject: { bg: "#e67e22", text: "#fff" }, log: { bg: "#3498db", text: "#fff" } }, shape: "rounded", uppercase: true } },
      { id: "col_desc", header: "Description", type: "text", align: "left", config: {} },
    ],
    sampleRows: [
      { id: "row_0", cells: { col_num: "1", col_source: "any", col_destination: "10.0.1.10", col_port: "443", col_proto: "TCP", col_action: "allow", col_desc: "HTTPS vers Web" } },
      { id: "row_1", cells: { col_num: "2", col_source: "10.0.1.0/24", col_destination: "10.0.2.10", col_port: "3306", col_proto: "TCP", col_action: "allow", col_desc: "SQL interne" } },
      { id: "row_2", cells: { col_num: "3", col_source: "any", col_destination: "any", col_port: "*", col_proto: "any", col_action: "deny", col_desc: "Deny all" } },
    ],
  },

  // 5. Server Inventory
  {
    id: "server-inventory",
    label: "Inventaire serveurs",
    icon: "server",
    category: "network",
    defaultTitle: "Inventaire des serveurs",
    defaultMeta: [],
    columns: [
      { id: "col_hostname", header: "Hostname", type: "mono", align: "left", config: {} },
      { id: "col_ip", header: "IP", type: "mono", align: "left", config: {} },
      { id: "col_os", header: "OS", type: "text", align: "left", config: {} },
      { id: "col_role", header: "Rôle", type: "text", align: "left", config: {} },
      { id: "col_patch", header: "Patch", type: "text", align: "left", config: {} },
      { id: "col_status", header: "Statut", type: "status-dot", align: "left", config: { colorMap: { online: "#27ae60", offline: "#e74c3c", maintenance: "#e67e22", degraded: "#f39c12", unknown: "#95a5a6" } } },
    ],
    sampleRows: [
      { id: "row_0", cells: { col_hostname: "web-01", col_ip: "10.0.1.10", col_os: "Ubuntu 22.04", col_role: "Web", col_patch: "2026-03", col_status: "online" } },
      { id: "row_1", cells: { col_hostname: "db-01", col_ip: "10.0.2.10", col_os: "Debian 12", col_role: "Database", col_patch: "2026-02", col_status: "online" } },
      { id: "row_2", cells: { col_hostname: "backup-01", col_ip: "10.0.3.10", col_os: "CentOS 9", col_role: "Backup", col_patch: "2025-12", col_status: "maintenance" } },
    ],
  },

  // 6. DNS Records
  {
    id: "dns-records",
    label: "Enregistrements DNS",
    icon: "globe",
    category: "network",
    defaultTitle: "Enregistrements DNS",
    defaultMeta: [{ label: "Domaine", value: "example.com" }],
    columns: [
      { id: "col_type", header: "Type", type: "badge", align: "left", config: { colorMap: { A: { bg: "#3498db", text: "#fff" }, AAAA: { bg: "#2980b9", text: "#fff" }, CNAME: { bg: "#9b59b6", text: "#fff" }, MX: { bg: "#e67e22", text: "#fff" }, TXT: { bg: "#27ae60", text: "#fff" }, NS: { bg: "#1abc9c", text: "#fff" }, SOA: { bg: "#34495e", text: "#fff" }, PTR: { bg: "#e74c3c", text: "#fff" }, SRV: { bg: "#f39c12", text: "#fff" } }, shape: "rounded", uppercase: true } },
      { id: "col_name", header: "Nom", type: "mono", align: "left", config: {} },
      { id: "col_value", header: "Valeur", type: "mono", align: "left", config: {} },
      { id: "col_ttl", header: "TTL", type: "text", align: "left", config: {} },
      { id: "col_priority", header: "Priorité", type: "text", align: "left", config: {} },
    ],
    sampleRows: [
      { id: "row_0", cells: { col_type: "A", col_name: "@", col_value: "93.184.216.34", col_ttl: "3600", col_priority: "" } },
      { id: "row_1", cells: { col_type: "MX", col_name: "@", col_value: "mail.example.com", col_ttl: "3600", col_priority: "10" } },
      { id: "row_2", cells: { col_type: "CNAME", col_name: "www", col_value: "example.com", col_ttl: "3600", col_priority: "" } },
    ],
  },

  // 7. Wireless Survey
  {
    id: "wireless-survey",
    label: "Audit Wi-Fi",
    icon: "wifi",
    category: "network",
    defaultTitle: "Audit Wi-Fi",
    defaultMeta: [{ label: "Emplacement", value: "Bureau 3ème étage" }, { label: "Date", value: "2026-03-30" }],
    columns: [
      { id: "col_ssid", header: "SSID", type: "mono", align: "left", config: {} },
      { id: "col_bssid", header: "BSSID", type: "text", align: "left", config: {} },
      { id: "col_channel", header: "Canal", type: "number", align: "center", config: {} },
      { id: "col_signal", header: "Signal", type: "progress", align: "left", config: { max: 100, normalize: "addOffset", normalizeParam: 100, showLabel: true, suffix: " dBm", colorRanges: [{ min: 70, max: 100, color: "#27ae60" }, { min: 40, max: 69, color: "#f39c12" }, { min: 0, max: 39, color: "#e74c3c" }] } },
      { id: "col_encryption", header: "Chiffrement", type: "badge", align: "left", config: { colorMap: { "WPA3": { bg: "#27ae6015", text: "#27ae60" }, "WPA2-Enterprise": { bg: "#2ecc7115", text: "#2ecc71" }, WPA2: { bg: "#3498db15", text: "#3498db" }, WPA: { bg: "#f39c1215", text: "#f39c12" }, WEP: { bg: "#e74c3c15", text: "#e74c3c" }, Open: { bg: "#c0392b15", text: "#c0392b" } }, shape: "rounded", uppercase: false } },
      { id: "col_notes", header: "Remarques", type: "text", align: "left", config: {} },
    ],
    sampleRows: [
      { id: "row_0", cells: { col_ssid: "Corp-Secure", col_bssid: "AA:BB:CC:DD:EE:01", col_channel: 6, col_signal: -42, col_encryption: "WPA2-Enterprise", col_notes: "Réseau principal" } },
      { id: "row_1", cells: { col_ssid: "Guest", col_bssid: "AA:BB:CC:DD:EE:02", col_channel: 11, col_signal: -55, col_encryption: "WPA2", col_notes: "Réseau invités" } },
      { id: "row_2", cells: { col_ssid: "IoT-Devices", col_bssid: "AA:BB:CC:DD:EE:03", col_channel: 1, col_signal: -68, col_encryption: "WPA", col_notes: "Non segmenté!" } },
    ],
  },

  // 8. Risk Register
  {
    id: "risk-register",
    label: "Registre des risques",
    icon: "clipboard-list",
    category: "grc",
    defaultTitle: "Registre des Risques",
    defaultMeta: [],
    columns: [
      { id: "col_id", header: "ID", type: "row-id", align: "left", config: { accentColored: false } },
      { id: "col_name", header: "Risque", type: "text", align: "left", config: {} },
      { id: "col_category", header: "Catégorie", type: "text", align: "left", config: {} },
      { id: "col_likelihood", header: "L", type: "number", align: "center", config: {} },
      { id: "col_impact", header: "I", type: "number", align: "center", config: {} },
      { id: "col_inherent", header: "Risque Brut", type: "score-badge", align: "center", config: { ranges: RISK_SCORE_RANGES } },
      { id: "col_controls", header: "Contrôles", type: "number", align: "center", config: { suffix: " ctrl." } },
      { id: "col_residual", header: "Risque Rés.", type: "score-badge", align: "center", config: { ranges: RISK_SCORE_RANGES } },
      { id: "col_owner", header: "Propriétaire", type: "text", align: "left", config: {} },
      { id: "col_status", header: "Statut", type: "badge", align: "center", config: { colorMap: { active: { bg: "#FDDCB5", text: "#9C4221", label: "Actif" }, mitigated: { bg: "#D6E9F8", text: "#2A6496", label: "Atténué" }, accepted: { bg: "#D4EDDA", text: "#2D7A47", label: "Accepté" }, closed: { bg: "#E8E8E8", text: "#666", label: "Clôturé" } }, shape: "pill", uppercase: false } },
    ],
    sampleRows: [
      { id: "row_0", cells: { col_id: "RISK001", col_name: "Incident de sécurité majeur", col_category: "Cybersécurité", col_likelihood: 3, col_impact: 5, col_inherent: 15, col_controls: 3, col_residual: 6, col_owner: "CISO", col_status: "active" } },
      { id: "row_1", cells: { col_id: "RISK002", col_name: "Indisponibilité de service", col_category: "Infrastructure", col_likelihood: 2, col_impact: 4, col_inherent: 8, col_controls: 3, col_residual: 3, col_owner: "Infrastructure Manager", col_status: "mitigated" } },
    ],
  },

  // 9. Action Plan
  {
    id: "action-plan",
    label: "Plan d'action",
    icon: "tasks",
    category: "grc",
    defaultTitle: "Plan d'Action Sécurité",
    defaultMeta: [],
    groupByColumn: "col_quarter",
    groups: [{ key: "Q1", label: "Q1" }, { key: "Q2", label: "Q2" }, { key: "Q3", label: "Q3" }, { key: "Q4", label: "Q4" }],
    columns: [
      { id: "col_id", header: "ID", type: "row-id", align: "left", config: { accentColored: true } },
      { id: "col_action", header: "Action", type: "text", align: "left", config: {} },
      { id: "col_responsible", header: "Responsable", type: "text", align: "left", config: {} },
      { id: "col_deadline", header: "Échéance", type: "text", align: "left", config: {} },
      { id: "col_priority", header: "Priorité", type: "badge", align: "left", config: { colorMap: { critical: { bg: "#F8D7DA", text: "#842029", label: "Critique" }, high: { bg: "#FDDCB5", text: "#9C4221", label: "Haute" }, medium: { bg: "#FFF3CD", text: "#856404", label: "Moyenne" }, low: { bg: "#D4EDDA", text: "#2D7A47", label: "Basse" } }, shape: "rounded", uppercase: false } },
      { id: "col_status", header: "Statut", type: "badge", align: "left", config: { colorMap: { todo: { bg: "#E2DDD5", text: "#4A4840", label: "À faire" }, "in-progress": { bg: "#D6EAF8", text: "#2471A3", label: "En cours" }, done: { bg: "#D4EDDA", text: "#2D7A47", label: "Terminé" } }, shape: "rounded", uppercase: false } },
      { id: "col_progress", header: "Progression", type: "progress", align: "left", config: { max: 100, showLabel: true, suffix: "%", colorRanges: [{ min: 80, max: 100, color: "#2D7A47" }, { min: 40, max: 79, color: "#2471A3" }, { min: 0, max: 39, color: "#4A4840" }] } },
      { id: "col_quarter", header: "Trimestre", type: "text", align: "left", config: {}, hidden: true },
    ],
    sampleRows: [
      { id: "row_0", _group: "Q2", cells: { col_id: "ACT001", col_action: "Déployer MFA sur tous les accès admin", col_responsible: "Équipe IAM", col_deadline: "2024-06-30", col_priority: "critical", col_status: "in-progress", col_progress: 65, col_quarter: "Q2" } },
      { id: "row_1", _group: "Q2", cells: { col_id: "ACT002", col_action: "Audit extern ISO 27001", col_responsible: "CISO", col_deadline: "2024-04-30", col_priority: "high", col_status: "todo", col_progress: 0, col_quarter: "Q2" } },
    ],
  },

  // 10. RACI Matrix
  {
    id: "raci-matrix",
    label: "Matrice RACI",
    icon: "border-all",
    category: "grc",
    defaultTitle: "Matrice RACI — Processus de Sécurité",
    defaultMeta: [],
    legend: [
      { symbol: "R", bg: "#27ae60", label: "Responsable" },
      { symbol: "A", bg: "#e74c3c", label: "Approbateur" },
      { symbol: "C", bg: "#f39c12", label: "Consulté" },
      { symbol: "I", bg: "#3498db", label: "Informé" },
    ],
    columnTemplate: { type: "circle-badge", align: "center", config: RACI_CONFIG },
    columns: [
      { id: "col_task", header: "Tâche", type: "text", align: "left", config: {}, width: 180 },
      { id: "col_s1", header: "CISO", type: "circle-badge", align: "center", config: RACI_CONFIG },
      { id: "col_s2", header: "IT Manager", type: "circle-badge", align: "center", config: RACI_CONFIG },
      { id: "col_s3", header: "Resp. Sécurité", type: "circle-badge", align: "center", config: RACI_CONFIG },
      { id: "col_s4", header: "DPO", type: "circle-badge", align: "center", config: RACI_CONFIG },
    ],
    sampleRows: [
      { id: "row_0", cells: { col_task: "Gestion des incidents critiques", col_s1: "A", col_s2: "R", col_s3: "C", col_s4: "I" } },
      { id: "row_1", cells: { col_task: "Approbation politique de sécurité", col_s1: "R", col_s2: "C", col_s3: "", col_s4: "" } },
      { id: "row_2", cells: { col_task: "Audit de sécurité interne", col_s1: "C", col_s2: "R", col_s3: "A", col_s4: "" } },
    ],
  },

  // 11. Compliance Checklist
  {
    id: "compliance-checklist",
    label: "Checklist conformité",
    icon: "clipboard-check",
    category: "grc",
    defaultTitle: "Checklist Conformité ISO 27001",
    defaultMeta: [{ label: "Framework", value: "ISO 27001:2022" }],
    groupByColumn: "col_section",
    groups: [
      { key: "A5", label: "Organisation : Contrôles d'organisation" },
      { key: "A8", label: "Actifs : Gestion des actifs" },
    ],
    summaryBar: "col_status",
    columns: [
      { id: "col_section", header: "Section", type: "text", align: "left", config: {}, hidden: true },
      { id: "col_status", header: "", type: "icon-status", align: "center", config: { statusMap: { compliant: { icon: "✓", color: "#27ae60", label: "Conforme" }, partial: { icon: "⚠", color: "#f39c12", label: "Partiel" }, "non-compliant": { icon: "✗", color: "#c0392b", label: "Non conforme" }, na: { icon: "—", color: "#95a5a6", label: "N/A" } } }, width: "min" },
      { id: "col_ctrl_id", header: "ID", type: "mono", align: "left", config: {} },
      { id: "col_desc", header: "Description", type: "text", align: "left", config: {} },
      { id: "col_notes", header: "Notes", type: "text", align: "left", config: {} },
    ],
    sampleRows: [
      { id: "row_0", _group: "A5", cells: { col_section: "A5", col_status: "compliant", col_ctrl_id: "A.5.1", col_desc: "Politiques pour la sécurité de l'information", col_notes: "Policies v2.1 approved" } },
      { id: "row_1", _group: "A5", cells: { col_section: "A5", col_status: "partial", col_ctrl_id: "A.5.3", col_desc: "Séparation des responsabilités", col_notes: "En cours" } },
      { id: "row_2", _group: "A8", cells: { col_section: "A8", col_status: "compliant", col_ctrl_id: "A.8.1", col_desc: "Inventaire des actifs", col_notes: "CMDB managed" } },
      { id: "row_3", _group: "A8", cells: { col_section: "A8", col_status: "non-compliant", col_ctrl_id: "A.8.2", col_desc: "Propriété des actifs", col_notes: "À assigner" } },
    ],
  },

  // 12. EBIOS Feared Events
  {
    id: "ebios-feared-events",
    label: "Événements redoutés",
    icon: "list-check",
    category: "grc",
    defaultTitle: "Événements Redoutés EBIOS",
    defaultMeta: [],
    accentBorderColumn: "col_severity",
    columns: [
      { id: "col_id", header: "ID", type: "row-id", align: "left", config: { accentColored: false } },
      { id: "col_value", header: "Bien essentiel", type: "text", align: "left", config: {} },
      { id: "col_event", header: "Événement redouté", type: "text", align: "left", config: {} },
      { id: "col_severity", header: "Gravité", type: "badge", align: "left", config: { colorMap: { "1": { bg: "#27ae6018", text: "#27ae60", label: "Faible" }, "2": { bg: "#f39c1218", text: "#f39c12", label: "Moyen" }, "3": { bg: "#e67e2218", text: "#e67e22", label: "Élevé" }, "4": { bg: "#c0392b18", text: "#c0392b", label: "Critique" } }, shape: "pill", uppercase: true } },
      { id: "col_impact", header: "Type d'impact", type: "text", align: "left", config: {} },
      { id: "col_source", header: "Source de risque", type: "text", align: "left", config: {} },
    ],
    sampleRows: [
      { id: "row_0", cells: { col_id: "EV001", col_value: "Données confidentielles clients", col_event: "Vol de données confidentielles", col_severity: "4", col_impact: "Confidentialité", col_source: "Groupe APT" } },
      { id: "row_1", cells: { col_id: "EV002", col_value: "Disponibilité du service", col_event: "Indisponibilité du service >4h", col_severity: "3", col_impact: "Disponibilité", col_source: "Attaquant financier" } },
    ],
  },

  // 13. EBIOS Scenarios
  {
    id: "ebios-scenarios",
    label: "Scénarios EBIOS",
    icon: "chess",
    category: "grc",
    defaultTitle: "Scénarios de Risque EBIOS",
    defaultMeta: [],
    columns: [
      { id: "col_id", header: "ID", type: "row-id", align: "left", config: { accentColored: false } },
      { id: "col_name", header: "Scénario", type: "text", align: "left", config: {} },
      { id: "col_type", header: "Type", type: "badge", align: "left", config: { colorMap: { operational: { bg: "#3498db", text: "#fff", label: "Opérationnel" }, strategic: { bg: "#8e44ad", text: "#fff", label: "Stratégique" } }, shape: "pill", uppercase: true } },
      { id: "col_likelihood", header: "Vrais.", type: "score-badge", align: "center", config: { ranges: EBIOS_SEVERITY_RANGES } },
      { id: "col_severity", header: "Gravité", type: "score-badge", align: "center", config: { ranges: EBIOS_SEVERITY_RANGES } },
      { id: "col_inherent", header: "Risque", type: "score-badge", align: "center", config: { ranges: [{ min: 12, max: 16, bg: "#c0392b", text: "#fff" }, { min: 8, max: 11, bg: "#e67e22", text: "#fff" }, { min: 4, max: 7, bg: "#f39c12", text: "#fff" }, { min: 1, max: 3, bg: "#27ae60", text: "#fff" }] } },
      { id: "col_treatment", header: "Traitement", type: "badge", align: "left", config: { colorMap: { reduce: { bg: "#3498db", text: "#fff", label: "Réduire" }, accept: { bg: "#27ae60", text: "#fff", label: "Accepter" }, transfer: { bg: "#f39c12", text: "#fff", label: "Transférer" }, avoid: { bg: "#c0392b", text: "#fff", label: "Éviter" } }, shape: "pill", uppercase: false } },
      { id: "col_owner", header: "Propriétaire", type: "text", align: "left", config: {} },
    ],
    sampleRows: [
      { id: "row_0", cells: { col_id: "SC001", col_name: "Compromission accès admin", col_type: "operational", col_likelihood: 3, col_severity: 4, col_inherent: 12, col_treatment: "reduce", col_owner: "CISO" } },
      { id: "row_1", cells: { col_id: "SC002", col_name: "Attaque DDoS massif", col_type: "strategic", col_likelihood: 2, col_severity: 3, col_inherent: 6, col_treatment: "accept", col_owner: "Resp. Infrastructure" } },
    ],
  },

  // 14. Control Matrix
  {
    id: "control-matrix",
    label: "Matrice des contrôles",
    icon: "shield-alt",
    category: "grc",
    defaultTitle: "Matrice d'Efficacité des Contrôles",
    defaultMeta: [],
    columnTemplate: { type: "score-badge", align: "center", config: { ranges: [{ min: 4, max: 5, bg: "#27ae6018", text: "#27ae60" }, { min: 2, max: 3, bg: "#f39c1218", text: "#f39c12" }, { min: 0, max: 1, bg: "#e74c3c18", text: "#e74c3c" }] } },
    columns: [
      { id: "col_id", header: "ID", type: "row-id", align: "left", config: { accentColored: false } },
      { id: "col_name", header: "Contrôle", type: "text", align: "left", config: {} },
      { id: "col_type", header: "Type", type: "badge", align: "left", config: { colorMap: { preventive: { bg: "#3498db18", text: "#3498db", label: "Préventif" }, detective: { bg: "#e67e2218", text: "#e67e22", label: "Détectif" }, corrective: { bg: "#27ae6018", text: "#27ae60", label: "Correctif" } }, shape: "rounded", uppercase: false } },
      { id: "col_freq", header: "Fréquence", type: "text", align: "left", config: {} },
      { id: "col_eff", header: "Efficacité", type: "score-badge", align: "center", config: { ranges: [{ min: 5, max: 5, bg: "#27ae6018", text: "#27ae60" }, { min: 4, max: 4, bg: "#3498db18", text: "#3498db" }, { min: 3, max: 3, bg: "#f39c1218", text: "#f39c12" }, { min: 1, max: 2, bg: "#e74c3c18", text: "#e74c3c" }] } },
      { id: "col_th1", header: "Compromission compte", type: "score-badge", align: "center", config: { ranges: [{ min: 4, max: 5, bg: "#27ae6018", text: "#27ae60" }, { min: 2, max: 3, bg: "#f39c1218", text: "#f39c12" }, { min: 0, max: 1, bg: "#e74c3c18", text: "#e74c3c" }] } },
      { id: "col_th2", header: "Exploit. vuln.", type: "score-badge", align: "center", config: { ranges: [{ min: 4, max: 5, bg: "#27ae6018", text: "#27ae60" }, { min: 2, max: 3, bg: "#f39c1218", text: "#f39c12" }, { min: 0, max: 1, bg: "#e74c3c18", text: "#e74c3c" }] } },
    ],
    sampleRows: [
      { id: "row_0", cells: { col_id: "C001", col_name: "Multi-Factor Authentication", col_type: "preventive", col_freq: "Continu", col_eff: 5, col_th1: 5, col_th2: 1 } },
      { id: "row_1", cells: { col_id: "C002", col_name: "Logs & Monitoring centralisé", col_type: "detective", col_freq: "Temps réel", col_eff: 4, col_th1: 4, col_th2: null } },
    ],
  },
];

/** Get a preset by ID */
export function getPreset(id) {
  return TABLE_PRESETS.find((p) => p.id === id) || null;
}

/** Get default data for a preset (columns + sample rows + features) */
export function getPresetDefaults(id) {
  const p = getPreset(id);
  if (!p) return null;
  return {
    title: p.defaultTitle || "",
    subtitle: "",
    meta: p.defaultMeta || [],
    columns: p.columns,
    rows: p.sampleRows,
    groups: p.groups || [],
    groupByColumn: p.groupByColumn || null,
    accentBorderColumn: p.accentBorderColumn || null,
    legend: p.legend || null,
    summaryBar: p.summaryBar || null,
    showMasked: p.showMasked ?? false,
    preset: p.id,
  };
}
