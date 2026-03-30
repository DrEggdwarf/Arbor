# Universal Table Block — Architecture Specification

**Author**: @architect  
**Date**: 2026-03-30  
**Status**: DRAFT — Pending validation  
**Replaces**: 14 specialized table blocks

---

## A) New `defaultData` Schema

The `table` block entry in `blockRegistry.js` will change from:

```js
// OLD
defaultData: { headers: ["Colonne 1", "Colonne 2"], rows: [["", ""]] }
```

To:

```js
// NEW
defaultData: {
  // ── Table Chrome ──────────────────────────────────────────
  title: "",                // Optional: displayed above the table
  subtitle: "",             // Optional: smaller text below title
  meta: [],                 // Optional: [{ label: "Cible", value: "192.168.1.1" }]

  // ── Structure ─────────────────────────────────────────────
  columns: [
    { id: "col_0", header: "Colonne 1", type: "rich-text", align: "left", config: {} },
    { id: "col_1", header: "Colonne 2", type: "rich-text", align: "left", config: {} },
  ],
  rows: [
    { id: "row_0", cells: { col_0: "", col_1: "" } },
  ],

  // ── Row Grouping (optional) ───────────────────────────────
  groups: [],               // [{ key: "A5", label: "Organisation : Contrôles" }]
  groupByColumn: null,      // column ID whose value determines group membership

  // ── Visual Features (optional) ────────────────────────────
  accentBorderColumn: null, // column ID → left border colored by that column's badge color
  legend: null,             // [{ symbol: "R", bg: "#27ae60", label: "Responsable" }]
  summaryBar: null,         // column ID → stacked count bar above table
  showMasked: false,        // toggle to reveal masked columns

  // ── Preset Reference ─────────────────────────────────────
  preset: null,             // string, e.g. "port-scan" — informational only
}
```

### Column Definition Schema

```typescript
interface ColumnDef {
  id:      string;            // Unique ID, e.g. "col_port". Stable across reorders.
  header:  string;            // Display header text
  type:    ColumnType;        // One of the 12 types defined in section B
  align:   "left" | "center" | "right";  // Default: "left"
  width?:  "auto" | "min" | number;      // px width or auto. Default: "auto"
  hidden?: boolean;           // If true, column not rendered in body (used for groupBy source)
  config:  object;            // Type-specific config (see section B)
}
```

### Row Schema

```typescript
interface Row {
  id:       string;           // Unique ID, e.g. "row_0"
  _group?:  string;           // Optional group key, matches groups[].key
  cells:    Record<string, CellValue>;  // { [columnId]: value }
}

type CellValue = string | number | null;
```

**Key design decision**: `cells` is an **object keyed by column ID**, not an array. This makes the data resilient to column reordering, insertion, and deletion without data corruption.

---

## B) Column Type Definitions

### 1. `text`

| Aspect | Detail |
|--------|--------|
| **Config** | `{ maxWidth?: number }` |
| **Cell value** | `string` |
| **Render** | Plain text, font: body, color: `text.secondary` |
| **Notes** | Truncated with ellipsis if maxWidth is set |

### 2. `rich-text`

| Aspect | Detail |
|--------|--------|
| **Config** | `{}` |
| **Cell value** | `string` — HTML subset: `<b>`, `<i>`, `<a>`, `<code>` |
| **Render** | Via existing `<RichText html={value} />` component |
| **Notes** | Used for backward-compatible migration of legacy table cells |

### 3. `mono`

| Aspect | Detail |
|--------|--------|
| **Config** | `{ maxWidth?: number }` |
| **Cell value** | `string` |
| **Render** | Font: body (DM Mono — already mono), weight: 500, color: `text.primary` |
| **Notes** | For IPs, ports, hostnames, technical identifiers |

### 4. `badge`

| Aspect | Detail |
|--------|--------|
| **Config** | `{ colorMap: Record<string, { bg: string, text: string, label?: string }>, shape?: "pill" \| "rounded", uppercase?: boolean }` |
| **Cell value** | `string` — key into `colorMap` |
| **Render** | Colored pill/rounded-rect. Shows `colorMap[value].label` if defined, else the raw value. `shape` defaults to `"pill"` (border-radius: 9999px). `"rounded"` uses 4px radius. `uppercase` defaults to `true`. |
| **Notes** | Universal renderer for: severity, status, state, action, priority, type, treatment, encryption type |

**Example config** (severity):
```json
{
  "colorMap": {
    "critical": { "bg": "#c0392b", "text": "#fff", "label": "Critique" },
    "high":     { "bg": "#e67e22", "text": "#fff", "label": "Élevé" },
    "medium":   { "bg": "#f39c12", "text": "#fff", "label": "Moyen" },
    "low":      { "bg": "#27ae60", "text": "#fff", "label": "Faible" }
  },
  "shape": "pill",
  "uppercase": true
}
```

### 5. `number`

| Aspect | Detail |
|--------|--------|
| **Config** | `{ precision?: number, suffix?: string, prefix?: string }` |
| **Cell value** | `number \| null` |
| **Render** | Centered, weight: 600, formatted with precision. Shows "—" for null. Suffix/prefix appended (e.g., `suffix: " ctrl."` → "3 ctrl.") |

### 6. `score-badge`

| Aspect | Detail |
|--------|--------|
| **Config** | `{ ranges: Array<{ min: number, max: number, bg: string, text: string }> }` |
| **Cell value** | `number \| null` |
| **Render** | Number inside a colored rounded box (border-radius: 4px). Color determined by which range contains the value. Display with 1 decimal if float, integer otherwise. Shows "—" for null. |

**Example config** (CVSS):
```json
{
  "ranges": [
    { "min": 9.0, "max": 10,  "bg": "#c0392b18", "text": "#c0392b" },
    { "min": 7.0, "max": 8.9, "bg": "#e67e2218", "text": "#e67e22" },
    { "min": 4.0, "max": 6.9, "bg": "#f39c1218", "text": "#f39c12" },
    { "min": 0.1, "max": 3.9, "bg": "#27ae6018", "text": "#27ae60" },
    { "min": 0,   "max": 0,   "bg": "#95a5a618", "text": "#95a5a6" }
  ]
}
```

**Example config** (risk score 1-25):
```json
{
  "ranges": [
    { "min": 16, "max": 25, "bg": "#F8D7DA", "text": "#842029" },
    { "min": 10, "max": 15, "bg": "#FDDCB5", "text": "#9C4221" },
    { "min": 5,  "max": 9,  "bg": "#FFF3CD", "text": "#856404" },
    { "min": 0,  "max": 4,  "bg": "#D4EDDA", "text": "#2D7A47" }
  ]
}
```

### 7. `progress`

| Aspect | Detail |
|--------|--------|
| **Config** | `{ max: number, showLabel?: boolean, suffix?: string, colorRanges?: Array<{ min: number, max: number, color: string }> }` |
| **Cell value** | `number` |
| **Render** | Horizontal bar (height: 6px, border-radius: sm) + optional text label. Bar fill = `value / max * 100%`. Color from `colorRanges` if provided, else status-aware. Label shows `value + suffix` (e.g., "-42 dBm", "65%"). |

**Example config** (signal strength):
```json
{
  "max": 100,
  "showLabel": true,
  "suffix": " dBm",
  "colorRanges": [
    { "min": 70, "max": 100, "color": "#27ae60" },
    { "min": 40, "max": 69,  "color": "#f39c12" },
    { "min": 0,  "max": 39,  "color": "#e74c3c" }
  ]
}
```

> **Note for wireless signal**: The raw value is dBm (e.g., -42). The renderer must normalize: `pct = clamp(0, 100, value + 100)` before displaying the bar. This normalization formula is stored in config:
> `{ max: 100, normalize: "addOffset", normalizeParam: 100, showLabel: true, suffix: " dBm" }`

Updated config:
```json
{
  "max": number,
  "showLabel?": boolean,
  "suffix?": string,
  "normalize?": "none" | "addOffset",
  "normalizeParam?": number,
  "colorRanges?": [{ "min": number, "max": number, "color": string }]
}
```

### 8. `masked`

| Aspect | Detail |
|--------|--------|
| **Config** | `{ maskChar?: string, maskLength?: number }` |
| **Cell value** | `string` |
| **Render** | Shows `maskChar` repeated `maskLength` times (defaults: `"•"`, `8`). When table-level `showMasked` is `true`, shows actual value in mono style. |
| **Notes** | For passwords, secrets, API keys |

### 9. `status-dot`

| Aspect | Detail |
|--------|--------|
| **Config** | `{ colorMap: Record<string, string> }` — maps value to hex color |
| **Cell value** | `string` |
| **Render** | Small colored circle (6×6px, border-radius: 50%) + text label. Color from colorMap. |

