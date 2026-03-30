export const blockRegistry = [
  // Content
  {
    type: "section-title", label: "Titre de section", category: "content", icon: "heading",
    isContainer: false, defaultData: { text: "Section", level: 2 },
    properties: [
      { key: "text", type: "text", label: "Texte" },
      { key: "level", type: "select", label: "Niveau", options: [
        { value: 1, label: "H1" }, { value: 2, label: "H2" }, { value: 3, label: "H3" },
        { value: 4, label: "H4" }, { value: 5, label: "H5" }, { value: 6, label: "H6" },
      ]},
    ],
  },
  {
    type: "text", label: "Texte", category: "content", icon: "align-left",
    isContainer: false, defaultData: { content: "" },
    properties: [{ key: "content", type: "textarea", label: "Contenu" }],
  },
  {
    type: "code", label: "Code", category: "content", icon: "code",
    isContainer: false, defaultData: { code: "", language: "bash" },
    properties: [
      { key: "language", type: "select", label: "Langage", options: [
        { value: "bash", label: "Bash" }, { value: "powershell", label: "PowerShell" },
        { value: "python", label: "Python" }, { value: "javascript", label: "JavaScript" },
        { value: "json", label: "JSON" }, { value: "yaml", label: "YAML" },
        { value: "sql", label: "SQL" }, { value: "text", label: "Texte brut" },
      ]},
      { key: "code", type: "code", label: "Code" },
    ],
  },
  {
    type: "table", label: "Tableau", category: "content", icon: "table",
    isContainer: false, defaultData: {
      title: "", subtitle: "", meta: [],
      columns: [
        { id: "col_a", header: "Colonne 1", type: "text", align: "left", config: {} },
        { id: "col_b", header: "Colonne 2", type: "text", align: "left", config: {} },
      ],
      rows: [{ id: "row_1", cells: { col_a: "", col_b: "" } }],
      groups: [], groupByColumn: null, showMasked: false,
      accentBorderColumn: null, legend: null, summaryBar: null, preset: null,
    },
    properties: [{ key: "_table", type: "table-editor" }],
  },
  {
    type: "separator", label: "Séparateur", category: "layout", icon: "grip-lines",
    isContainer: false, defaultData: { style: "line" },
    properties: [{ key: "style", type: "select", label: "Style", options: [
      { value: "line", label: "Ligne" }, { value: "dots", label: "Points" }, { value: "space", label: "Espace" },
    ]}],
  },
  {
    type: "spacer", label: "Espacement", category: "layout", icon: "arrows-alt-v",
    isContainer: false, defaultData: { height: 24 },
    properties: [{ key: "height", type: "range", label: "Hauteur", min: 8, max: 120, step: 4, unit: "px" }],
  },
  {
    type: "callout", label: "Encart", category: "content", icon: "exclamation-circle",
    isContainer: false, defaultData: { variant: "info", content: "Note importante" },
    properties: [
      { key: "variant", type: "select", label: "Type", options: [
        { value: "info", label: "Info" }, { value: "warning", label: "Attention" },
        { value: "danger", label: "Danger" }, { value: "success", label: "Succès" },
      ]},
      { key: "content", type: "textarea", label: "Contenu" },
    ],
  },
  // Layout
  {
    type: "horizontal-div", label: "Colonnes", category: "layout", icon: "columns",
    isContainer: true, defaultData: {},
    properties: [
      { key: "_children", type: "children-editor", label: "Colonnes" },
    ],
  },
  {
    type: "drawer", label: "Dépliable", category: "layout", icon: "folder",
    isContainer: true, defaultData: { title: "Section", open: true },
    properties: [
      { key: "title", type: "text", label: "Titre" },
      { key: "open", type: "toggle", label: "Ouvert par défaut" },
      { key: "_children", type: "children-editor", label: "Contenu" },
    ],
  },
  // Media
  {
    type: "image", label: "Image", category: "media", icon: "image",
    isContainer: false, defaultData: { images: [{ url: "", caption: "" }], magnification: false },
    properties: [
      { key: "_images", type: "image-list" },
      { key: "magnification", type: "toggle", label: "Magnification" },
    ],
  },
  // Pentest
  {
    type: "score-gauge", label: "Scores", category: "pentest", icon: "tachometer-alt",
    isContainer: false,
    defaultData: {
      title: "Facteurs de Vraisemblance",
      scores: [
        { label: "Compétences", value: 7 },
        { label: "Motivation", value: 6 },
        { label: "Opportunité", value: 5 },
        { label: "Découverte", value: 4 },
      ],
      max: 9,
    },
    properties: [{ key: "_scores", type: "json-editor", label: "Scores (JSON)" }],
  },
  {
    type: "risk-matrix", label: "Matrice de risques", category: "pentest", icon: "th",
    isContainer: false,
    defaultData: {
      xLabel: "Vraisemblance", yLabel: "Impact",
      points: [{ label: "Score global", x: 0.83, y: 0.83 }],
    },
    properties: [{ key: "_matrix", type: "json-editor", label: "Matrice (JSON)" }],
  },
  {
    type: "risk-assessment", label: "Évaluation des risques", category: "pentest", icon: "shield-alt",
    isContainer: false,
    defaultData: {
      title: "Matrice de Risque (OWASP)",
      likelihood: [
        { label: "Compétences", value: 9 },
        { label: "Motivation", value: 9 },
        { label: "Opportunité", value: 9 },
        { label: "Population", value: 6 },
        { label: "Découverte", value: 3 },
        { label: "Exploitation", value: 3 },
        { label: "Sensibilisation", value: 4 },
        { label: "Détection", value: 8 },
      ],
      impact: [
        { label: "Confidentialité", value: 9 },
        { label: "Intégrité", value: 9 },
        { label: "Disponibilité", value: 9 },
        { label: "Traçabilité", value: 9 },
        { label: "Financier", value: 9 },
        { label: "Réputation", value: 9 },
        { label: "Non-conformité", value: 7 },
        { label: "Vie privée", value: 9 },
      ],
      max: 9,
      xLabel: "Vraisemblance", yLabel: "Impact",
    },
    properties: [{ key: "_assessment", type: "json-editor", label: "Évaluation (JSON)" }],
  },
  // Graph
  {
    type: "bar-chart", label: "Diagramme en barres", category: "graph", icon: "chart-bar",
    isContainer: false,
    defaultData: {
      title: "Résultats",
      orientation: "vertical",
      showValues: true,
      items: [
        { label: "Critique", value: 5, color: "#e74c3c" },
        { label: "Élevé", value: 8, color: "#e67e22" },
        { label: "Moyen", value: 12, color: "#f39c12" },
        { label: "Faible", value: 4, color: "#27ae60" },
      ],
    },
    properties: [
      { key: "title", type: "text", label: "Titre" },
      { key: "orientation", type: "select", label: "Orientation", options: [
        { value: "vertical", label: "Vertical" },
        { value: "horizontal", label: "Horizontal" },
      ]},
      { key: "showValues", type: "toggle", label: "Afficher les valeurs" },
      { key: "_items", type: "json-editor", label: "Données (JSON)" },
    ],
  },
  {
    type: "line-chart", label: "Courbes", category: "graph", icon: "chart-line",
    isContainer: false,
    defaultData: {
      title: "Évolution",
      labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun"],
      datasets: [{ name: "Série 1", color: "#E8A855", values: [10, 28, 18, 34, 22, 40] }],
      showDots: true, showArea: false,
    },
    properties: [{ key: "title", type: "text", label: "Titre" }],
  },
  {
    type: "pie-chart", label: "Camembert", category: "graph", icon: "chart-pie",
    isContainer: false,
    defaultData: {
      title: "Répartition",
      items: [
        { label: "Critique", value: 5, color: "#e74c3c" },
        { label: "Élevé", value: 8, color: "#e67e22" },
        { label: "Moyen", value: 12, color: "#f39c12" },
        { label: "Faible", value: 4, color: "#27ae60" },
      ],
      donut: false,
    },
    properties: [{ key: "title", type: "text", label: "Titre" }, { key: "donut", type: "toggle", label: "Donut" }],
  },
  {
    type: "gauge-chart", label: "Jauge", category: "graph", icon: "bullseye",
    isContainer: false,
    defaultData: { title: "Score global", value: 72, max: 100, unit: "%" },
    properties: [
      { key: "title", type: "text", label: "Titre" },
      { key: "value", type: "range", label: "Valeur", min: 0, max: 100, step: 1 },
      { key: "max", type: "number", label: "Maximum" },
      { key: "unit", type: "text", label: "Unité" },
    ],
  },
  {
    type: "radar-chart", label: "Radar", category: "graph", icon: "crosshairs",
    isContainer: false,
    defaultData: {
      title: "Compétences",
      axes: [
        { label: "Réseau", value: 8, max: 10 },
        { label: "Crypto", value: 6, max: 10 },
        { label: "Web", value: 9, max: 10 },
        { label: "Système", value: 7, max: 10 },
        { label: "Social Eng.", value: 5, max: 10 },
      ],
      color: "#E8A855",
    },
    properties: [{ key: "title", type: "text", label: "Titre" }],
  },
  {
    type: "heatmap", label: "Carte de chaleur", category: "graph", icon: "border-all",
    isContainer: false,
    defaultData: {
      title: "Activité par jour",
      xLabels: ["Lun", "Mar", "Mer", "Jeu", "Ven"],
      yLabels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
      data: [[3, 7, 2, 8, 4], [5, 1, 9, 3, 6], [2, 8, 4, 7, 1], [6, 3, 5, 2, 9]],
      minColor: "#f0ede6", maxColor: "#e74c3c",
    },
    properties: [{ key: "title", type: "text", label: "Titre" }],
  },
  {
    type: "stacked-bar", label: "Barres empilées", category: "graph", icon: "layer-group",
    isContainer: false,
    defaultData: {
      title: "Vulnérabilités par trimestre",
      labels: ["Q1", "Q2", "Q3", "Q4"],
      series: [
        { name: "Critique", color: "#e74c3c", values: [3, 5, 2, 4] },
        { name: "Élevé", color: "#e67e22", values: [7, 4, 8, 6] },
        { name: "Moyen", color: "#f39c12", values: [12, 9, 15, 11] },
      ],
      orientation: "vertical",
    },
    properties: [{ key: "title", type: "text", label: "Titre" }],
  },
  {
    type: "area-chart", label: "Courbe d'aire", category: "graph", icon: "chart-area",
    isContainer: false,
    defaultData: {
      title: "Trafic réseau",
      labels: ["00h", "04h", "08h", "12h", "16h", "20h"],
      datasets: [{ name: "Entrant", color: "#5B8FD4", values: [120, 80, 340, 520, 410, 260] }],
      showDots: true,
    },
    properties: [{ key: "title", type: "text", label: "Titre" }],
  },
  {
    type: "scatter-plot", label: "Nuage de points", category: "graph", icon: "project-diagram",
    isContainer: false,
    defaultData: {
      title: "CVSS vs Exploitabilité",
      xLabel: "Score CVSS", yLabel: "Exploitabilité",
      points: [
        { x: 9.1, y: 8, label: "CVE-2024-001", color: "#e74c3c" },
        { x: 7.5, y: 6, label: "CVE-2024-002", color: "#e67e22" },
        { x: 5.2, y: 3, label: "CVE-2024-003", color: "#f39c12" },
        { x: 3.1, y: 2, label: "CVE-2024-004", color: "#27ae60" },
      ],
    },
    properties: [{ key: "title", type: "text", label: "Titre" }],
  },
  {
    type: "sparkline", label: "Sparkline", category: "graph", icon: "grip-lines",
    isContainer: false,
    defaultData: { title: "Tendance", values: [4, 7, 3, 8, 5, 9, 6, 11], color: "#E8A855" },
    properties: [{ key: "title", type: "text", label: "Titre" }, { key: "color", type: "color", label: "Couleur" }],
  },
  {
    type: "funnel-chart", label: "Entonnoir", category: "graph", icon: "filter",
    isContainer: false,
    defaultData: {
      title: "Pipeline d'attaque",
      items: [
        { label: "Reconnaissance", value: 100, color: "#5B8FD4" },
        { label: "Scan", value: 72, color: "#E8A855" },
        { label: "Exploitation", value: 38, color: "#e67e22" },
        { label: "Post-Exploit", value: 15, color: "#e74c3c" },
      ],
    },
    properties: [{ key: "title", type: "text", label: "Titre" }],
  },
  {
    type: "waterfall-chart", label: "Cascade", category: "graph", icon: "signal",
    isContainer: false,
    defaultData: {
      title: "Évolution du score",
      items: [
        { label: "Initial", value: 80, type: "total" },
        { label: "Patch 1", value: -15, type: "decrease" },
        { label: "Patch 2", value: -10, type: "decrease" },
        { label: "Nouv. vuln", value: 8, type: "increase" },
        { label: "Final", value: 63, type: "total" },
      ],
    },
    properties: [{ key: "title", type: "text", label: "Titre" }],
  },
  {
    type: "treemap", label: "Treemap", category: "graph", icon: "th-large",
    isContainer: false,
    defaultData: {
      title: "Surface d'attaque",
      items: [
        { label: "Web Apps", value: 45, color: "#e74c3c" },
        { label: "APIs", value: 30, color: "#e67e22" },
        { label: "Réseau", value: 20, color: "#5B8FD4" },
        { label: "Mobile", value: 15, color: "#9b59b6" },
        { label: "IoT", value: 8, color: "#1abc9c" },
      ],
    },
    properties: [{ key: "title", type: "text", label: "Titre" }],
  },
  {
    type: "sankey-diagram", label: "Sankey", category: "graph", icon: "random",
    isContainer: false,
    defaultData: {
      title: "Flux d'attaque",
      nodes: [
        { label: "Phishing", color: "#e74c3c" },
        { label: "Brute Force", color: "#e67e22" },
        { label: "Accès initial", color: "#5B8FD4" },
        { label: "Pivot", color: "#9b59b6" },
        { label: "Exfiltration", color: "#E8A855" },
      ],
      links: [
        { source: 0, target: 2, value: 40 },
        { source: 1, target: 2, value: 25 },
        { source: 2, target: 3, value: 50 },
        { source: 3, target: 4, value: 35 },
      ],
    },
    properties: [{ key: "title", type: "text", label: "Titre" }],
  },
  // Pentest — New blocks
  {
    type: "vulnerability-card", label: "Fiche vulnérabilité", category: "pentest", icon: "bug",
    isContainer: false,
    defaultData: {
      title: "SQL Injection", severity: "high", cvss: 8.6,
      vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:N/A:N",
      description: "Injection SQL détectée dans le formulaire de login.",
      remediation: "Utiliser des requêtes préparées.",
      references: [{ title: "OWASP SQLi", url: "https://owasp.org/www-community/attacks/SQL_Injection" }],
      tags: ["OWASP A03", "CWE-89"],
    },
    properties: [
      { key: "title", type: "text", label: "Titre" },
      { key: "severity", type: "select", label: "Sévérité", options: [
        { value: "critical", label: "Critique" }, { value: "high", label: "Élevé" },
        { value: "medium", label: "Moyen" }, { value: "low", label: "Faible" },
      ]},
      { key: "cvss", type: "number", label: "Score CVSS", min: 0, max: 10, step: 0.1 },
    ],
  },
  {
    type: "findings-summary", label: "Synthèse des trouvailles", category: "pentest", icon: "clipboard-list",
    isContainer: false,
    defaultData: {
      title: "Synthèse", critical: 3, high: 7, medium: 12, low: 5, info: 2, showPercentage: true,
    },
    properties: [
      { key: "title", type: "text", label: "Titre" },
      { key: "critical", type: "number", label: "Critique", min: 0 },
      { key: "high", type: "number", label: "Élevé", min: 0 },
      { key: "medium", type: "number", label: "Moyen", min: 0 },
      { key: "low", type: "number", label: "Faible", min: 0 },
      { key: "info", type: "number", label: "Info", min: 0 },
      { key: "showPercentage", type: "toggle", label: "Afficher %" },
    ],
  },
  {
    type: "scope-block", label: "Périmètre", category: "pentest", icon: "crosshairs",
    isContainer: false,
    defaultData: {
      title: "Périmètre du test",
      inScope: [{ target: "192.168.1.0/24", type: "network", description: "Réseau interne" }],
      outOfScope: [{ target: "10.0.0.0/8", type: "network", description: "Réseau partenaires" }],
      notes: "Fenêtre de test : 1-15 mars 2024",
    },
    properties: [{ key: "title", type: "text", label: "Titre" }],
  },
  {
    type: "recommendation", label: "Recommandation", category: "pentest", icon: "lightbulb",
    isContainer: false,
    defaultData: {
      title: "Implémenter le MFA", priority: "high", effort: 3, impact: 5,
      description: "Ajouter l'authentification multi-facteurs sur tous les comptes critiques.",
      businessValue: "Réduction de 80% des risques de compromission de comptes.",
      tools: [{ name: "Duo Security", type: "commercial", cost: "paid" }],
      timeline: "Q2 2024", owner: "Équipe Securité",
    },
    properties: [
      { key: "title", type: "text", label: "Titre" },
      { key: "priority", type: "select", label: "Priorité", options: [
        { value: "critical", label: "Critique" }, { value: "high", label: "Élevé" },
        { value: "medium", label: "Moyen" }, { value: "low", label: "Faible" },
      ]},
      { key: "effort", type: "range", label: "Effort", min: 1, max: 5, step: 1 },
      { key: "impact", type: "range", label: "Impact", min: 1, max: 5, step: 1 },
    ],
  },
  {
    type: "credentials-table", label: "Identifiants", category: "pentest", icon: "key",
    isContainer: false, hidden: true,
    defaultData: {
      title: "Identifiants découverts", showPasswords: false,
      credentials: [
        { username: "admin", password: "P@ssw0rd!", source: "Brute force", severity: "critical", type: "database", found: "2024-03-05", location: "MySQL 192.168.1.10" },
        { username: "backup", password: "backup123", source: "Config file", severity: "high", type: "ssh", found: "2024-03-06", location: "SSH 192.168.1.20" },
      ],
    },
    properties: [
      { key: "title", type: "text", label: "Titre" },
      { key: "showPasswords", type: "toggle", label: "Afficher les mots de passe" },
    ],
  },
  {
    type: "cve-table", label: "Table CVE", category: "pentest", icon: "shield-alt",
    isContainer: false, hidden: true,
    defaultData: {
      title: "CVE identifiées",
      cves: [
        { id: "CVE-2024-21762", description: "FortiOS RCE via SSL VPN", cvss: 9.8, severity: "critical", vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", affected: "FortiOS 7.2.x", remediationStatus: "fixed" },
        { id: "CVE-2023-44487", description: "HTTP/2 Rapid Reset DDoS", cvss: 7.5, severity: "high", vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H", affected: "nginx 1.24", remediationStatus: "in_progress" },
      ],
    },
    properties: [{ key: "title", type: "text", label: "Titre" }],
  },
  {
    type: "cvss-calculator", label: "Calculateur CVSS", category: "pentest", icon: "calculator",
    isContainer: false,
    defaultData: {
      title: "CVSS 3.1 — Score de base",
      AV: "N", AC: "L", PR: "N", UI: "N", S: "C", C: "H", I: "N", A: "N",
    },
    properties: [{ key: "title", type: "text", label: "Titre" }],
  },
  {
    type: "attack-timeline", label: "Kill Chain", category: "pentest", icon: "stream",
    isContainer: false,
    defaultData: {
      title: "Chronologie d'attaque",
      phases: [
        { id: "recon", label: "Reconnaissance", color: "#3498db", timestamp: "Jour 1", techniques: [
          { id: "T1595", name: "Active Scanning", status: "success" },
          { id: "T1592", name: "Gather Victim Host Info", status: "success" },
        ]},
        { id: "access", label: "Accès initial", color: "#e67e22", timestamp: "Jour 2", techniques: [
          { id: "T1190", name: "Exploit Public-Facing App", status: "success" },
        ]},
        { id: "privesc", label: "Élévation de privilèges", color: "#e74c3c", timestamp: "Jour 3", techniques: [
          { id: "T1068", name: "Exploitation for Privilege Escalation", status: "success" },
          { id: "T1548", name: "Abuse Elevation Control", status: "blocked" },
        ]},
      ],
    },
    properties: [{ key: "title", type: "text", label: "Titre" }],
  },
  {
    type: "attack-path", label: "Chemin d'attaque", category: "pentest", icon: "project-diagram",
    isContainer: false,
    defaultData: {
      title: "Chemin d'attaque principal",
      nodes: [
        { id: "1", label: "Attaquant", type: "entry", color: "#3498db" },
        { id: "2", label: "Firewall", type: "server", color: "#95a5a6" },
        { id: "3", label: "Web Server", type: "server", color: "#e67e22" },
        { id: "4", label: "App Server", type: "server", color: "#e74c3c" },
        { id: "5", label: "Database", type: "database", color: "#9b59b6" },
      ],
      edges: [
        { source: "1", target: "2", label: "Scan ports" },
        { source: "2", target: "3", label: "Port 443" },
        { source: "3", target: "4", label: "SQLi" },
        { source: "4", target: "5", label: "DB creds" },
      ],
    },
    properties: [{ key: "title", type: "text", label: "Titre" }],
  },
  {
    type: "privilege-escalation", label: "Escalade de privilèges", category: "pentest", icon: "level-up-alt",
    isContainer: false,
    defaultData: {
      title: "Chaîne d'escalade",
      chain: [
        { id: "1", level: 0, privilege: "Anonymous", description: "Accès web non authentifié", color: "#3498db", source: "Port 443 ouvert" },
        { id: "2", level: 1, privilege: "User (www-data)", description: "Exécution de code via SQLi", color: "#e67e22", source: "CVE-2024-21762" },
        { id: "3", level: 2, privilege: "Root", description: "Kernel exploit local", color: "#e74c3c", source: "CVE-2023-0386 (OverlayFS)" },
      ],
    },
    properties: [{ key: "title", type: "text", label: "Titre" }],
  },

  // ─── GRC ────────────────────────────────────────────────────────────
  {
    type: "ebios-feared-events", label: "Événements Redoutés", category: "grc", icon: "list-check",
    hidden: true,
    isContainer: false,
    defaultData: {
      title: "Événements Redoutés EBIOS",
      events: [
        { id: "EV001", essentialValue: "Données confidentielles clients", fearedEvent: "Vol de données confidentielles", severity: 4, impactType: "Confidentialité", source: "Groupe APT - État tiers" },
        { id: "EV002", essentialValue: "Disponibilité du service", fearedEvent: "Indisponibilité du service >4h", severity: 3, impactType: "Disponibilité", source: "Attaquant financier / Compétiteur" },
        { id: "EV003", essentialValue: "Intégrité des données", fearedEvent: "Modification malveillante des données", severity: 3, impactType: "Intégrité", source: "Malveillant interne" },
        { id: "EV004", essentialValue: "Infrastructure réseau", fearedEvent: "Compromission critique d'équipement", severity: 4, impactType: "Disponibilité + Confidentialité", source: "Groupe cybercriminel" },
      ],
    },
    properties: [
      { key: "title", type: "text", label: "Titre" },
    ],
  },
  {
    type: "ebios-scenarios", label: "Scénarios EBIOS", category: "grc", icon: "diagram-project",
    hidden: true,
    isContainer: false,
    defaultData: {
      title: "Scénarios de Risque EBIOS",
      scenarios: [
        { id: "SC001", name: "Compromission de l'accès administrateur", type: "operational", likelihood: 3, severity: 4, inherentRisk: "Élevé", treatment: "reduce", mitigations: ["Implémenter MFA sur tous les comptes admin", "Audit logs en temps réel", "Segmentation réseau"], owner: "CISO" },
        { id: "SC002", name: "Attaque DDoS massif", type: "strategic", likelihood: 2, severity: 3, inherentRisk: "Moyen", treatment: "accept", mitigations: ["Plan de continuité de service", "Contrat DDoS mitigation"], owner: "Responsable Infrastructure" },
        { id: "SC003", name: "Fuite de données via insider malveillant", type: "operational", likelihood: 2, severity: 4, inherentRisk: "Élevé", treatment: "reduce", mitigations: ["Monitoring DLP", "Séparation des environnements de travail", "Politique de moindres privilèges"], owner: "Responsable Sécurité" },
      ],
    },
    properties: [
      { key: "title", type: "text", label: "Titre" },
    ],
  },
  {
    type: "ebios-target", label: "Cible EBIOS RM", category: "grc", icon: "bullseye",
    isContainer: false,
    defaultData: {
      title: "Cible EBIOS RM",
      view: "both",
      niveaux: [
        { label: "1", couleur: "#27ae60" },
        { label: "2", couleur: "#f1c40f" },
        { label: "3", couleur: "#e67e22" },
        { label: "4", couleur: "#e74c3c" },
      ],
      sources: [
        { nom: "SR1", label: "Cybercriminel", couleur: "#e74c3c" },
        { nom: "SR2", label: "Concurrent", couleur: "#e67e22" },
        { nom: "SR3", label: "Hacktiviste", couleur: "#9b59b6" },
      ],
      objectifs: [
        { nom: "OV1", label: "Données clients", couleur: "#2980b9" },
        { nom: "OV2", label: "SI interne", couleur: "#27ae60" },
        { nom: "OV3", label: "Image de marque", couleur: "#f39c12" },
      ],
      couples: [
        { nom: "C1", source: "SR1", objectif: "OV1", pertinence: 4, retenu: true },
        { nom: "C2", source: "SR1", objectif: "OV2", pertinence: 3, retenu: true },
        { nom: "C3", source: "SR2", objectif: "OV1", pertinence: 2, retenu: false },
        { nom: "C4", source: "SR2", objectif: "OV3", pertinence: 3, retenu: true },
        { nom: "C5", source: "SR3", objectif: "OV3", pertinence: 1, retenu: false },
      ],
      apparence: {
        couleurRetenu: "#2980B9",
        couleurNonRetenu: "#95A5A6",
      },
    },
    properties: [
      { key: "title", type: "text", label: "Titre" },
    ],
  },
  {
    type: "compliance-checklist", label: "Checklist Conformité", category: "grc", icon: "clipboard-check",
    hidden: true,
    isContainer: false,
    defaultData: {
      title: "Checklist Conformité ISO 27001",
      framework: "iso-27001",
      sections: [
        { id: "A5", title: "Organisation : Contrôles d'organisation", controls: [
          { id: "A.5.1", description: "Politiques pour la sécurité de l'information", status: "compliant", notes: "Policies v2.1 approved by CODIR" },
          { id: "A.5.2", description: "Structure et responsabilités", status: "compliant", notes: "RACI matrix defined" },
          { id: "A.5.3", description: "Séparation des responsabilités", status: "partial", notes: "En cours de mise en œuvre" },
        ]},
        { id: "A8", title: "Actifs : Gestion des actifs", controls: [
          { id: "A.8.1", description: "Inventaire des actifs", status: "compliant", notes: "CMDB managed" },
          { id: "A.8.2", description: "Propriété des actifs", status: "non-compliant", notes: "À assigner pour legacy" },
        ]},
      ],
    },
    properties: [
      { key: "title", type: "text", label: "Titre" },
      { key: "framework", type: "select", label: "Framework", options: [
        { value: "", label: "Personnalisé" },
        { value: "iso-27001", label: "ISO 27001:2022" },
        { value: "nist-csf", label: "NIST CSF" },
        { value: "nis2", label: "NIS2 (EU)" },
        { value: "hds", label: "HDS (Santé FR)" },
        { value: "pci-dss", label: "PCI DSS v4.0" },
      ]},
    ],
  },
  {
    type: "gap-analysis", label: "Analyse d'écart", category: "grc", icon: "chart-bar",
    isContainer: false,
    defaultData: {
      title: "Analyse d'écart de maturité",
      framework: "nist-csf",
      domains: [
        { id: "D1", name: "Gouvernance de la sécurité", currentLevel: 2, targetLevel: 4, gap: 2, priority: "high", owner: "CISO" },
        { id: "D2", name: "Gestion des identités", currentLevel: 3, targetLevel: 4, gap: 1, priority: "medium", owner: "IAM Manager" },
        { id: "D3", name: "Sécurité des données", currentLevel: 2, targetLevel: 5, gap: 3, priority: "critical", owner: "DPO" },
        { id: "D4", name: "Sécurité réseau", currentLevel: 3, targetLevel: 4, gap: 1, priority: "medium", owner: "Infrastructure Manager" },
        { id: "D5", name: "Détection et réponse", currentLevel: 1, targetLevel: 4, gap: 3, priority: "critical", owner: "SOC Manager" },
      ],
    },
    properties: [
      { key: "title", type: "text", label: "Titre" },
      { key: "framework", type: "select", label: "Framework", options: [
        { value: "", label: "Personnalisé" },
        { value: "iso-27001", label: "ISO 27001:2022" },
        { value: "nist-csf", label: "NIST CSF" },
        { value: "nis2", label: "NIS2" },
      ]},
    ],
  },
  {
    type: "risk-register", label: "Registre des Risques", category: "grc", icon: "clipboard-list",
    hidden: true,
    isContainer: false,
    defaultData: {
      title: "Registre des Risques",
      risks: [
        { id: "RISK001", name: "Incident de sécurité majeur", category: "Cybersécurité", likelihood: 3, impact: 5, inherentRisk: 15, controls: ["MFA", "SIEM", "Audit logs"], residualRisk: 6, residualLevel: "Moyen", owner: "CISO", status: "active", treatmentPlan: "Déployer EDR d'ici Q3" },
        { id: "RISK002", name: "Indisponibilité de service", category: "Infrastructure", likelihood: 2, impact: 4, inherentRisk: 8, controls: ["Redondance", "DR plan", "Backup"], residualRisk: 3, residualLevel: "Faible", owner: "Infrastructure Manager", status: "mitigated", treatmentPlan: "RTO 1h assuré" },
        { id: "RISK003", name: "Non-conformité RGPD", category: "Conformité", likelihood: 2, impact: 4, inherentRisk: 8, controls: ["DPO", "Policy RGPD", "Consent"], residualRisk: 4, residualLevel: "Faible", owner: "DPO", status: "active", treatmentPlan: "Audit externalisé Q2" },
        { id: "RISK004", name: "Atteinte à la réputation", category: "Métier", likelihood: 1, impact: 5, inherentRisk: 5, controls: ["Crisis plan", "Support"], residualRisk: 5, residualLevel: "Moyen", owner: "Dir. Communication", status: "accepted", treatmentPlan: "Risque accepté par le board" },
      ],
    },
    properties: [
      { key: "title", type: "text", label: "Titre" },
    ],
  },
  {
    type: "maturity-radar", label: "Radar de Maturité", category: "grc", icon: "crosshairs",
    isContainer: false,
    defaultData: {
      title: "Radar de Maturité — Sécurité de l'Information",
      axes: [
        { label: "Gouvernance", current: 2, target: 4, max: 5 },
        { label: "Risques", current: 3, target: 4, max: 5 },
        { label: "Processus", current: 2, target: 4, max: 5 },
        { label: "Ressources", current: 3, target: 4, max: 5 },
        { label: "Technologie", current: 2, target: 4, max: 5 },
        { label: "Incidents", current: 1, target: 4, max: 5 },
        { label: "Conformité", current: 2, target: 4, max: 5 },
        { label: "Culture", current: 2, target: 4, max: 5 },
      ],
      currentColor: "#E8A855",
      targetColor: "#5B8FD4",
    },
    properties: [
      { key: "title", type: "text", label: "Titre" },
    ],
  },
  {
    type: "risk-appetite", label: "Appétit au Risque", category: "grc", icon: "balance-scale",
    isContainer: false,
    defaultData: {
      title: "Appétit au Risque Organisationnel",
      description: "Zones : Acceptable (vert) / Tolérable (jaune) / Inacceptable (rouge)",
      categories: [
        { id: "CAT1", name: "Cybersécurité", current: 35, appetite: 40, max: 100, status: "acceptable" },
        { id: "CAT2", name: "Conformité légale", current: 15, appetite: 20, max: 100, status: "acceptable" },
        { id: "CAT3", name: "Opérationnel", current: 55, appetite: 60, max: 100, status: "tolerable" },
        { id: "CAT4", name: "Financier", current: 72, appetite: 70, max: 100, status: "unacceptable" },
        { id: "CAT5", name: "Réputation", current: 20, appetite: 30, max: 100, status: "acceptable" },
      ],
    },
    properties: [
      { key: "title", type: "text", label: "Titre" },
      { key: "description", type: "textarea", label: "Description" },
    ],
  },
  {
    type: "action-plan", label: "Plan d'Action", category: "grc", icon: "tasks",
    hidden: true,
    isContainer: false,
    defaultData: {
      title: "Plan d'Action Sécurité 2024",
      actions: [
        { id: "ACT001", action: "Déployer MFA sur tous les accès admin", responsible: "Équipe IAM", deadline: "2024-06-30", priority: "critical", status: "in-progress", progress: 65, quarter: "Q2" },
        { id: "ACT002", action: "Mise en place SOC 24/7", responsible: "Responsable SOC", deadline: "2024-09-30", priority: "high", status: "in-progress", progress: 40, quarter: "Q3" },
        { id: "ACT003", action: "Audit extern ISO 27001", responsible: "CISO", deadline: "2024-04-30", priority: "high", status: "todo", progress: 0, quarter: "Q2" },
        { id: "ACT004", action: "Sensibilisation phishing", responsible: "Responsable Formation", deadline: "2024-05-31", priority: "medium", status: "done", progress: 100, quarter: "Q2" },
        { id: "ACT005", action: "Implémentation XDR", responsible: "Équipe Ops", deadline: "2024-12-31", priority: "high", status: "todo", progress: 0, quarter: "Q4" },
      ],
    },
    properties: [
      { key: "title", type: "text", label: "Titre" },
    ],
  },
  {
    type: "raci-matrix", label: "Matrice RACI", category: "grc", icon: "border-all",
    hidden: true,
    isContainer: false,
    defaultData: {
      title: "Matrice RACI — Processus de Sécurité",
      tasks: [
        { id: "T1", task: "Gestion des incidents critiques" },
        { id: "T2", task: "Approbation politique de sécurité" },
        { id: "T3", task: "Audit de sécurité interne" },
        { id: "T4", task: "Gestion des vulnérabilités" },
        { id: "T5", task: "Plan de continuité de service" },
      ],
      stakeholders: [
        { id: "S1", name: "CISO" },
        { id: "S2", name: "IT Manager" },
        { id: "S3", name: "Resp. Sécurité" },
        { id: "S4", name: "DPO" },
        { id: "S5", name: "Resp. Infrastructure" },
      ],
      assignments: [
        { task: "T1", stakeholder: "S1", role: "A" },
        { task: "T1", stakeholder: "S2", role: "R" },
        { task: "T1", stakeholder: "S3", role: "C" },
        { task: "T1", stakeholder: "S4", role: "I" },
        { task: "T2", stakeholder: "S1", role: "R" },
        { task: "T2", stakeholder: "S2", role: "C" },
        { task: "T2", stakeholder: "S5", role: "I" },
        { task: "T3", stakeholder: "S3", role: "A" },
        { task: "T3", stakeholder: "S1", role: "C" },
        { task: "T3", stakeholder: "S2", role: "R" },
        { task: "T4", stakeholder: "S3", role: "R" },
        { task: "T4", stakeholder: "S1", role: "A" },
        { task: "T4", stakeholder: "S5", role: "C" },
        { task: "T5", stakeholder: "S5", role: "A" },
        { task: "T5", stakeholder: "S1", role: "C" },
        { task: "T5", stakeholder: "S2", role: "R" },
      ],
    },
    properties: [
      { key: "title", type: "text", label: "Titre" },
    ],
  },
  {
    type: "control-matrix", label: "Matrice des Contrôles", category: "grc", icon: "shield-alt",
    hidden: true,
    isContainer: false,
    defaultData: {
      title: "Matrice d'Efficacité des Contrôles",
      controls: [
        { id: "C001", name: "Multi-Factor Authentication", type: "preventive", frequency: "Continu", effectiveness: 5 },
        { id: "C002", name: "Logs & Monitoring centralisé", type: "detective", frequency: "Temps réel", effectiveness: 4 },
        { id: "C003", name: "Patches & Update management", type: "preventive", frequency: "Mensuel", effectiveness: 4 },
        { id: "C004", name: "Incident response plan", type: "corrective", frequency: "À la demande", effectiveness: 3 },
        { id: "C005", name: "Segmentation réseau", type: "preventive", frequency: "Continu", effectiveness: 4 },
        { id: "C006", name: "Penetration Testing", type: "detective", frequency: "Trimestriel", effectiveness: 4 },
      ],
      threats: [
        { id: "TH1", name: "Compromission de compte" },
        { id: "TH2", name: "Exploitation vulnérabilité" },
        { id: "TH3", name: "Incident données" },
        { id: "TH4", name: "Indisponibilité" },
      ],
      coverage: [
        { control: "C001", threat: "TH1", effectiveness: 5 },
        { control: "C001", threat: "TH2", effectiveness: 1 },
        { control: "C001", threat: "TH3", effectiveness: 2 },
        { control: "C002", threat: "TH1", effectiveness: 4 },
        { control: "C002", threat: "TH3", effectiveness: 5 },
        { control: "C003", threat: "TH2", effectiveness: 4 },
        { control: "C003", threat: "TH4", effectiveness: 3 },
        { control: "C004", threat: "TH3", effectiveness: 3 },
        { control: "C005", threat: "TH1", effectiveness: 3 },
        { control: "C005", threat: "TH4", effectiveness: 4 },
        { control: "C006", threat: "TH2", effectiveness: 4 },
      ],
    },
    properties: [
      { key: "title", type: "text", label: "Titre" },
    ],
  },
  {
    type: "compliance-gauge", label: "Jauge de Conformité", category: "grc", icon: "tachometer-alt",
    isContainer: false,
    defaultData: {
      title: "Jauge de Conformité ISO 27001",
      overallCompliance: 72,
      domains: [
        { id: "D1", name: "Organisation", compliance: 85, controlsTotal: 5, controlsCompliant: 4 },
        { id: "D2", name: "Actifs", compliance: 60, controlsTotal: 4, controlsCompliant: 2 },
        { id: "D3", name: "Ressources", compliance: 75, controlsTotal: 4, controlsCompliant: 3 },
        { id: "D4", name: "Opérations", compliance: 68, controlsTotal: 8, controlsCompliant: 5 },
        { id: "D5", name: "Communications", compliance: 80, controlsTotal: 3, controlsCompliant: 2 },
        { id: "D6", name: "Relations", compliance: 65, controlsTotal: 4, controlsCompliant: 2 },
      ],
      lastAudit: "2024-01-15",
      nextAudit: "2024-07-15",
      trend: "improving",
    },
    properties: [
      { key: "title", type: "text", label: "Titre" },
      { key: "overallCompliance", type: "number", label: "Conformité %" },
    ],
  },

  // ===== NETWORK =====
  {
    type: "network-topology", label: "Topologie réseau", category: "network", icon: "network-wired",
    isContainer: false,
    defaultData: {
      title: "Topologie réseau",
      showLegend: true,
      devices: [
        { id: "d1", label: "Firewall", type: "firewall", ip: "10.0.0.1", col: 2, row: 0, zone: "z1" },
        { id: "d2", label: "Core Switch", type: "switch", ip: "10.0.0.2", col: 2, row: 2, zone: "z1" },
        { id: "d3", label: "Web Server", type: "server", ip: "10.0.1.10", col: 0, row: 4, zone: "z2" },
        { id: "d4", label: "DB Server", type: "database", ip: "10.0.2.10", col: 4, row: 4, zone: "z2" },
      ],
      flows: [
        { from: "d1", to: "d2", label: "trunk", bandwidth: 10 },
        { from: "d2", to: "d3", label: "HTTPS", bandwidth: 5 },
        { from: "d2", to: "d4", label: "SQL", bandwidth: 3 },
      ],
      zones: [
        { id: "z1", label: "DMZ", color: "#e67e22" },
        { id: "z2", label: "LAN Interne", color: "#3498db" },
      ],
    },
    properties: [
      { key: "title", type: "text", label: "Titre" },
    ],
  },
  {
    type: "port-scan-table", label: "Scan de ports", category: "network", icon: "search",
    hidden: true,
    isContainer: false,
    defaultData: {
      title: "Résultats Nmap",
      target: "192.168.1.1",
      scanDate: "2026-03-30",
      entries: [
        { port: 22, protocol: "tcp", state: "open", service: "ssh", version: "OpenSSH 8.9", info: "" },
        { port: 80, protocol: "tcp", state: "open", service: "http", version: "nginx 1.24", info: "" },
        { port: 443, protocol: "tcp", state: "open", service: "https", version: "nginx 1.24", info: "" },
        { port: 3306, protocol: "tcp", state: "filtered", service: "mysql", version: "", info: "Firewall" },
      ],
    },
    properties: [
      { key: "title", type: "text", label: "Titre" },
      { key: "target", type: "text", label: "Cible" },
    ],
  },
  {
    type: "firewall-rules", label: "Règles firewall", category: "network", icon: "shield-alt",
    hidden: true,
    isContainer: false,
    defaultData: {
      title: "Règles firewall",
      rules: [
        { source: "any", destination: "10.0.1.10", port: "443", protocol: "tcp", action: "allow", description: "HTTPS vers Web" },
        { source: "10.0.1.0/24", destination: "10.0.2.10", port: "3306", protocol: "tcp", action: "allow", description: "SQL interne" },
        { source: "any", destination: "any", port: "*", protocol: "any", action: "deny", description: "Deny all" },
      ],
    },
    properties: [
      { key: "title", type: "text", label: "Titre" },
    ],
  },
  {
    type: "vlan-diagram", label: "Diagramme VLAN", category: "network", icon: "layer-group",
    isContainer: false,
    defaultData: {
      title: "Segmentation VLAN",
      vlans: [
        { id: 10, name: "Management", subnet: "10.0.10.0/24", color: "#3498db", machines: [{ name: "SW-MGMT", ip: "10.0.10.1" }] },
        { id: 20, name: "Serveurs", subnet: "10.0.20.0/24", color: "#27ae60", machines: [{ name: "WEB-01", ip: "10.0.20.10" }, { name: "DB-01", ip: "10.0.20.20" }] },
        { id: 30, name: "Utilisateurs", subnet: "10.0.30.0/24", color: "#e67e22", machines: [{ name: "PC-001", ip: "10.0.30.100" }] },
      ],
      connections: [
        { from: 10, to: 20, label: "trunk" },
        { from: 10, to: 30, label: "ACL" },
      ],
    },
    properties: [
      { key: "title", type: "text", label: "Titre" },
    ],
  },
  {
    type: "network-flow", label: "Flux réseau", category: "network", icon: "random",
    isContainer: false,
    defaultData: {
      title: "Flux réseau",
      nodes: [
        { label: "Internet", color: "#e74c3c", sublabel: "WAN" },
        { label: "Firewall", color: "#e67e22", sublabel: "10.0.0.1" },
        { label: "Web Server", color: "#3498db", sublabel: "10.0.1.10" },
        { label: "DB Server", color: "#9b59b6", sublabel: "10.0.2.10" },
      ],
      links: [
        { source: 0, target: 1, value: 1000, protocol: "HTTPS" },
        { source: 1, target: 2, value: 800, protocol: "HTTP" },
        { source: 1, target: 3, value: 200, protocol: "SQL" },
      ],
    },
    properties: [
      { key: "title", type: "text", label: "Titre" },
    ],
  },
  {
    type: "architecture-diagram", label: "Architecture", category: "network", icon: "project-diagram",
    isContainer: false,
    defaultData: {
      title: "Architecture système",
      nodes: [
        { id: "n1", label: "Load Balancer", shape: "box", color: "#e67e22" },
        { id: "n2", label: "App Server", shape: "box", color: "#3498db" },
        { id: "n3", label: "Database", shape: "database", color: "#9b59b6" },
        { id: "n4", label: "Cache", shape: "box", color: "#27ae60" },
      ],
      connections: [
        { from: "n1", to: "n2", label: "HTTP" },
        { from: "n2", to: "n3", label: "SQL" },
        { from: "n2", to: "n4", label: "Redis" },
      ],
    },
    properties: [
      { key: "title", type: "text", label: "Titre" },
    ],
  },
  {
    type: "server-inventory", label: "Inventaire serveurs", category: "network", icon: "server",
    hidden: true,
    isContainer: false,
    defaultData: {
      title: "Inventaire des serveurs",
      servers: [
        { hostname: "web-01", ip: "10.0.1.10", os: "Ubuntu 22.04", role: "Web", patchLevel: "2026-03", status: "online" },
        { hostname: "db-01", ip: "10.0.2.10", os: "Debian 12", role: "Database", patchLevel: "2026-02", status: "online" },
        { hostname: "backup-01", ip: "10.0.3.10", os: "CentOS 9", role: "Backup", patchLevel: "2025-12", status: "maintenance" },
      ],
    },
    properties: [
      { key: "title", type: "text", label: "Titre" },
    ],
  },
  {
    type: "dns-records", label: "Enregistrements DNS", category: "network", icon: "globe",
    hidden: true,
    isContainer: false,
    defaultData: {
      title: "Enregistrements DNS",
      domain: "example.com",
      records: [
        { type: "A", name: "@", value: "93.184.216.34", ttl: "3600" },
        { type: "AAAA", name: "@", value: "2606:2800:220:1:248:1893:25c8:1946", ttl: "3600" },
        { type: "MX", name: "@", value: "mail.example.com", ttl: "3600", priority: "10" },
        { type: "CNAME", name: "www", value: "example.com", ttl: "3600" },
        { type: "TXT", name: "@", value: "v=spf1 include:_spf.google.com ~all", ttl: "3600" },
      ],
    },
    properties: [
      { key: "title", type: "text", label: "Titre" },
      { key: "domain", type: "text", label: "Domaine" },
    ],
  },
  {
    type: "certificate-info", label: "Certificat TLS", category: "network", icon: "lock",
    isContainer: false,
    defaultData: {
      title: "Certificat TLS",
      subject: "*.example.com",
      issuer: "Let's Encrypt Authority X3",
      validFrom: "2026-01-15",
      validTo: "2026-04-15",
      algorithm: "RSA-SHA256",
      keySize: "2048",
      san: ["example.com", "*.example.com"],
      chainValid: true,
      serialNumber: "03:AB:CD:EF:12:34:56:78",
      fingerprint: "A1:B2:C3:D4:E5:F6:78:90:AB:CD:EF:12:34:56:78:9A:BC:DE:F0:12",
    },
    properties: [
      { key: "title", type: "text", label: "Titre" },
      { key: "subject", type: "text", label: "Sujet" },
    ],
  },
  {
    type: "subnet-map", label: "Carte sous-réseau", category: "network", icon: "th",
    isContainer: false,
    defaultData: {
      title: "Carte sous-réseau",
      subnet: "192.168.1.0/24",
      mask: "255.255.255.0",
      columns: 16,
      addresses: [
        { ip: "192.168.1.1", hostname: "gateway", status: "gateway" },
        { ip: "192.168.1.10", hostname: "web-01", status: "used" },
        { ip: "192.168.1.11", hostname: "db-01", status: "used" },
        { ip: "192.168.1.50", hostname: "", status: "reserved" },
        { ip: "192.168.1.100", hostname: "", status: "free" },
        { ip: "192.168.1.255", hostname: "broadcast", status: "broadcast" },
      ],
    },
    properties: [
      { key: "title", type: "text", label: "Titre" },
      { key: "subnet", type: "text", label: "Sous-réseau" },
      { key: "columns", type: "number", label: "Colonnes" },
    ],
  },
  {
    type: "cloud-architecture", label: "Architecture cloud", category: "network", icon: "cloud",
    isContainer: false,
    defaultData: {
      title: "Architecture cloud",
      provider: "AWS",
      region: "eu-west-1",
      services: [
        { id: "s1", label: "ALB", type: "loadbalancer", sublabel: "Public" },
        { id: "s2", label: "EC2", type: "compute", sublabel: "t3.medium" },
        { id: "s3", label: "RDS", type: "database", sublabel: "PostgreSQL" },
        { id: "s4", label: "S3", type: "storage", sublabel: "Bucket" },
      ],
      connections: [
        { from: "s1", to: "s2", label: "HTTPS" },
        { from: "s2", to: "s3", label: "SQL" },
        { from: "s2", to: "s4", label: "API" },
      ],
      zones: [
        { label: "VPC", color: "#3498db" },
      ],
    },
    properties: [
      { key: "title", type: "text", label: "Titre" },
      { key: "provider", type: "text", label: "Fournisseur" },
    ],
  },
  {
    type: "wireless-survey", label: "Audit Wi-Fi", category: "network", icon: "wifi",
    hidden: true,
    isContainer: false,
    defaultData: {
      title: "Audit Wi-Fi",
      location: "Bureau 3ème étage",
      date: "2026-03-30",
      networks: [
        { ssid: "Corp-Secure", bssid: "AA:BB:CC:DD:EE:01", channel: 6, signal: -42, encryption: "WPA2-Enterprise", notes: "Réseau principal" },
        { ssid: "Guest", bssid: "AA:BB:CC:DD:EE:02", channel: 11, signal: -55, encryption: "WPA2", notes: "Réseau invités" },
        { ssid: "IoT-Devices", bssid: "AA:BB:CC:DD:EE:03", channel: 1, signal: -68, encryption: "WPA", notes: "Non segmenté!" },
      ],
    },
    properties: [
      { key: "title", type: "text", label: "Titre" },
      { key: "location", type: "text", label: "Emplacement" },
    ],
  },
];

export const categories = [
  "content", "layout", "media",
  "pentest", "network", "grc", "hardware", "osint", "graph", "forensics", "social-engineering",
];

export const categoryLabels = {
  content: "Contenu",
  layout: "Mise en page",
  media: "Médias",
  pentest: "Pentest",
  network: "Réseau",
  grc: "GRC",
  hardware: "Hardware",
  osint: "OSINT",
  graph: "Graphiques",
  forensics: "Forensics",
  "social-engineering": "Social Engineering",
};

export const getBlockType = (typeId) =>
  blockRegistry.find((b) => b.type === typeId);

export const getBlocksByCategory = (category) =>
  blockRegistry.filter((b) => b.category === category);
