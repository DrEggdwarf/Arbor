# Sprint Log

<!-- Format :
## Sprint YYYY-MM-DD — Nom de la feature
- **Tickets** : X exécutés
- **Agents utilisés** : @backend (sonnet), @frontend (haiku), ...
- **Fichiers modifiés** : [liste]
- **Décisions prises** : [résumé]
- **Statut** : Terminé / En cours
-->

## Sprint 2026-03-11 — Boilerplate initial
- **Tickets** : Setup Rails + Inertia + React + Vite + Multi-agents IA
- **Agents utilisés** : aucun (setup manuel)
- **Fichiers créés** :
  - app/controllers/home_controller.rb
  - app/frontend/entrypoints/application.jsx
  - app/frontend/pages/Home.jsx
  - config/vite.json, vite.config.ts, package.json
  - ai/agents/*.yml (8 agents), ai/workflows/*.yml (2 workflows)
  - CLAUDE.md (framework Manager 5 phases)
- **Bugs résolus** :
  - `vite_javascript_tag "application"` génère `.js` mais fichier est `.jsx` → utiliser `"application.jsx"`
  - `@vitejs/plugin-react` nécessite `vite_react_refresh_tag` dans le layout avant le JS
- **Statut** : Boilerplate fonctionnel

## Sprint 2026-03-27 — Base solide éditeur Arbor
- **Tickets** : 8 exécutés (ARBOR-001 à ARBOR-008)
- **Agents utilisés** : @architect (sonnet), @database (sonnet), @backend (sonnet), @frontend (sonnet), @security (review), @quality (review)
- **Fichiers créés** :
  - `app/models/report.rb`
  - `app/controllers/reports_controller.rb`
  - `app/frontend/stores/editorStore.js` (Zustand + Immer)
  - `app/frontend/stores/blockRegistry.js`
  - `app/frontend/pages/Editor.jsx`
  - `app/frontend/hooks/useAutosave.js`
  - `app/frontend/components/Editor/Topbar.jsx`
  - `app/frontend/components/Editor/ComponentDrawer.jsx`
  - `app/frontend/components/Editor/TreeDrawer.jsx`
  - `app/frontend/components/Editor/Canvas.jsx`
  - `app/frontend/components/Editor/BlockWrapper.jsx`
  - `app/frontend/components/Editor/BlockToolbar.jsx`
  - `app/frontend/components/Editor/SortableBlock.jsx`
  - `app/frontend/components/Editor/PropertiesPanel.jsx`
  - `app/frontend/styles/editor.css`
  - `db/migrate/20260327210401_create_reports.rb`
- **Fichiers modifiés** :
  - `app/frontend/pages/Home.jsx` (refonte → liste rapports)
  - `app/frontend/styles/tokens.js` (palette Arbor)
  - `app/frontend/styles/globals.css` (charte Arbor)
  - `ai/context/design-system.md` (mis à jour)
  - `config/routes.rb` (CRUD reports)
  - `config/locales/fr.yml`, `config/locales/en.yml` (clés reports + editor)
  - `app/controllers/application_controller.rb` (APP_LOCALE_KEYS)
  - `package.json` (+ dnd-kit, zustand, immer, uuid)
- **Décisions prises** :
  - Zustand + Immer pour le state (ADR-004)
  - @dnd-kit pour le drag & drop (ADR-005)
  - Mono-utilisateur sans auth (ADR-006)
  - JSON content en DB (ADR-007)
  - Fraunces + DM Mono (ADR-008)
  - Double drawer composants + arborescence (ADR-009)
- **Review** : 1 FAIL corrigé (permit! → parsing sécurisé), validation accent_color ajoutée
- **Statut** : Terminé — base solide prête pour ajout des blocs un par un

## Sprint 2026-03-28a — Catégories, tooltips & modules Graph
- **Tickets** : 18 exécutés
- **Agents utilisés** : @frontend (sonnet — direct, pas de sub-agents)
- **Fichiers créés** :
  - `app/frontend/components/Editor/blockPreviews.jsx` — 100 SVG preview thumbnails
  - `ai/context/module-catalogue.md` — Catalogue complet des 100 modules
  - `app/frontend/components/Editor/blocks/BarChartBlock.jsx`
  - `app/frontend/components/Editor/blocks/LineChartBlock.jsx`
  - `app/frontend/components/Editor/blocks/PieChartBlock.jsx`
  - `app/frontend/components/Editor/blocks/GaugeChartBlock.jsx`
  - `app/frontend/components/Editor/blocks/RadarChartBlock.jsx`
  - `app/frontend/components/Editor/blocks/HeatmapBlock.jsx`
  - `app/frontend/components/Editor/blocks/StackedBarBlock.jsx`
  - `app/frontend/components/Editor/blocks/AreaChartBlock.jsx`
  - `app/frontend/components/Editor/blocks/ScatterPlotBlock.jsx`
  - `app/frontend/components/Editor/blocks/SparklineBlock.jsx`
  - `app/frontend/components/Editor/blocks/FunnelChartBlock.jsx`
  - `app/frontend/components/Editor/blocks/WaterfallChartBlock.jsx`
  - `app/frontend/components/Editor/blocks/TreemapBlock.jsx`
  - `app/frontend/components/Editor/blocks/SankeyDiagramBlock.jsx`
- **Fichiers modifiés** :
  - `app/frontend/stores/blockRegistry.js` — 11 catégories + categoryLabels + 14 graph entries
  - `app/frontend/components/Editor/blocks/index.js` — imports + renderers pour 14 graph blocks
  - `app/frontend/lib/icons.js` — 12 nouvelles icônes FA (chart-line, chart-pie, etc.)
  - `app/frontend/components/Editor/EditorModal.jsx` — 13 éditeurs modaux graph + MODAL_TYPES
  - `app/frontend/components/Editor/PropertiesPanel.jsx` — "Ouvrir l'éditeur" pour tous graphs
  - `app/frontend/components/Editor/ComponentDrawer.jsx` — catégories dynamiques + tooltips createPortal
  - `db/seeds.rb` — 13 blocs démo graph (b_demo_048→060)
  - `ai/context/decisions.md` — ADR-010, ADR-011
  - `ai/context/backlog.md` — réorganisé par catégorie/priorité
- **Décisions prises** :
  - 11 catégories de blocs (ADR-010)
  - Dual rendering export pour libs (ADR-011)
  - SVG pur pour tous les charts (pas de lib externe)
- **Problèmes identifiés** :
  - EditorModal.jsx → 1281 lignes (à refactorer — sprint suivant)
  - PALETTE/formatValue/niceScale dupliqués 4-11 fois entre chart blocks
  - Framework agile non respecté (pas de sub-agents, pas de phase 4 review)
- **Statut** : Terminé (fonctionnel) — refactoring qualité en sprint suivant

## Sprint 2026-03-28b — Remise en qualité & refactoring
- **Tickets** : 5 planifiés (QUAL-001, ARCH-001, REFAC-001, DOC-001, REVIEW-001)
- **Agents utilisés** : @quality (sonnet), @architect (sonnet), @frontend (sonnet), @pm (haiku)
- **Phase** : En cours
- **Objectif** : Corriger la dette technique du sprint 28a
  - Extraire EditorModal.jsx → dossier modals/ (1 fichier par éditeur)
  - Centraliser PALETTE/formatValue/niceScale dans chartUtils.js
  - Mettre à jour blocks pour importer depuis chartUtils
  - Mettre à jour sprint_log, backlog, decisions
- **Statut** : En cours

## Sprint 2026-03-29 — Pentest Blocks (10 blocs spécialisés)
- **Tickets** : 10 (PENT-001 à PENT-010) — tous complétés
- **Agents utilisés** : @pm (spec), @architect (plan), @frontend (sonnet), @security (audit)
- **Blocs créés** (10 renderers + 9 modals) :
  - `vulnerability-card` — Fiche vulnérabilité expandable avec sévérité, CVSS, remédiation, tags
  - `findings-summary` — Synthèse visuelle avec barre empilée et pourcentages
  - `scope-block` — Périmètre in/out scope avec tables et badges type
  - `recommendation` — Recommandation structurée avec priorité, effort/impact dots, outils
  - `credentials-table` — Table d'identifiants avec masquage mot de passe, badges sévérité
  - `cve-table` — Table CVE avec scores colorés, statut remédiation
  - `cvss-calculator` — Calculateur CVSS 3.1 interactif avec half-gauge SVG (algorithme complet)
  - `attack-timeline` — Kill chain MITRE ATT&CK avec phases, techniques, statuts
  - `attack-path` — Graphe dirigé avec nœuds typés et arêtes (layout BFS auto)
  - `privilege-escalation` — Chaîne verticale d'escalade avec niveaux colorés
- **Modals créés** (9 éditeurs visuels dans modals/) :
  - VulnerabilityCardModal, ScopeBlockModal, RecommendationModal,
  - CredentialsTableModal, CVETableModal, CVSSCalculatorModal,
  - AttackTimelineModal, AttackPathModal, PrivilegeEscalationModal
- **Export fix** : `buildHtmlPreview()` dans ExportModal.jsx complété pour ALL block types
  (score-gauge, risk-matrix, risk-assessment, 14 graph blocks, 10 pentest blocks)
- **Seeds** : 12 blocs pentest demo ajoutés au rapport ZeroLab (findings-summary, 2x vuln-card,
  scope-block, cve-table, cvss-calculator, credentials-table, attack-timeline, attack-path,
  privilege-escalation, 2x recommendation)
- **Sécurité** : audit OK — esc() sur tous les HTML exports, CVSS 3.1 vérifié conforme spec,
  pas de XSS ni dangerouslySetInnerHTML
- **Fichiers modifiés** : blockRegistry.js, blocks/index.js, modals/index.js, EditorModal.jsx,
  ExportModal.jsx, seeds.rb
- **Statut** : Terminé

## Sprint 2026-03-29b — Bugfix post-Pentest
- **Tickets** : 4 correctifs
- **Agents utilisés** : @frontend (direct)
- **Corrections** :
  1. **Cards drawer mal alignées** — Ajout `minHeight: 62`, `display: flex`, `alignItems: stretch` dans ComponentDrawer.jsx
  2. **Pentest blocks non éditables** — 9 types pentest manquants dans le hardcoded list de PropertiesPanel.jsx (ligne 389)
  3. **Card wrapper ne s'étire pas** — Ajout `display: "flex"` + `flex: 1` sur le wrapper dans ComponentDrawer.jsx
  4. **AttackPathBlock rendu cassé** — Lignes passant à travers les nœuds, labels superposés → Refonte complète du rendu SVG :
     - Fonction `nodeRadius()` pour calculer la distance centre→bord selon la forme
     - Composant `Edge` dédié : lignes raccourcies aux bordures des nœuds, labels avec fond, décalage perpendiculaire
     - Espacement augmenté (`*100`/`*180` au lieu de `*80`/`*160`)
     - Markers individuels par edge + opacité 0.6
- **Fichiers modifiés** :
  - `app/frontend/components/Editor/ComponentDrawer.jsx`
  - `app/frontend/components/Editor/PropertiesPanel.jsx`
  - `app/frontend/components/Editor/blocks/AttackPathBlock.jsx`
- **Statut** : Terminé

## Sprint 2026-03-28c — GRC Blocks (12 blocs Gouvernance, Risques, Conformité)
- **Tickets** : 10 (GRC-001 à GRC-010) — tous complétés
- **Agents utilisés** : @pm (spec), @architect (plan), @frontend (sonnet ×3 batches), @security (audit)
- **Blocs créés** (12 renderers + 12 modals) :
  - `ebios-feared-events` — Table événements redoutés EBIOS RM (Workshop 1)
  - `ebios-scenarios` — Scénarios stratégiques/opérationnels EBIOS RM (Workshops 3-4)
  - `ebios-target` — Diagramme cible de sécurité EBIOS (SVG, auto-layout radial)
  - `compliance-checklist` — Checklist conformité avec presets frameworks (ISO 27001, NIST, NIS2, HDS, PCI DSS)
  - `gap-analysis` — Analyse d'écart maturité avec barres SVG current vs target
  - `risk-register` — Registre complet des risques (L×I scoring, statuts, contrôles)
  - `maturity-radar` — Radar de maturité SVG (spider chart, current + target polygones)
  - `risk-appetite` — Jauges horizontales appétit au risque (seuil dashed line)
  - `action-plan` — Plan d'action avec priorité/statut/progress bars
  - `raci-matrix` — Matrice RACI interactive (R/A/C/I cercles colorés)
  - `control-matrix` — Heatmap efficacité contrôles vs menaces
  - `compliance-gauge` — Jauge donut SVG conformité % avec breakdown domaines
- **Modals créés** (12 éditeurs dans modals/) :
  - EbiosFearedEventsModal, EbiosScenariosModal, EbiosTargetModal, ComplianceChecklistModal,
  - GapAnalysisModal, RiskRegisterModal, MaturityRadarModal, RiskAppetiteModal,
  - ActionPlanModal, RaciMatrixModal, ControlMatrixModal, ComplianceGaugeModal
- **Wiring** : blockRegistry.js (12 entrées), blocks/index.js, modals/index.js, EditorModal.jsx, PropertiesPanel.jsx
- **Export** : buildHtmlPreview() complété pour 12 blocs GRC (esc() sur toutes les données)
- **Seeds** : Rapport "GRC — Demo" avec 16 blocs (tous types GRC) ajouté
- **Sécurité** : audit OK — pas de dangerouslySetInnerHTML, esc() partout, pas de XSS
- **Statut** : Terminé

## Sprint 2026-03-30 — Report Templates, Bugfixes & Polish
- **Tickets** : 6 correctifs + 3 templates
- **Agents utilisés** : @frontend (direct)
- **Corrections** :
  1. **GRC report wrong type** — seeds.rb: `report_type: :pentest` → `:grc`
  2. **report_type not in autosave** — useAutosave.js: ajout `report_type` au payload PATCH
  3. **report_type change delayed** — PropertiesPanel.jsx: ajout fetch PATCH immédiat
  4. **GRC tooltip previews generic** — 8 custom SVG previews créés dans blockPreviews.jsx
  5. **Gauge alignment** — ComplianceGaugeBlock/RiskAppetiteBlock: responsive width + maxWidth
  6. **EbiosTargetBlock redesign** — Réécriture complète: CibleSVG secteurs, niveaux concentriques, légende intégrée
- **Templates seed ajoutés** (3 nouveaux rapports) :
  - "Pentest Web — MediPortal" (pentest, ~25 blocs) — SQLi, IDOR, XSS, attack-path, kill-chain
  - "Audit Infra — DataForge" (infra, ~21 blocs) — réseau, firewalls, credentials, sankey, heatmap
  - "Dashboard Sécurité — Q1 2026" (audit, ~18 blocs) — 14 types graph, KPIs, SOC alerts
- **Fichiers modifiés** :
  - db/seeds.rb, useAutosave.js, PropertiesPanel.jsx, blockPreviews.jsx
  - EbiosTargetBlock.jsx, ComplianceGaugeBlock.jsx, RiskAppetiteBlock.jsx
  - EbiosTargetModal.jsx, ExportModal.jsx, blockRegistry.js
- **Statut** : Terminé

## Sprint 2026-04-01 — Blocs Network (12 blocs)
- **Tickets** : 10 exécutés (NET-001 à NET-010)
- **Agents utilisés** : @architect (sonnet), @frontend (sonnet), @security (sonnet review), @quality (review)
- **Fichiers créés** (24 nouveaux) :
  - Blocks (12) : NetworkTopologyBlock, PortScanTableBlock, FirewallRulesBlock, ServerInventoryBlock, DnsRecordsBlock, CertificateInfoBlock, WirelessSurveyBlock, SubnetMapBlock, VlanDiagramBlock, ArchitectureDiagramBlock, CloudArchitectureBlock, NetworkFlowBlock
  - Modals (12) : NetworkTopologyModal, PortScanTableModal, FirewallRulesModal, ServerInventoryModal, DnsRecordsModal, CertificateInfoModal, WirelessSurveyModal, SubnetMapModal, VlanDiagramModal, ArchitectureDiagramModal, CloudArchitectureModal, NetworkFlowModal
- **Fichiers modifiés** :
  - blockRegistry.js (12 network entries), blocks/index.js, modals/index.js, EditorModal.jsx, ExportModal.jsx
  - module-catalogue.md (network + pentest + grc + graph marqués ✅)
- **Points notables** :
  - NetworkTopologyBlock : isometric grid avec 10 device types, zones colorées, flow connections avec épaisseur proportionnelle au bandwidth
  - NetworkFlowBlock : Sankey-like avec nœuds en colonne + liens proportionnels + hover tooltips
  - Audit sécurité : 6 valeurs non-échappées corrigées dans ExportModal + `esc()` enrichi avec `&#39;`
- **Progression catalogue** : 61/100 blocs ✅ (reste 39 : hardware 10, osint 13, forensics 10, social-engineering 6)
- **Statut** : Terminé

## Sprint 2026-03-30 — Universal Table (consolidation 14→1)
- **Tickets** : 8 exécutés (TAB-001 à TAB-008)
- **Agents utilisés** : @architect (sonnet), @frontend (sonnet), @security (sonnet review)
- **Fichiers créés** (5 nouveaux) :
  - ai/specs/universal-table-spec.md — Architecture spec complète (~1600 lignes)
  - app/frontend/lib/tablePresets.js — 14 presets (port-scan, credentials, cve, firewall, server-inventory, dns, wireless, risk-register, action-plan, raci, compliance-checklist, ebios-feared-events, ebios-scenarios, control-matrix)
  - app/frontend/lib/tableMigration.js — normalizeTableData() + 14 BLOCK_MIGRATORS
  - app/frontend/components/Editor/blocks/UniversalTableBlock.jsx — Renderer universel, 12 types de cellules
  - app/frontend/components/Editor/modals/UniversalTableModal.jsx — Modal éditeur split-pane avec tabs (données, colonnes, options, modèles)
- **Fichiers modifiés** :
  - blocks/index.js — 14 imports supprimés, 15 types → UniversalTableBlock
  - modals/index.js — 14 exports spécialisés supprimés, UniversalTableEditor ajouté
  - EditorModal.jsx — 15 MODAL_TYPES → UniversalTableEditor
  - ExportModal.jsx — renderUniversalTable() + suppression 14 case spécialisés
  - blockRegistry.js — table defaultData migré vers nouveau format, 14 types hidden: true
- **Décisions prises** :
  - ADR: Migration render-time (pas de migration DB), les anciens types restent en registry comme aliases cachés
  - 12 types de colonnes : text, rich-text, mono, badge, number, score-badge, progress, masked, status-dot, icon-status, row-id, circle-badge
  - Presets = templates, pas des types de blocs distincts
- **Audit sécurité** : RichText XSS pre-existant noté (hors scope sprint, affecte tout l'éditeur). Aucune nouvelle vulnérabilité introduite.
- **Statut** : Terminé

## Sprint 2026-03-30b — Cleanup, doc & bugfixes
- **Tickets** : 5 correctifs
- **Agents utilisés** : @frontend (direct)
- **Corrections** :
  1. **Report switching bug** — Editor.jsx: `!storeReport` → `storeReport.id !== report.id`. editorStore: reset `selectedBlockId` on `setReport()`. Topbar: sync title on `report.id` change.
  2. **Demo showcase tables** — 4 blocs seeds convertis au format Universal Table (périmètre, port-scan, credentials, recommandations) pour démontrer 9 types de colonnes.
  3. **Dead code cleanup** — 30 fichiers supprimés (15 blocks + 15 modals) remplacés par Universal Table.
  4. **README rewrite** — Mis à jour pour refléter Arbor (plus un boilerplate).
  5. **.gitignore** — Ajout `/public/vite/` pour exclure les build artifacts (60MB).
- **Fichiers supprimés** (30) :
  - 15 blocks : ActionPlanBlock, ComplianceChecklistBlock, ControlMatrixBlock, CredentialsTableBlock, CVETableBlock, DnsRecordsBlock, EbiosFearedEventsBlock, EbiosScenariosBlock, FirewallRulesBlock, PortScanTableBlock, RaciMatrixBlock, RiskRegisterBlock, ServerInventoryBlock, TableBlock, WirelessSurveyBlock
  - 15 modals : ActionPlanModal, ComplianceChecklistModal, ControlMatrixModal, CredentialsTableModal, CVETableModal, DnsRecordsModal, EbiosFearedEventsModal, EbiosScenariosModal, FirewallRulesModal, PortScanTableModal, RaciMatrixModal, RiskRegisterModal, ServerInventoryModal, TableModal, WirelessSurveyModal
- **Fichiers modifiés** : README.md, .gitignore, backlog.md, sprint_log.md, Editor.jsx, editorStore.js, Topbar.jsx, seeds.rb
- **Statut** : Terminé

## Sprint 2026-03-30c — Déploiement VPS + Intégration Lab Portfolio
- **Tickets** : 5 exécutés
- **Agents utilisés** : aucun (déploiement infra manuel)
- **Actions réalisées** :
  1. **Dockerfile** créé — Multi-stage build : Ruby 3.3.10-slim + Node 22 + Vite precompile + Thruster port 80 + jemalloc + healthcheck `/up`
  2. **Nettoyage VPS** — Disque à 98% (486MB libre) → 75% (5.6GB) après suppression containers arrêtés + build cache + dangling images
  3. **Déploiement Arbor** — Container `arbor-web` sur réseau kamal, volume `arbor-storage`, TLS auto via kamal-proxy → https://arbor.robin-borg.dev
  4. **Intégration Lab Portfolio** — manifest.json créé, ajout à `apps.yml`, ajout `arbor` dans `LAB_APP_IDS` du PagesController
  5. **Fix iframe** — Rails envoie `X-Frame-Options: SAMEORIGIN` par défaut → remplacé par `Content-Security-Policy: frame-ancestors 'self' https://robin-borg.dev https://aegyl.fr`
  6. **Fix icône** — manifest référençait `2D-tree` (inexistant) → changé en `2D-diamond`
- **Fichiers créés** :
  - `Dockerfile` (Arbor)
  - `app/frontend/lab/apps/arbor/manifest.json` (Portfolio)
- **Fichiers modifiés** :
  - `app/controllers/application_controller.rb` — `allow_iframe_from_portfolio` after_action
  - `apps.yml` (Portfolio) — entrée Arbor ajoutée
  - `app/controllers/pages_controller.rb` (Portfolio) — `LAB_APP_IDS = %w[asmble arbor]`
- **Pièges rencontrés** :
  - Le `SECRET_KEY_BASE` n'est pas utilisé par le Portfolio (utilise `RAILS_MASTER_KEY` via credentials chiffrées)
  - Vite fait du code-splitting : les manifests Lab sont dans `Index-*.js`, pas dans `application-*.js`
  - Les icônes Lab sont hardcodées (12 noms seulement) dans `registry.ts`
  - `PagesController` a une whitelist `LAB_APP_IDS` — il faut ajouter chaque nouvelle app
- **Infra VPS résultante** :
  - `arbor-web` → arbor.robin-borg.dev (TLS, port 80)
  - `portfolio-web-latest` → robin-borg.dev, aegyl.fr (TLS, port 3000)
  - `asmble-web` → asmble.robin-borg.dev (TLS)
  - `cloudfiles` → cloud.robin-borg.dev (TLS)
  - kamal-proxy v0.9.2, Docker, Debian 13
- **Statut** : Terminé