**Example config**:
```json
{
  "colorMap": {
    "online": "#27ae60",
    "offline": "#e74c3c",
    "maintenance": "#e67e22",
    "degraded": "#f39c12",
    "unknown": "#95a5a6"
  }
}
```

### 10. `icon-status`

| Aspect | Detail |
|--------|--------|
| **Config** | `{ statusMap: Record<string, { icon: string, color: string, label?: string }> }` |
| **Cell value** | `string` — key into statusMap |
| **Render** | Icon character (✓/⚠/✗/—) sized 13px bold, colored, followed by optional label text. |

**Example config** (compliance):
```json
{
  "statusMap": {
    "compliant":     { "icon": "✓", "color": "#27ae60", "label": "Conforme" },
    "partial":       { "icon": "⚠", "color": "#f39c12", "label": "Partiel" },
    "non-compliant": { "icon": "✗", "color": "#c0392b", "label": "Non conforme" },
    "na":            { "icon": "—", "color": "#95a5a6", "label": "N/A" }
  }
}
```

### 11. `row-id`

| Aspect | Detail |
|--------|--------|
| **Config** | `{ accentColored?: boolean }` |
| **Cell value** | `string` |
| **Render** | If `accentColored: true`: value inside a small accent-colored box (bg: accentColor, color: #fff, borderRadius: sm, padding: 2px 8px, fontSize: xs, fontWeight: 600). If false: bold text in muted color. |
| **Notes** | For identifiers like "ACT001", "RISK001", "CVE-2024-21762", "EV001" |

### 12. `circle-badge`

| Aspect | Detail |
|--------|--------|
| **Config** | `{ colorMap: Record<string, { bg: string, label?: string }>, emptySymbol?: string }` |
| **Cell value** | `string \| null` — single letter or short code, or null/empty |
| **Render** | If value present: 28×28px circle, bg from colorMap, white text, bold. If empty/null: show `emptySymbol` (default "—") in muted color. |
| **Notes** | For RACI matrix (R/A/C/I), control matrix effectiveness levels |

**Example config** (RACI):
```json
{
  "colorMap": {
    "R": { "bg": "#27ae60", "label": "Responsable" },
    "A": { "bg": "#e74c3c", "label": "Approbateur" },
    "C": { "bg": "#f39c12", "label": "Consulté" },
    "I": { "bg": "#3498db", "label": "Informé" }
  },
  "emptySymbol": "—"
}
```

---

## C) Table-Level Features

### Title & Subtitle

```json
{
  "title": "Résultats Nmap",
  "subtitle": "Scan TCP complet"
}
```

Rendered as a header area above the table. Title: heading font, 15px, bold. Subtitle: body font, sm, muted.

### Metadata Bar

```json
{
  "meta": [
    { "label": "Cible", "value": "192.168.1.1" },
    { "label": "Date", "value": "2026-03-30" }
  ]
}
```

Rendered as a single row of key-value pairs below the title, above the table. Label: uppercase, 10px, muted. Value: 11px, secondary.

### Row Grouping / Sections

```json
{
  "groupByColumn": "col_section",
  "groups": [
    { "key": "A5", "label": "Organisation : Contrôles d'organisation" },
    { "key": "A8", "label": "Actifs : Gestion des actifs" }
  ]
}
```

Rows are grouped by the value in `groupByColumn`. Each group gets a collapsible header row showing the `label` from the matching group definition. If a row's value doesn't match any group, it's rendered ungrouped at the end.

The `groupByColumn` column can be `hidden: true` to avoid showing it in the table body (e.g., compliance checklist section IDs).

Group headers show:
- Expand/collapse triangle
- Optional group key (e.g., "A5") in muted
- Group label in bold
- Optional completion percentage badge (if `summaryBar` is configured)

### Accent Border

```json
{
  "accentBorderColumn": "col_severity"
}
```

Adds a 3px left border to each row, colored by the badge color of the referenced column. Used in EBIOS feared events.

### Legend

```json
{
  "legend": [
    { "symbol": "R", "bg": "#27ae60", "label": "Responsable" },
    { "symbol": "A", "bg": "#e74c3c", "label": "Approbateur" },
    { "symbol": "C", "bg": "#f39c12", "label": "Consulté" },
    { "symbol": "I", "bg": "#3498db", "label": "Informé" }
  ]
}
```

Rendered as a horizontal flex row below the table. Each item: small colored circle/square + label text.

### Summary Bar

```json
{
  "summaryBar": "col_status"
}
```

References a `badge` or `icon-status` column. Renders a stacked horizontal bar above the table body showing the count distribution of values. Each segment uses the color from the column's colorMap/statusMap. A legend row beneath the bar shows counts.

### Show Masked Toggle

```json
{
  "showMasked": false
}
```

When `true`, all `masked` columns reveal their actual values. Exposed as a toggle in the table modal editor.

### Zebra Striping

Always on. Alternating row backgrounds using `colors.bg` at 50% opacity, matching current behavior across all blocks.

---

## D) Preset System

A **preset** is a predefined table configuration: columns, sample rows, features, and metadata template. When a user picks a preset, the table's defaultData is populated with the preset's config. The user can then modify everything freely.

Presets are stored in a dedicated file: `app/frontend/lib/tablePresets.js`.

```typescript
interface TablePreset {
  id:            string;        // e.g. "port-scan"
  label:         string;        // e.g. "Scan de ports"
  icon:          string;        // FontAwesome icon name
  category:      string;        // For grouping in preset picker UI
  defaultTitle:  string;
  defaultMeta:   Array<{ label: string, value: string }>;
  columns:       ColumnDef[];
  sampleRows:    Row[];
  // Optional features
  groups?:             Array<{ key: string, label: string }>;
  groupByColumn?:      string;
  accentBorderColumn?: string;
  legend?:             Array<{ symbol: string, bg: string, label: string }>;
  summaryBar?:         string;
  showMasked?:         boolean;
}
```

### Preset 1: `port-scan`

**Replaces**: `port-scan-table` block

```js
{
  id: "port-scan",
  label: "Scan de ports",
  icon: "search",
  category: "network",
  defaultTitle: "Résultats Nmap",
  defaultMeta: [
    { label: "Cible", value: "192.168.1.1" },
    { label: "Date", value: "2026-03-30" },
  ],
  columns: [
    { id: "col_port",    header: "Port",    type: "mono",  align: "left",   config: {} },
    { id: "col_proto",   header: "Proto",   type: "text",  align: "left",   config: {} },
    { id: "col_state",   header: "État",    type: "badge", align: "left",   config: {
      colorMap: {
        "open":          { bg: "#27ae60", text: "#fff" },
        "closed":        { bg: "#e74c3c", text: "#fff" },
        "filtered":      { bg: "#e67e22", text: "#fff" },
        "open|filtered": { bg: "#f39c12", text: "#fff" },
      },
      shape: "pill", uppercase: true,
    }},
    { id: "col_service", header: "Service", type: "text",  align: "left",   config: {} },
    { id: "col_version", header: "Version", type: "mono",  align: "left",   config: {} },
    { id: "col_info",    header: "Info",    type: "text",  align: "left",   config: { maxWidth: 200 } },
  ],
  sampleRows: [
    { id: "row_0", cells: { col_port: "22",   col_proto: "TCP", col_state: "open",     col_service: "ssh",   col_version: "OpenSSH 8.9", col_info: "" } },
    { id: "row_1", cells: { col_port: "80",   col_proto: "TCP", col_state: "open",     col_service: "http",  col_version: "nginx 1.24",  col_info: "" } },
    { id: "row_2", cells: { col_port: "443",  col_proto: "TCP", col_state: "open",     col_service: "https", col_version: "nginx 1.24",  col_info: "" } },
    { id: "row_3", cells: { col_port: "3306", col_proto: "TCP", col_state: "filtered", col_service: "mysql", col_version: "",            col_info: "Firewall" } },
  ],
}
```

---

### Preset 2: `credentials`

**Replaces**: `credentials-table` block

```js
{
  id: "credentials",
  label: "Identifiants",
  icon: "key",
  category: "pentest",
  defaultTitle: "Identifiants découverts",
  defaultMeta: [],
  showMasked: false,
  columns: [
    { id: "col_username", header: "Username", type: "mono",   align: "left", config: {} },
    { id: "col_password", header: "Password", type: "masked", align: "left", config: { maskChar: "•", maskLength: 8 } },
    { id: "col_source",   header: "Source",   type: "text",   align: "left", config: {} },
    { id: "col_type",     header: "Type",     type: "badge",  align: "left", config: {
      colorMap: {
        "database":  { bg: "transparent", text: "#807D76", label: "database" },
        "ssh":       { bg: "transparent", text: "#807D76", label: "ssh" },
        "web":       { bg: "transparent", text: "#807D76", label: "web" },
        "ldap":      { bg: "transparent", text: "#807D76", label: "ldap" },
        "ftp":       { bg: "transparent", text: "#807D76", label: "ftp" },
      },
      shape: "pill", uppercase: false,
    }},
    { id: "col_location", header: "Location", type: "text",   align: "left", config: {} },
    { id: "col_severity", header: "Severity", type: "badge",  align: "left", config: {
      colorMap: {
        "critical": { bg: "#c0392b", text: "#fff", label: "Critical" },
        "high":     { bg: "#e67e22", text: "#fff", label: "High" },
        "medium":   { bg: "#f39c12", text: "#fff", label: "Medium" },
        "low":      { bg: "#27ae60", text: "#fff", label: "Low" },
      },
      shape: "pill", uppercase: true,
    }},
  ],
  sampleRows: [
    { id: "row_0", cells: { col_username: "admin",  col_password: "P@ssw0rd!",  col_source: "Brute force", col_type: "database", col_location: "MySQL 192.168.1.10", col_severity: "critical" } },
    { id: "row_1", cells: { col_username: "backup", col_password: "backup123",  col_source: "Config file", col_type: "ssh",      col_location: "SSH 192.168.1.20",   col_severity: "high" } },
  ],
}
```

---

### Preset 3: `cve-table`

**Replaces**: `cve-table` block

```js
{
  id: "cve-table",
  label: "Table CVE",
  icon: "shield-alt",
  category: "pentest",
  defaultTitle: "CVE identifiées",
  defaultMeta: [],
  columns: [
    { id: "col_id",          header: "CVE",         type: "row-id",      align: "left",   config: { accentColored: false } },
    { id: "col_cvss",        header: "CVSS",        type: "score-badge", align: "center", config: {
      ranges: [
        { min: 9.0, max: 10,  bg: "#c0392b18", text: "#c0392b" },
        { min: 7.0, max: 8.9, bg: "#e67e2218", text: "#e67e22" },
        { min: 4.0, max: 6.9, bg: "#f39c1218", text: "#f39c12" },
        { min: 0.1, max: 3.9, bg: "#27ae6018", text: "#27ae60" },
        { min: 0,   max: 0,   bg: "#95a5a618", text: "#95a5a6" },
      ],
    }},
    { id: "col_severity",    header: "Sév.",        type: "badge",       align: "left",   config: {
      colorMap: {
        "critical": { bg: "#c0392b", text: "#fff", label: "CRITIQUE" },
        "high":     { bg: "#e67e22", text: "#fff", label: "ÉLEVÉ" },
        "medium":   { bg: "#f39c12", text: "#fff", label: "MOYEN" },
        "low":      { bg: "#27ae60", text: "#fff", label: "FAIBLE" },
        "none":     { bg: "#95a5a6", text: "#fff", label: "AUCUN" },
      },
      shape: "rounded", uppercase: true,
    }},
    { id: "col_affected",    header: "Composant",   type: "text",        align: "left",   config: {} },
    { id: "col_status",      header: "Statut",      type: "badge",       align: "left",   config: {
      colorMap: {
        "open":        { bg: "#e74c3c18", text: "#e74c3c", label: "Non corrigé" },
        "in_progress": { bg: "#e67e2218", text: "#e67e22", label: "En cours" },
        "fixed":       { bg: "#27ae6018", text: "#27ae60", label: "Corrigé" },
        "accepted":    { bg: "#3498db18", text: "#3498db", label: "Accepté" },
        "wontfix":     { bg: "#95a5a618", text: "#95a5a6", label: "Ignoré" },
      },
      shape: "rounded", uppercase: false,
    }},
    { id: "col_description", header: "Description", type: "text",        align: "left",   config: { maxWidth: 300 } },
  ],
  sampleRows: [
    { id: "row_0", cells: { col_id: "CVE-2024-21762", col_cvss: 9.8, col_severity: "critical", col_affected: "FortiOS 7.2.x", col_status: "fixed",       col_description: "FortiOS RCE via SSL VPN" } },
    { id: "row_1", cells: { col_id: "CVE-2023-44487", col_cvss: 7.5, col_severity: "high",     col_affected: "nginx 1.24",     col_status: "in_progress", col_description: "HTTP/2 Rapid Reset DDoS" } },
  ],
}
```

---

### Preset 4: `firewall-rules`

**Replaces**: `firewall-rules` block

```js
{
  id: "firewall-rules",
  label: "Règles firewall",
  icon: "shield-alt",
  category: "network",
  defaultTitle: "Règles firewall",
  defaultMeta: [],
  columns: [
    { id: "col_num",         header: "#",           type: "row-id", align: "left",   config: { accentColored: false } },
    { id: "col_source",      header: "Source",       type: "mono",   align: "left",   config: {} },
    { id: "col_destination", header: "Destination",  type: "mono",   align: "left",   config: {} },
    { id: "col_port",        header: "Port",         type: "mono",   align: "left",   config: {} },
    { id: "col_proto",       header: "Proto",        type: "text",   align: "left",   config: {} },
    { id: "col_action",      header: "Action",       type: "badge",  align: "left",   config: {
      colorMap: {
        "allow":  { bg: "#27ae60", text: "#fff" },
        "deny":   { bg: "#e74c3c", text: "#fff" },
        "drop":   { bg: "#c0392b", text: "#fff" },
        "reject": { bg: "#e67e22", text: "#fff" },
        "log":    { bg: "#3498db", text: "#fff" },
      },
      shape: "rounded", uppercase: true,
    }},
    { id: "col_desc",        header: "Description",  type: "text",   align: "left",   config: { maxWidth: 200 } },
  ],
  sampleRows: [
    { id: "row_0", cells: { col_num: "1", col_source: "any",          col_destination: "10.0.1.10",  col_port: "443",  col_proto: "TCP", col_action: "allow", col_desc: "HTTPS vers Web" } },
    { id: "row_1", cells: { col_num: "2", col_source: "10.0.1.0/24", col_destination: "10.0.2.10",  col_port: "3306", col_proto: "TCP", col_action: "allow", col_desc: "SQL interne" } },
    { id: "row_2", cells: { col_num: "3", col_source: "any",          col_destination: "any",        col_port: "*",    col_proto: "any", col_action: "deny",  col_desc: "Deny all" } },
  ],
}
```

---

### Preset 5: `server-inventory`

**Replaces**: `server-inventory` block

```js
{
  id: "server-inventory",
  label: "Inventaire serveurs",
  icon: "server",
  category: "network",
  defaultTitle: "Inventaire des serveurs",
  defaultMeta: [],
  columns: [
    { id: "col_hostname",   header: "Hostname",    type: "mono",       align: "left", config: {} },
    { id: "col_ip",         header: "IP",          type: "mono",       align: "left", config: {} },
    { id: "col_os",         header: "OS",          type: "text",       align: "left", config: {} },
    { id: "col_role",       header: "Rôle",        type: "text",       align: "left", config: {} },
    { id: "col_patch",      header: "Patch",       type: "text",       align: "left", config: {} },
    { id: "col_status",     header: "Statut",      type: "status-dot", align: "left", config: {
      colorMap: {
        "online":      "#27ae60",
        "offline":     "#e74c3c",
        "maintenance": "#e67e22",
        "degraded":    "#f39c12",
        "unknown":     "#95a5a6",
      },
    }},
  ],
  sampleRows: [
    { id: "row_0", cells: { col_hostname: "web-01",    col_ip: "10.0.1.10", col_os: "Ubuntu 22.04", col_role: "Web",      col_patch: "2026-03", col_status: "online" } },
    { id: "row_1", cells: { col_hostname: "db-01",     col_ip: "10.0.2.10", col_os: "Debian 12",    col_role: "Database", col_patch: "2026-02", col_status: "online" } },
    { id: "row_2", cells: { col_hostname: "backup-01", col_ip: "10.0.3.10", col_os: "CentOS 9",     col_role: "Backup",   col_patch: "2025-12", col_status: "maintenance" } },
  ],
}
```

---

### Preset 6: `dns-records`

**Replaces**: `dns-records` block

```js
{
  id: "dns-records",
  label: "Enregistrements DNS",
  icon: "globe",
  category: "network",
  defaultTitle: "Enregistrements DNS",
  defaultMeta: [
    { label: "Domaine", value: "example.com" },
  ],
  columns: [
    { id: "col_type",     header: "Type",     type: "badge", align: "left", config: {
      colorMap: {
        "A":     { bg: "#3498db", text: "#fff" },
        "AAAA":  { bg: "#2980b9", text: "#fff" },
        "CNAME": { bg: "#9b59b6", text: "#fff" },
        "MX":    { bg: "#e67e22", text: "#fff" },
        "TXT":   { bg: "#27ae60", text: "#fff" },
        "NS":    { bg: "#1abc9c", text: "#fff" },
        "SOA":   { bg: "#34495e", text: "#fff" },
        "PTR":   { bg: "#e74c3c", text: "#fff" },
        "SRV":   { bg: "#f39c12", text: "#fff" },
      },
      shape: "rounded", uppercase: true,
    }},
    { id: "col_name",     header: "Nom",      type: "mono",   align: "left", config: {} },
    { id: "col_value",    header: "Valeur",    type: "mono",   align: "left", config: { maxWidth: 260 } },
    { id: "col_ttl",      header: "TTL",       type: "text",   align: "left", config: {} },
    { id: "col_priority", header: "Priorité",  type: "text",   align: "left", config: {} },
  ],
  sampleRows: [
    { id: "row_0", cells: { col_type: "A",     col_name: "@",   col_value: "93.184.216.34",                              col_ttl: "3600", col_priority: "" } },
    { id: "row_1", cells: { col_type: "AAAA",  col_name: "@",   col_value: "2606:2800:220:1:248:1893:25c8:1946",         col_ttl: "3600", col_priority: "" } },
    { id: "row_2", cells: { col_type: "MX",    col_name: "@",   col_value: "mail.example.com",                           col_ttl: "3600", col_priority: "10" } },
    { id: "row_3", cells: { col_type: "CNAME", col_name: "www", col_value: "example.com",                                col_ttl: "3600", col_priority: "" } },
    { id: "row_4", cells: { col_type: "TXT",   col_name: "@",   col_value: "v=spf1 include:_spf.google.com ~all",        col_ttl: "3600", col_priority: "" } },
  ],
}
```

---

### Preset 7: `wireless-survey`

**Replaces**: `wireless-survey` block

```js
{
  id: "wireless-survey",
  label: "Audit Wi-Fi",
  icon: "wifi",
  category: "network",
  defaultTitle: "Audit Wi-Fi",
  defaultMeta: [
    { label: "Emplacement", value: "Bureau 3ème étage" },
    { label: "Date", value: "2026-03-30" },
  ],
  columns: [
    { id: "col_ssid",       header: "SSID",        type: "mono",     align: "left",   config: {} },
    { id: "col_bssid",      header: "BSSID",       type: "text",     align: "left",   config: {} },
    { id: "col_channel",    header: "Canal",        type: "number",   align: "center", config: {} },
    { id: "col_signal",     header: "Signal",       type: "progress", align: "left",   config: {
      max: 100,
      normalize: "addOffset",
      normalizeParam: 100,
      showLabel: true,
      suffix: " dBm",
      colorRanges: [
        { min: 70, max: 100, color: "#27ae60" },
        { min: 40, max: 69,  color: "#f39c12" },
        { min: 0,  max: 39,  color: "#e74c3c" },
      ],
    }},
    { id: "col_encryption", header: "Chiffrement",  type: "badge",    align: "left",   config: {
      colorMap: {
        "WPA3":             { bg: "#27ae6015", text: "#27ae60" },
        "WPA2-Enterprise":  { bg: "#2ecc7115", text: "#2ecc71" },
        "WPA2":             { bg: "#3498db15", text: "#3498db" },
        "WPA":              { bg: "#f39c1215", text: "#f39c12" },
        "WEP":              { bg: "#e74c3c15", text: "#e74c3c" },
        "Open":             { bg: "#c0392b15", text: "#c0392b" },
      },
      shape: "rounded", uppercase: false,
    }},
    { id: "col_notes",      header: "Remarques",    type: "text",     align: "left",   config: { maxWidth: 160 } },
  ],
  sampleRows: [
    { id: "row_0", cells: { col_ssid: "Corp-Secure",  col_bssid: "AA:BB:CC:DD:EE:01", col_channel: 6,  col_signal: -42, col_encryption: "WPA2-Enterprise", col_notes: "Réseau principal" } },
    { id: "row_1", cells: { col_ssid: "Guest",         col_bssid: "AA:BB:CC:DD:EE:02", col_channel: 11, col_signal: -55, col_encryption: "WPA2",            col_notes: "Réseau invités" } },
    { id: "row_2", cells: { col_ssid: "IoT-Devices",   col_bssid: "AA:BB:CC:DD:EE:03", col_channel: 1,  col_signal: -68, col_encryption: "WPA",             col_notes: "Non segmenté!" } },
  ],
}
```

---

### Preset 8: `risk-register`

**Replaces**: `risk-register` block

```js
{
  id: "risk-register",
  label: "Registre des risques",
  icon: "clipboard-list",
  category: "grc",
  defaultTitle: "Registre des Risques",
  defaultMeta: [],
  columns: [
    { id: "col_id",        header: "ID",           type: "row-id",      align: "left",   config: { accentColored: false } },
    { id: "col_name",      header: "Risque",        type: "text",        align: "left",   config: { maxWidth: 160 } },
    { id: "col_category",  header: "Catégorie",     type: "text",        align: "left",   config: {} },
    { id: "col_likelihood",header: "L",             type: "number",      align: "center", config: {} },
    { id: "col_impact",    header: "I",             type: "number",      align: "center", config: {} },
    { id: "col_inherent",  header: "Risque Brut",   type: "score-badge", align: "center", config: {
      ranges: [
        { min: 16, max: 25, bg: "#F8D7DA", text: "#842029" },
        { min: 10, max: 15, bg: "#FDDCB5", text: "#9C4221" },
        { min: 5,  max: 9,  bg: "#FFF3CD", text: "#856404" },
        { min: 0,  max: 4,  bg: "#D4EDDA", text: "#2D7A47" },
      ],
    }},
    { id: "col_controls",  header: "Contrôles",     type: "number",      align: "center", config: { suffix: " ctrl." } },
    { id: "col_residual",  header: "Risque Rés.",    type: "score-badge", align: "center", config: {
      ranges: [
        { min: 16, max: 25, bg: "#F8D7DA", text: "#842029" },
        { min: 10, max: 15, bg: "#FDDCB5", text: "#9C4221" },
        { min: 5,  max: 9,  bg: "#FFF3CD", text: "#856404" },
        { min: 0,  max: 4,  bg: "#D4EDDA", text: "#2D7A47" },
      ],
    }},
    { id: "col_owner",     header: "Propriétaire",  type: "text",        align: "left",   config: {} },
    { id: "col_status",    header: "Statut",         type: "badge",       align: "center", config: {
      colorMap: {
        "active":    { bg: "#FDDCB5", text: "#9C4221", label: "Actif" },
        "mitigated": { bg: "#D6E9F8", text: "#2A6496", label: "Atténué" },
        "accepted":  { bg: "#D4EDDA", text: "#2D7A47", label: "Accepté" },
        "closed":    { bg: "#E8E8E8", text: "#666",    label: "Clôturé" },
      },
      shape: "pill", uppercase: false,
    }},
  ],
  sampleRows: [
    { id: "row_0", cells: { col_id: "RISK001", col_name: "Incident de sécurité majeur",   col_category: "Cybersécurité",  col_likelihood: 3, col_impact: 5, col_inherent: 15, col_controls: 3,  col_residual: 6, col_owner: "CISO",                    col_status: "active" } },
    { id: "row_1", cells: { col_id: "RISK002", col_name: "Indisponibilité de service",     col_category: "Infrastructure", col_likelihood: 2, col_impact: 4, col_inherent: 8,  col_controls: 3,  col_residual: 3, col_owner: "Infrastructure Manager",  col_status: "mitigated" } },
    { id: "row_2", cells: { col_id: "RISK003", col_name: "Non-conformité RGPD",            col_category: "Conformité",     col_likelihood: 2, col_impact: 4, col_inherent: 8,  col_controls: 3,  col_residual: 4, col_owner: "DPO",                     col_status: "active" } },
    { id: "row_3", cells: { col_id: "RISK004", col_name: "Atteinte à la réputation",       col_category: "Métier",         col_likelihood: 1, col_impact: 5, col_inherent: 5,  col_controls: 2,  col_residual: 5, col_owner: "Dir. Communication",      col_status: "accepted" } },
  ],
}
```

---

### Preset 9: `action-plan`

**Replaces**: `action-plan` block

```js
{
  id: "action-plan",
  label: "Plan d'action",
  icon: "tasks",
  category: "grc",
  defaultTitle: "Plan d'Action Sécurité 2024",
  defaultMeta: [],
  groupByColumn: "col_quarter",
  groups: [
    { key: "Q1", label: "Q1" },
    { key: "Q2", label: "Q2" },
    { key: "Q3", label: "Q3" },
    { key: "Q4", label: "Q4" },
  ],
  columns: [
    { id: "col_id",          header: "ID",          type: "row-id",   align: "left",   config: { accentColored: true } },
    { id: "col_action",      header: "Action",       type: "text",     align: "left",   config: {} },
    { id: "col_responsible", header: "Responsable",  type: "text",     align: "left",   config: {} },
    { id: "col_deadline",    header: "Échéance",     type: "text",     align: "left",   config: {} },
    { id: "col_priority",    header: "Priorité",     type: "badge",    align: "left",   config: {
      colorMap: {
        "critical": { bg: "#F8D7DA", text: "#842029", label: "Critique" },
        "high":     { bg: "#FDDCB5", text: "#9C4221", label: "Haute" },
        "medium":   { bg: "#FFF3CD", text: "#856404", label: "Moyenne" },
        "low":      { bg: "#D4EDDA", text: "#2D7A47", label: "Basse" },
      },
      shape: "rounded", uppercase: false,
    }},
    { id: "col_status",     header: "Statut",        type: "badge",    align: "left",   config: {
      colorMap: {
        "todo":        { bg: "#E2DDD5", text: "#4A4840", label: "À faire" },
        "in-progress": { bg: "#D6EAF8", text: "#2471A3", label: "En cours" },
        "done":        { bg: "#D4EDDA", text: "#2D7A47", label: "Terminé" },
      },
      shape: "rounded", uppercase: false,
    }},
    { id: "col_progress",   header: "Progression",   type: "progress", align: "left",   config: {
      max: 100, showLabel: true, suffix: "%",
      colorRanges: [
        { min: 80,  max: 100, color: "#2D7A47" },
        { min: 40,  max: 79,  color: "#2471A3" },
        { min: 0,   max: 39,  color: "#4A4840" },
      ],
    }},
    { id: "col_quarter",    header: "Trimestre",      type: "text",     align: "left",   config: {}, hidden: true },
  ],
  sampleRows: [
    { id: "row_0", _group: "Q2", cells: { col_id: "ACT001", col_action: "Déployer MFA sur tous les accès admin", col_responsible: "Équipe IAM",            col_deadline: "2024-06-30", col_priority: "critical", col_status: "in-progress", col_progress: 65,  col_quarter: "Q2" } },
    { id: "row_1", _group: "Q3", cells: { col_id: "ACT002", col_action: "Mise en place SOC 24/7",                col_responsible: "Responsable SOC",       col_deadline: "2024-09-30", col_priority: "high",     col_status: "in-progress", col_progress: 40,  col_quarter: "Q3" } },
    { id: "row_2", _group: "Q2", cells: { col_id: "ACT003", col_action: "Audit extern ISO 27001",               col_responsible: "CISO",                  col_deadline: "2024-04-30", col_priority: "high",     col_status: "todo",        col_progress: 0,   col_quarter: "Q2" } },
    { id: "row_3", _group: "Q2", cells: { col_id: "ACT004", col_action: "Sensibilisation phishing",             col_responsible: "Responsable Formation", col_deadline: "2024-05-31", col_priority: "medium",   col_status: "done",        col_progress: 100, col_quarter: "Q2" } },
    { id: "row_4", _group: "Q4", cells: { col_id: "ACT005", col_action: "Implémentation XDR",                   col_responsible: "Équipe Ops",            col_deadline: "2024-12-31", col_priority: "high",     col_status: "todo",        col_progress: 0,   col_quarter: "Q4" } },
  ],
}
```

---

### Preset 10: `raci-matrix`

**Replaces**: `raci-matrix` block

```js
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
  columns: [
    { id: "col_task", header: "Tâche", type: "text", align: "left", config: {}, width: 180 },
    { id: "col_s1",   header: "CISO",               type: "circle-badge", align: "center", config: {
      colorMap: {
        "R": { bg: "#27ae60" }, "A": { bg: "#e74c3c" },
        "C": { bg: "#f39c12" }, "I": { bg: "#3498db" },
      },
      emptySymbol: "—",
    }},
    { id: "col_s2",   header: "IT Manager",          type: "circle-badge", align: "center", config: {
      colorMap: {
        "R": { bg: "#27ae60" }, "A": { bg: "#e74c3c" },
        "C": { bg: "#f39c12" }, "I": { bg: "#3498db" },
      },
      emptySymbol: "—",
    }},
    { id: "col_s3",   header: "Resp. Sécurité",      type: "circle-badge", align: "center", config: {
      colorMap: {
        "R": { bg: "#27ae60" }, "A": { bg: "#e74c3c" },
        "C": { bg: "#f39c12" }, "I": { bg: "#3498db" },
      },
      emptySymbol: "—",
    }},
    { id: "col_s4",   header: "DPO",                  type: "circle-badge", align: "center", config: {
      colorMap: {
        "R": { bg: "#27ae60" }, "A": { bg: "#e74c3c" },
        "C": { bg: "#f39c12" }, "I": { bg: "#3498db" },
      },
      emptySymbol: "—",
    }},
    { id: "col_s5",   header: "Resp. Infrastructure", type: "circle-badge", align: "center", config: {
      colorMap: {
        "R": { bg: "#27ae60" }, "A": { bg: "#e74c3c" },
        "C": { bg: "#f39c12" }, "I": { bg: "#3498db" },
      },
      emptySymbol: "—",
    }},
  ],
  sampleRows: [
    { id: "row_0", cells: { col_task: "Gestion des incidents critiques",  col_s1: "A", col_s2: "R", col_s3: "C", col_s4: "I", col_s5: ""  } },
    { id: "row_1", cells: { col_task: "Approbation politique de sécurité",col_s1: "R", col_s2: "C", col_s3: "",  col_s4: "",  col_s5: "I" } },
    { id: "row_2", cells: { col_task: "Audit de sécurité interne",        col_s1: "C", col_s2: "R", col_s3: "A", col_s4: "",  col_s5: ""  } },
    { id: "row_3", cells: { col_task: "Gestion des vulnérabilités",       col_s1: "A", col_s2: "",  col_s3: "R", col_s4: "",  col_s5: "C" } },
    { id: "row_4", cells: { col_task: "Plan de continuité de service",    col_s1: "C", col_s2: "R", col_s3: "",  col_s4: "",  col_s5: "A" } },
  ],
}
```

> **Note**: RACI circle-badge config is duplicated across stakeholder columns. In the modal editor, when a user adds a new stakeholder column, the editor should auto-apply the RACI circle-badge config from the preset template. This is handled by storing a `columnTemplate` on presets that use dynamic columns:
> ```js
> columnTemplate: { type: "circle-badge", align: "center", config: { colorMap: { "R": { bg: "#27ae60" }, "A": { bg: "#e74c3c" }, "C": { bg: "#f39c12" }, "I": { bg: "#3498db" } }, emptySymbol: "—" } }
> ```

---

### Preset 11: `compliance-checklist`

**Replaces**: `compliance-checklist` block

```js
{
  id: "compliance-checklist",
  label: "Checklist conformité",
  icon: "clipboard-check",
  category: "grc",
  defaultTitle: "Checklist Conformité ISO 27001",
  defaultMeta: [
    { label: "Framework", value: "ISO 27001:2022" },
  ],
  groupByColumn: "col_section",
  groups: [
    { key: "A5", label: "Organisation : Contrôles d'organisation" },
    { key: "A8", label: "Actifs : Gestion des actifs" },
  ],
  summaryBar: "col_status",
  columns: [
    { id: "col_section", header: "Section",     type: "text",        align: "left", config: {}, hidden: true },
    { id: "col_status",  header: "",             type: "icon-status", align: "center", config: {
      statusMap: {
        "compliant":     { icon: "✓", color: "#27ae60", label: "Conforme" },
        "partial":       { icon: "⚠", color: "#f39c12", label: "Partiel" },
        "non-compliant": { icon: "✗", color: "#c0392b", label: "Non conforme" },
        "na":            { icon: "—", color: "#95a5a6", label: "N/A" },
      },
    }, width: "min" },
    { id: "col_ctrl_id", header: "ID",           type: "mono",        align: "left", config: {} },
    { id: "col_desc",    header: "Description",  type: "text",        align: "left", config: {} },
    { id: "col_notes",   header: "Notes",        type: "text",        align: "left", config: { maxWidth: 180 } },
  ],
  sampleRows: [
    { id: "row_0", _group: "A5", cells: { col_section: "A5", col_status: "compliant",     col_ctrl_id: "A.5.1", col_desc: "Politiques pour la sécurité de l'information",  col_notes: "Policies v2.1 approved by CODIR" } },
    { id: "row_1", _group: "A5", cells: { col_section: "A5", col_status: "compliant",     col_ctrl_id: "A.5.2", col_desc: "Structure et responsabilités",                  col_notes: "RACI matrix defined" } },
    { id: "row_2", _group: "A5", cells: { col_section: "A5", col_status: "partial",       col_ctrl_id: "A.5.3", col_desc: "Séparation des responsabilités",                col_notes: "En cours de mise en œuvre" } },
    { id: "row_3", _group: "A8", cells: { col_section: "A8", col_status: "compliant",     col_ctrl_id: "A.8.1", col_desc: "Inventaire des actifs",                         col_notes: "CMDB managed" } },
    { id: "row_4", _group: "A8", cells: { col_section: "A8", col_status: "non-compliant", col_ctrl_id: "A.8.2", col_desc: "Propriété des actifs",                          col_notes: "À assigner pour legacy" } },
  ],
}
```

---

### Preset 12: `ebios-feared-events`

**Replaces**: `ebios-feared-events` block

```js
{
  id: "ebios-feared-events",
  label: "Événements redoutés",
  icon: "list-check",
  category: "grc",
  defaultTitle: "Événements Redoutés EBIOS",
  defaultMeta: [],
  accentBorderColumn: "col_severity",
  columns: [
    { id: "col_id",         header: "ID",              type: "row-id",  align: "left", config: { accentColored: false } },
    { id: "col_value",      header: "Bien essentiel",  type: "text",    align: "left", config: {} },
    { id: "col_event",      header: "Événement redouté", type: "text",  align: "left", config: { maxWidth: 220 } },
    { id: "col_severity",   header: "Gravité",         type: "badge",   align: "left", config: {
      colorMap: {
        "1": { bg: "#27ae6018", text: "#27ae60", label: "Faible" },
        "2": { bg: "#f39c1218", text: "#f39c12", label: "Moyen" },
        "3": { bg: "#e67e2218", text: "#e67e22", label: "Élevé" },
        "4": { bg: "#c0392b18", text: "#c0392b", label: "Critique" },
      },
      shape: "pill", uppercase: true,
    }},
    { id: "col_impact",     header: "Type d'impact",   type: "text",    align: "left", config: {} },
    { id: "col_source",     header: "Source de risque", type: "text",    align: "left", config: {} },
  ],
  sampleRows: [
    { id: "row_0", cells: { col_id: "EV001", col_value: "Données confidentielles clients", col_event: "Vol de données confidentielles",           col_severity: "4", col_impact: "Confidentialité",                   col_source: "Groupe APT - État tiers" } },
    { id: "row_1", cells: { col_id: "EV002", col_value: "Disponibilité du service",         col_event: "Indisponibilité du service >4h",           col_severity: "3", col_impact: "Disponibilité",                    col_source: "Attaquant financier / Compétiteur" } },
    { id: "row_2", cells: { col_id: "EV003", col_value: "Intégrité des données",            col_event: "Modification malveillante des données",    col_severity: "3", col_impact: "Intégrité",                        col_source: "Malveillant interne" } },
    { id: "row_3", cells: { col_id: "EV004", col_value: "Infrastructure réseau",            col_event: "Compromission critique d'équipement",      col_severity: "4", col_impact: "Disponibilité + Confidentialité",  col_source: "Groupe cybercriminel" } },
  ],
}
```

---

### Preset 13: `ebios-scenarios`

**Replaces**: `ebios-scenarios` block

```js
{
  id: "ebios-scenarios",
  label: "Scénarios EBIOS",
  icon: "diagram-project",
  category: "grc",
  defaultTitle: "Scénarios de Risque EBIOS",
  defaultMeta: [],
  columns: [
    { id: "col_id",         header: "ID",              type: "row-id",      align: "left",   config: { accentColored: false } },
    { id: "col_name",       header: "Scénario",        type: "text",        align: "left",   config: {} },
    { id: "col_type",       header: "Type",            type: "badge",       align: "left",   config: {
      colorMap: {
        "operational": { bg: "#3498db", text: "#fff", label: "Opérationnel" },
        "strategic":   { bg: "#8e44ad", text: "#fff", label: "Stratégique" },
      },
      shape: "pill", uppercase: true,
    }},
    { id: "col_likelihood", header: "Vrais.",          type: "score-badge", align: "center", config: {
      ranges: [
        { min: 4, max: 4, bg: "#c0392b18", text: "#c0392b" },
        { min: 3, max: 3, bg: "#e67e2218", text: "#e67e22" },
        { min: 2, max: 2, bg: "#f39c1218", text: "#f39c12" },
        { min: 1, max: 1, bg: "#27ae6018", text: "#27ae60" },
      ],
    }},
    { id: "col_severity",   header: "Gravité",         type: "score-badge", align: "center", config: {
      ranges: [
        { min: 4, max: 4, bg: "#c0392b18", text: "#c0392b" },
        { min: 3, max: 3, bg: "#e67e2218", text: "#e67e22" },
        { min: 2, max: 2, bg: "#f39c1218", text: "#f39c12" },
        { min: 1, max: 1, bg: "#27ae6018", text: "#27ae60" },
      ],
    }},
    { id: "col_inherent",   header: "Risque",          type: "score-badge", align: "center", config: {
      ranges: [
        { min: 12, max: 16, bg: "#c0392b", text: "#fff" },
        { min: 8,  max: 11, bg: "#e67e22", text: "#fff" },
        { min: 4,  max: 7,  bg: "#f39c12", text: "#fff" },
        { min: 1,  max: 3,  bg: "#27ae60", text: "#fff" },
      ],
    }},
    { id: "col_treatment",  header: "Traitement",      type: "badge",       align: "left",   config: {
      colorMap: {
        "reduce":   { bg: "#3498db", text: "#fff", label: "Réduire" },
        "accept":   { bg: "#27ae60", text: "#fff", label: "Accepter" },
        "transfer": { bg: "#f39c12", text: "#fff", label: "Transférer" },
        "avoid":    { bg: "#c0392b", text: "#fff", label: "Éviter" },
      },
      shape: "pill", uppercase: false,
    }},
    { id: "col_owner",      header: "Propriétaire",    type: "text",        align: "left",   config: {} },
  ],
  sampleRows: [
    { id: "row_0", cells: { col_id: "SC001", col_name: "Compromission de l'accès administrateur",    col_type: "operational", col_likelihood: 3, col_severity: 4, col_inherent: 12, col_treatment: "reduce", col_owner: "CISO" } },
    { id: "row_1", cells: { col_id: "SC002", col_name: "Attaque DDoS massif",                        col_type: "strategic",   col_likelihood: 2, col_severity: 3, col_inherent: 6,  col_treatment: "accept", col_owner: "Responsable Infrastructure" } },
    { id: "row_2", cells: { col_id: "SC003", col_name: "Fuite de données via insider malveillant",   col_type: "operational", col_likelihood: 2, col_severity: 4, col_inherent: 8,  col_treatment: "reduce", col_owner: "Responsable Sécurité" } },
  ],
}
```

---

### Preset 14: `control-matrix`

**Replaces**: `control-matrix` block

```js
{
  id: "control-matrix",
  label: "Matrice des contrôles",
  icon: "shield-alt",
  category: "grc",
  defaultTitle: "Matrice d'Efficacité des Contrôles",
  defaultMeta: [],
  columns: [
    { id: "col_id",     header: "ID",         type: "row-id",      align: "left",   config: { accentColored: false } },
    { id: "col_name",   header: "Contrôle",    type: "text",        align: "left",   config: {} },
    { id: "col_type",   header: "Type",        type: "badge",       align: "left",   config: {
      colorMap: {
        "preventive": { bg: "#3498db18", text: "#3498db", label: "Préventif" },
        "detective":  { bg: "#e67e2218", text: "#e67e22", label: "Détectif" },
        "corrective": { bg: "#27ae6018", text: "#27ae60", label: "Correctif" },
      },
      shape: "rounded", uppercase: false,
    }},
    { id: "col_freq",   header: "Fréquence",   type: "text",        align: "left",   config: {} },
    { id: "col_eff",    header: "Efficacité",   type: "score-badge", align: "center", config: {
      ranges: [
        { min: 5, max: 5, bg: "#27ae6018", text: "#27ae60" },
        { min: 4, max: 4, bg: "#3498db18", text: "#3498db" },
        { min: 3, max: 3, bg: "#f39c1218", text: "#f39c12" },
        { min: 1, max: 2, bg: "#e74c3c18", text: "#e74c3c" },
      ],
    }},
    // Threat coverage columns (dynamic, like RACI stakeholders)
    { id: "col_th1",    header: "Compromission compte", type: "score-badge", align: "center", config: {
      ranges: [
        { min: 4, max: 5, bg: "#27ae6018", text: "#27ae60" },
        { min: 2, max: 3, bg: "#f39c1218", text: "#f39c12" },
        { min: 0, max: 1, bg: "#e74c3c18", text: "#e74c3c" },
      ],
    }},
    { id: "col_th2",    header: "Exploit. vuln.",        type: "score-badge", align: "center", config: {
      ranges: [
        { min: 4, max: 5, bg: "#27ae6018", text: "#27ae60" },
        { min: 2, max: 3, bg: "#f39c1218", text: "#f39c12" },
        { min: 0, max: 1, bg: "#e74c3c18", text: "#e74c3c" },
      ],
    }},
    { id: "col_th3",    header: "Incident données",      type: "score-badge", align: "center", config: {
      ranges: [
        { min: 4, max: 5, bg: "#27ae6018", text: "#27ae60" },
        { min: 2, max: 3, bg: "#f39c1218", text: "#f39c12" },
        { min: 0, max: 1, bg: "#e74c3c18", text: "#e74c3c" },
      ],
    }},
    { id: "col_th4",    header: "Indisponibilité",       type: "score-badge", align: "center", config: {
      ranges: [
        { min: 4, max: 5, bg: "#27ae6018", text: "#27ae60" },
        { min: 2, max: 3, bg: "#f39c1218", text: "#f39c12" },
        { min: 0, max: 1, bg: "#e74c3c18", text: "#e74c3c" },
      ],
    }},
  ],
  columnTemplate: {
    type: "score-badge", align: "center",
    config: {
      ranges: [
        { min: 4, max: 5, bg: "#27ae6018", text: "#27ae60" },
        { min: 2, max: 3, bg: "#f39c1218", text: "#f39c12" },
        { min: 0, max: 1, bg: "#e74c3c18", text: "#e74c3c" },
      ],
    },
  },
  sampleRows: [
    { id: "row_0", cells: { col_id: "C001", col_name: "Multi-Factor Authentication",    col_type: "preventive", col_freq: "Continu",      col_eff: 5, col_th1: 5, col_th2: 1, col_th3: 2, col_th4: null } },
    { id: "row_1", cells: { col_id: "C002", col_name: "Logs & Monitoring centralisé",   col_type: "detective",  col_freq: "Temps réel",   col_eff: 4, col_th1: 4, col_th2: null, col_th3: 5, col_th4: null } },
    { id: "row_2", cells: { col_id: "C003", col_name: "Patches & Update management",    col_type: "preventive", col_freq: "Mensuel",      col_eff: 4, col_th1: null, col_th2: 4, col_th3: null, col_th4: 3 } },
    { id: "row_3", cells: { col_id: "C004", col_name: "Incident response plan",         col_type: "corrective", col_freq: "À la demande", col_eff: 3, col_th1: null, col_th2: null, col_th3: 3, col_th4: null } },
    { id: "row_4", cells: { col_id: "C005", col_name: "Segmentation réseau",            col_type: "preventive", col_freq: "Continu",      col_eff: 4, col_th1: 3, col_th2: null, col_th3: null, col_th4: 4 } },
    { id: "row_5", cells: { col_id: "C006", col_name: "Penetration Testing",            col_type: "detective",  col_freq: "Trimestriel",  col_eff: 4, col_th1: null, col_th2: 4, col_th3: null, col_th4: null } },
  ],
}
```

---

## E) Migration Path

### Backward Compatibility Strategy

The table block type stays `"table"`. The renderer detects the data format and handles both:

```js
// In the table block renderer / data access layer:
function normalizeTableData(data) {
  // ── New format: has columns array ──
  if (Array.isArray(data.columns)) {
    return data;
  }

  // ── Legacy format: { headers: string[], rows: string[][] } ──
  const headers = data.headers || [];
  const legacyRows = data.rows || [];

  return {
    title: "",
    subtitle: "",
    meta: [],
    columns: headers.map((h, i) => ({
      id: `col_${i}`,
      header: h,
      type: "rich-text",
      align: "left",
      config: {},
    })),
    rows: legacyRows.map((row, ri) => ({
      id: `row_${ri}`,
      cells: Object.fromEntries(
        (Array.isArray(row) ? row : []).map((cell, ci) => [`col_${ci}`, cell])
      ),
    })),
    groups: [],
    groupByColumn: null,
    accentBorderColumn: null,
    legend: null,
    summaryBar: null,
    showMasked: false,
    preset: null,
  };
}
```

### Migration for Specialized Blocks

Each specialized block type will be handled by a one-time migration function that converts its custom `defaultData` into the universal table format. This runs when the report is loaded:

```js
const BLOCK_MIGRATORS = {
  "port-scan-table": (data) => ({
    ...getPresetDefaults("port-scan"),
    title: data.title || "Résultats Nmap",
    meta: [
      ...(data.target ? [{ label: "Cible", value: data.target }] : []),
      ...(data.scanDate ? [{ label: "Date", value: data.scanDate }] : []),
    ],
    rows: (data.entries || []).map((e, i) => ({
      id: `row_${i}`,
      cells: {
        col_port: String(e.port),
        col_proto: (e.protocol || "tcp").toUpperCase(),
        col_state: (e.state || "open").toLowerCase(),
        col_service: e.service || "",
        col_version: e.version || "",
        col_info: e.info || "",
      },
    })),
  }),

  "credentials-table": (data) => ({
    ...getPresetDefaults("credentials"),
    title: data.title || "Identifiants découverts",
    showMasked: data.showPasswords === true,
    rows: (data.credentials || []).map((c, i) => ({
      id: `row_${i}`,
      cells: {
        col_username: c.username || "",
        col_password: c.password || "",
        col_source: c.source || "",
        col_type: (c.type || "").toLowerCase(),
        col_location: c.location || "",
        col_severity: (c.severity || "medium").toLowerCase(),
      },
    })),
  }),

  "cve-table": (data) => ({
    ...getPresetDefaults("cve-table"),
    title: data.title || "CVE identifiées",
    rows: (data.cves || []).map((c, i) => ({
      id: `row_${i}`,
      cells: {
        col_id: c.id || "",
        col_cvss: c.cvss ?? null,
        col_severity: c.severity || sevFromScore(c.cvss),
        col_affected: c.affected || "",
        col_status: c.remediationStatus || "open",
        col_description: c.description || "",
      },
    })),
  }),

  "firewall-rules": (data) => ({
    ...getPresetDefaults("firewall-rules"),
    title: data.title || "Règles firewall",
    rows: (data.rules || []).map((r, i) => ({
      id: `row_${i}`,
      cells: {
        col_num: String(r.id || i + 1),
        col_source: r.source || "",
        col_destination: r.destination || "",
        col_port: String(r.port || ""),
        col_proto: (r.protocol || "tcp").toUpperCase(),
        col_action: (r.action || "deny").toLowerCase(),
        col_desc: r.description || "",
      },
    })),
  }),

  "server-inventory": (data) => ({
    ...getPresetDefaults("server-inventory"),
    title: data.title || "Inventaire des serveurs",
    rows: (data.servers || []).map((s, i) => ({
      id: `row_${i}`,
      cells: {
        col_hostname: s.hostname || "",
        col_ip: s.ip || "",
        col_os: s.os || "",
        col_role: s.role || "",
        col_patch: s.patchLevel || "",
        col_status: (s.status || "unknown").toLowerCase(),
      },
    })),
  }),

  "dns-records": (data) => ({
    ...getPresetDefaults("dns-records"),
    title: data.title || "Enregistrements DNS",
    meta: data.domain ? [{ label: "Domaine", value: data.domain }] : [],
    rows: (data.records || []).map((r, i) => ({
      id: `row_${i}`,
      cells: {
        col_type: (r.type || "A").toUpperCase(),
        col_name: r.name || "",
        col_value: r.value || "",
        col_ttl: String(r.ttl || ""),
        col_priority: r.priority != null ? String(r.priority) : "",
      },
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
      cells: {
        col_ssid: n.ssid || "[Hidden]",
        col_bssid: n.bssid || "",
        col_channel: n.channel ?? null,
        col_signal: n.signal ?? -50,
        col_encryption: n.encryption || "?",
        col_notes: n.notes || "",
      },
    })),
  }),

  "risk-register": (data) => ({
    ...getPresetDefaults("risk-register"),
    title: data.title || "Registre des Risques",
    rows: (data.risks || []).map((r, i) => {
      const l = r.likelihood || 1;
      const imp = r.impact || 1;
      return {
        id: `row_${i}`,
        cells: {
          col_id: r.id || "",
          col_name: r.name || "",
          col_category: r.category || "",
          col_likelihood: l,
          col_impact: imp,
          col_inherent: r.inherentRisk ?? l * imp,
          col_controls: Array.isArray(r.controls) ? r.controls.length : 0,
          col_residual: r.residualRisk ?? (r.inherentRisk ?? l * imp),
          col_owner: r.owner || "",
          col_status: (r.status || "active").toLowerCase(),
        },
      };
    }),
  }),

  "action-plan": (data) => ({
    ...getPresetDefaults("action-plan"),
    title: data.title || "Plan d'Action",
    rows: (data.actions || []).map((a, i) => ({
      id: `row_${i}`,
      _group: a.quarter || "",
      cells: {
        col_id: a.id || "",
        col_action: a.action || "",
        col_responsible: a.responsible || "",
        col_deadline: a.deadline || "",
        col_priority: (a.priority || "medium").toLowerCase(),
        col_status: (a.status || "todo").toLowerCase(),
        col_progress: a.progress ?? 0,
        col_quarter: a.quarter || "",
      },
    })),
  }),

  "raci-matrix": (data) => {
    const stakeholders = data.stakeholders || [];
    const tasks = data.tasks || [];
    const assignments = data.assignments || [];
    const lookup = new Map();
    for (const a of assignments) lookup.set(`${a.task}::${a.stakeholder}`, a.role);

    const raciConfig = {
      colorMap: { R: { bg: "#27ae60" }, A: { bg: "#e74c3c" }, C: { bg: "#f39c12" }, I: { bg: "#3498db" } },
      emptySymbol: "—",
    };

    return {
      ...getPresetDefaults("raci-matrix"),
      title: data.title || "Matrice RACI",
      columns: [
        { id: "col_task", header: "Tâche", type: "text", align: "left", config: {}, width: 180 },
        ...stakeholders.map((s) => ({
          id: `col_${s.id}`,
          header: s.name,
          type: "circle-badge",
          align: "center",
          config: raciConfig,
        })),
      ],
      legend: [
        { symbol: "R", bg: "#27ae60", label: "Responsable" },
        { symbol: "A", bg: "#e74c3c", label: "Approbateur" },
        { symbol: "C", bg: "#f39c12", label: "Consulté" },
        { symbol: "I", bg: "#3498db", label: "Informé" },
      ],
      rows: tasks.map((t, i) => ({
        id: `row_${i}`,
        cells: {
          col_task: t.task,
          ...Object.fromEntries(
            stakeholders.map((s) => [`col_${s.id}`, lookup.get(`${t.id}::${s.id}`) || ""])
          ),
        },
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
          id: `row_${rows.length}`,
          _group: sec.id,
          cells: {
            col_section: sec.id,
            col_status: ctrl.status || "na",
            col_ctrl_id: ctrl.id || "",
            col_desc: ctrl.description || "",
            col_notes: ctrl.notes || "",
          },
        });
      }
    }
    return {
      ...getPresetDefaults("compliance-checklist"),
      title: data.title || "Checklist de Conformité",
      meta: data.framework ? [{ label: "Framework", value: data.framework }] : [],
      groups,
      rows,
    };
  },

  "ebios-feared-events": (data) => ({
    ...getPresetDefaults("ebios-feared-events"),
    title: data.title || "Événements Redoutés EBIOS",
    rows: (data.events || []).map((e, i) => ({
      id: `row_${i}`,
      cells: {
        col_id: e.id || "",
        col_value: e.essentialValue || "",
        col_event: e.fearedEvent || "",
        col_severity: String(e.severity || 2),
        col_impact: e.impactType || "",
        col_source: e.source || "",
      },
    })),
  }),

  "ebios-scenarios": (data) => ({
    ...getPresetDefaults("ebios-scenarios"),
    title: data.title || "Scénarios de Risque EBIOS",
    rows: (data.scenarios || []).map((s, i) => ({
      id: `row_${i}`,
      cells: {
        col_id: s.id || "",
        col_name: s.name || "",
        col_type: (s.type || "operational").toLowerCase(),
        col_likelihood: s.likelihood || 2,
        col_severity: s.severity || 2,
        col_inherent: s.inherentRisk || ((s.likelihood || 2) * (s.severity || 2)),
        col_treatment: (s.treatment || "reduce").toLowerCase(),
        col_owner: s.owner || "",
      },
    })),
  }),

  "control-matrix": (data) => {
    const controls = data.controls || [];
    const threats = data.threats || [];
    const coverage = data.coverage || [];
    const coverageLookup = new Map();
    for (const c of coverage) coverageLookup.set(`${c.control}::${c.threat}`, c.effectiveness);

    const threatScoreConfig = {
      ranges: [
        { min: 4, max: 5, bg: "#27ae6018", text: "#27ae60" },
        { min: 2, max: 3, bg: "#f39c1218", text: "#f39c12" },
        { min: 0, max: 1, bg: "#e74c3c18", text: "#e74c3c" },
      ],
    };

    return {
      ...getPresetDefaults("control-matrix"),
      title: data.title || "Matrice d'Efficacité des Contrôles",
      columns: [
        { id: "col_id", header: "ID", type: "row-id", align: "left", config: { accentColored: false } },
        { id: "col_name", header: "Contrôle", type: "text", align: "left", config: {} },
        { id: "col_type", header: "Type", type: "badge", align: "left", config: {
          colorMap: {
            preventive: { bg: "#3498db18", text: "#3498db", label: "Préventif" },
            detective:  { bg: "#e67e2218", text: "#e67e22", label: "Détectif" },
            corrective: { bg: "#27ae6018", text: "#27ae60", label: "Correctif" },
          },
          shape: "rounded", uppercase: false,
        }},
        { id: "col_freq", header: "Fréquence", type: "text", align: "left", config: {} },
        { id: "col_eff", header: "Efficacité", type: "score-badge", align: "center", config: {
          ranges: [
            { min: 5, max: 5, bg: "#27ae6018", text: "#27ae60" },
            { min: 4, max: 4, bg: "#3498db18", text: "#3498db" },
            { min: 3, max: 3, bg: "#f39c1218", text: "#f39c12" },
            { min: 1, max: 2, bg: "#e74c3c18", text: "#e74c3c" },
          ],
        }},
        ...threats.map((t) => ({
          id: `col_${t.id}`,
          header: t.name,
          type: "score-badge",
          align: "center",
          config: threatScoreConfig,
        })),
      ],
      rows: controls.map((c, i) => ({
        id: `row_${i}`,
        cells: {
          col_id: c.id,
          col_name: c.name,
          col_type: c.type,
          col_freq: c.frequency || "",
          col_eff: c.effectiveness,
          ...Object.fromEntries(
            threats.map((t) => [
              `col_${t.id}`,
              coverageLookup.get(`${c.id}::${t.id}`) ?? null,
            ])
          ),
        },
      })),
    };
  },
};
```

### Migration Execution

The migration runs **in the renderer**, not in the database. This ensures:
1. No destructive database migration needed
2. Existing reports render correctly immediately
3. Data is converted to new format on first edit (write-on-save)

```js
// In UniversalTableBlock.jsx
export function UniversalTableBlock({ block, accentColor }) {
  const data = useMemo(() => {
    const migrator = BLOCK_MIGRATORS[block.type];
    if (migrator) return migrator(block.data);
    return normalizeTableData(block.data);
  }, [block.type, block.data]);

  // ... render using normalized data
}
```

### Block Registry Update

After migration, the 14 specialized block types remain in the registry for backward compatibility but are **hidden from the palette** and all render through the universal table renderer:

```js
// In blocks/index.js — all 14 types point to UniversalTableBlock
export const blockRenderers = {
  "table":                UniversalTableBlock,
  "port-scan-table":      UniversalTableBlock,
  "credentials-table":    UniversalTableBlock,
  "cve-table":            UniversalTableBlock,
  "firewall-rules":       UniversalTableBlock,
  "server-inventory":     UniversalTableBlock,
  "dns-records":          UniversalTableBlock,
  "wireless-survey":      UniversalTableBlock,
  "risk-register":        UniversalTableBlock,
  "action-plan":          UniversalTableBlock,
  "raci-matrix":          UniversalTableBlock,
  "compliance-checklist": UniversalTableBlock,
  "ebios-feared-events":  UniversalTableBlock,
  "ebios-scenarios":      UniversalTableBlock,
  "control-matrix":       UniversalTableBlock,
  // ... other non-table blocks unchanged
};
```

The block palette shows only `"table"` with a **preset picker** sub-menu. Users select "Tableau" → pick a preset (or start blank).

---

## Summary of Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `app/frontend/lib/tablePresets.js` | **CREATE** | 14 preset definitions + `getPresetDefaults(id)` helper |
| `app/frontend/lib/tableMigration.js` | **CREATE** | `normalizeTableData()` + `BLOCK_MIGRATORS` for all 14 types |
| `app/frontend/components/Editor/blocks/UniversalTableBlock.jsx` | **CREATE** | Single renderer with column type dispatch |
| `app/frontend/components/Editor/blocks/cellRenderers/` | **CREATE** | One file per column type renderer (12 files) |
| `app/frontend/components/Editor/modals/UniversalTableModal.jsx` | **CREATE** | New modal editor with column type config, preset picker |
| `app/frontend/components/Editor/blocks/index.js` | **MODIFY** | Map all 15 block types to `UniversalTableBlock` |
| `app/frontend/stores/blockRegistry.js` | **MODIFY** | Update `table` defaultData; mark 14 old types as `hidden: true` |

---

## Open Questions for User

None — this spec is self-contained and ready for implementation tickets.
