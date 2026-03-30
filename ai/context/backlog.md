# Backlog

> Catalogue complet des 100 modules : voir [module-catalogue.md](module-catalogue.md)

## À faire

### P0 — Blocs déjà implémentés ✅
- [x] `section-title`, `text`, `code`, `table`, `callout` (content)
- [x] `separator`, `spacer`, `horizontal-div`, `drawer` (layout)
- [x] `image` (media)
- [x] `score-gauge`, `risk-matrix`, `risk-assessment` (pentest)

### P1 — Pentest (10 blocs) ✅
- [x] `vulnerability-card` — Fiche vulnérabilité complète
- [x] `cve-table` — Tableau CVE avec CVSS coloré
- [x] `cvss-calculator` — Vecteur CVSS 3.1 gauge circulaire
- [x] `attack-timeline` — Kill chain MITRE ATT&CK
- [x] `scope-block` — Périmètre d'audit structuré
- [x] `findings-summary` — Synthèse trouvailles (barres)
- [x] `recommendation` — Bloc recommandation structuré
- [x] `attack-path` — Graphe chemin d'attaque
- [x] `credentials-table` — Identifiants trouvés
- [x] `privilege-escalation` — Diagramme escalade

### P1 — Graph (14 blocs) ✅
- [x] `line-chart` — Graphique en lignes
- [x] `bar-chart` — Diagramme en barres
- [x] `pie-chart` — Camembert / Donut
- [x] `radar-chart` — Toile d'araignée
- [x] `scatter-plot` — Nuage de points
- [x] `heatmap` — Carte de chaleur
- [x] `stacked-bar` — Barres empilées
- [x] `area-chart` — Graphique en aires
- [x] `treemap` — Treemap
- [x] `gauge-chart` — Jauge circulaire
- [x] `sankey-diagram` — Diagramme Sankey
- [x] `sparkline` — Mini graphique inline
- [x] `waterfall-chart` — Cascade
- [x] `funnel-chart` — Entonnoir

### P1 — GRC (12 blocs) ✅
- [x] `ebios-feared-events` — Événements redoutés EBIOS
- [x] `ebios-scenarios` — Scénarios EBIOS RM
- [x] `ebios-target` — Cible de sécurité EBIOS
- [x] `compliance-checklist` — Checklist conformité
- [x] `gap-analysis` — Analyse d'écart
- [x] `risk-register` — Registre de risques
- [x] `maturity-radar` — Radar de maturité
- [x] `action-plan` — Plan d'action / roadmap
- [x] `raci-matrix` — Matrice RACI
- [x] `risk-appetite` — Appétit au risque
- [x] `control-matrix` — Matrice des contrôles
- [x] `compliance-gauge` — Jauge de conformité

### P2 — Network (12 blocs) ✅
- [x] `network-topology` — Schéma réseau isométrique
- [x] `port-scan-table` — Résultats nmap stylisés (→ Universal Table)
- [x] `firewall-rules` — Tableau règles firewall (→ Universal Table)
- [x] `vlan-diagram` — Diagramme VLAN
- [x] `network-flow` — Flux réseau Sankey
- [x] `architecture-diagram` — Schéma d'architecture
- [x] `server-inventory` — Inventaire serveurs (→ Universal Table)
- [x] `dns-records` — Enregistrements DNS (→ Universal Table)
- [x] `certificate-info` — Fiche certificat TLS
- [x] `subnet-map` — Carte sous-réseau
- [x] `cloud-architecture` — Architecture cloud
- [x] `wireless-survey` — Audit Wi-Fi (→ Universal Table)

### P2 — OSINT (13 blocs)
- [ ] `port-scan-visual` — Scan ports visuel
- [ ] `relationship-graph` — Graphe de liens araignée
- [ ] `geo-map` — Carte géographique avec pins
- [ ] `domain-info` — Fiche domaine
- [ ] `whois-card` — Fiche WHOIS
- [ ] `ip-geolocation` — Géolocation IP
- [ ] `email-header-analysis` — Analyse en-têtes email
- [ ] `social-profile` — Profil réseau social
- [ ] `metadata-viewer` — Métadonnées fichier
- [ ] `timeline` — Frise chronologique
- [ ] `subdomain-tree` — Arborescence sous-domaines
- [ ] `data-breach-card` — Fiche data breach
- [ ] `screenshot-annotated` — Capture annotée

### P2 — Forensics (10 blocs)
- [ ] `disk-image-map` — Carte de disque
- [ ] `file-timeline` — Timeline fichiers
- [ ] `registry-viewer` — Registre Windows
- [ ] `process-tree` — Arborescence processus
- [ ] `log-viewer` — Visualiseur de logs
- [ ] `ioc-table` — Tableau IOC
- [ ] `chain-of-custody` — Chaîne de traçabilité
- [ ] `hex-viewer` — Affichage hexadécimal
- [ ] `malware-summary` — Fiche malware
- [ ] `event-correlation` — Corrélation événements

### P2 — Hardware (10 blocs)
- [ ] `circuit-diagram` — Schéma circuit SVG
- [ ] `pin-diagram` — Diagramme brochage
- [ ] `signal-waveform` — Oscillogramme
- [ ] `hardware-block-diagram` — Architecture HW
- [ ] `photo-annotation` — Photo annotée
- [ ] `component-card` — Fiche composant
- [ ] `memory-map` — Carte mémoire
- [ ] `bus-protocol` — Protocole bus
- [ ] `firmware-diff` — Diff firmware
- [ ] `physical-access-plan` — Plan d'accès physique

### P3 — Social Engineering (6 blocs)
- [ ] `phishing-stats` — Stats campagne phishing
- [ ] `email-template` — Template email phishing
- [ ] `awareness-score` — Score sensibilisation
- [ ] `pretext-scenario` — Scénario prétexte
- [ ] `badge-cloning` — Clonage badge
- [ ] `vishing-log` — Journal vishing

### P1 — Export
- [ ] Export HTML fidèle au rendu (dual rendering: SVG inline / base64)
- [ ] Export JSON (import/export complet)

### P2 — Export Typst / PDF
- [ ] Rendu Typst serveur-side
- [ ] Conversion Typst → PDF

### P3 — Mobile
- [ ] Consultation responsive
- [ ] Annotation rapide sur bloc
- [ ] Partage HTML/PDF

## Améliorations techniques (non bloquantes)
- [ ] **RichText XSS** — Ajouter DOMPurify pour sanitiser le HTML dans RichText.jsx (CRITIQUE, affecte tout l'éditeur)
- [ ] Centraliser les styles boutons (duplication hover patterns)
- [ ] Constante pour la version JSON ("1.0")
- [ ] Self-host les fonts (Fraunces + DM Mono)
- [ ] Undo/Redo avec history stack dans le store
- [ ] DnD dans le tree drawer (réordonnancement depuis l'arborescence)
- [ ] DragOverlay visuel pendant le drag
- [x] Supprimer les 14 anciens fichiers Block/Modal spécialisés (table) devenus dead code

## Sprints planifiés

### Sprint FossFLOW Isometric (ISO-001..006)
- [ ] ISO-001 @architect — Spec d'intégration fossflow-lib
- [ ] ISO-002 @frontend — Composant IsometricDiagramBlock (React wrapper)
- [ ] ISO-003 @frontend — IsometricDiagramModal (éditeur interactif)
- [ ] ISO-004 @frontend — Export PNG via canvas.toDataURL pour HTML/PDF
- [ ] ISO-005 @frontend — Wiring (registry, blocks, modals, EditorModal)
- [ ] ISO-006 @security — Audit sécurité
- Remplace 4 blocs : network-topology, architecture-diagram, cloud-architecture, vlan-diagram
- Supprimer network-flow (doublon de sankey-diagram)

## Idées / À explorer
- [ ] Thème sombre pour l'éditeur
- [ ] Templates de rapports pré-remplis
- [ ] Raccourcis clavier (Ctrl+Z, Ctrl+S, Suppr, etc.)
