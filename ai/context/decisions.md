# Décisions d'Architecture (ADR)

## ADR-001 : Stack technique
- **Date** : 2026-03-11
- **Statut** : Accepté
- **Décision** : Ruby on Rails 8.1 + Inertia.js + React 18 + Vite
- **Raison** : Rails pour la productivité backend, Inertia pour éviter une SPA complexe avec API, React pour l'écosystème composants
- **Conséquences** : Pas de routing client-side, les controllers Rails gèrent le routing via Inertia

## ADR-002 : Base de données
- **Date** : 2026-03-11
- **Statut** : Accepté
- **Décision** : SQLite en développement, PostgreSQL en production
- **Raison** : SQLite simplifie le setup dev, PostgreSQL pour la robustesse en prod (Rails 8 supporte bien les deux)

## ADR-003 : Orchestration IA via Claude Code natif
- **Date** : 2026-03-11
- **Statut** : Accepté
- **Décision** : Utiliser Claude Code (abonnement) comme orchestrateur multi-agents, pas de clé API séparée
- **Raison** : Éviter le doublon de coûts, sub-agents via l'outil Agent intégré
- **Conséquences** : Les agents sont des fichiers YAML de config, le CLAUDE.md définit le comportement du Manager

## ADR-004 : State management frontend
- **Date** : 2026-03-27
- **Statut** : Accepté
- **Décision** : Zustand + Immer pour l'état de l'éditeur
- **Raison** : Moins de boilerplate que useReducer+Context, mutations immuables simplifiées, store accessible partout sans provider
- **Conséquences** : Store centralisé dans `app/frontend/stores/editorStore.js`, pas de Context wrapping

## ADR-005 : Drag & drop — @dnd-kit
- **Date** : 2026-03-27
- **Statut** : Accepté
- **Décision** : @dnd-kit (core + sortable + utilities) pour le drag & drop
- **Raison** : API moderne, performante, accessible (WCAG), support touch/pointer, meilleur choix vs react-beautiful-dnd (deprecated)
- **Conséquences** : DndContext au niveau Editor, useDraggable pour le drawer, useSortable pour les blocs canvas

## ADR-006 : Mono-utilisateur, pas d'authentification
- **Date** : 2026-03-27
- **Statut** : Accepté
- **Décision** : Pas de système d'auth en V1, mono-utilisateur
- **Raison** : Usage personnel, VPS privé, simplification maximale
- **Conséquences** : Pas de user_id dans reports, pas de Devise/bcrypt

## ADR-007 : JSON content dans la DB
- **Date** : 2026-03-27
- **Statut** : Accepté
- **Décision** : Le rapport est stocké en JSON dans une colonne `content` (json en SQLite, jsonb en PostgreSQL)
- **Raison** : Structure dynamique des blocs, pas de normalisation relationnelle nécessaire
- **Conséquences** : Queries sur le contenu limitées, mais flexibilité totale sur la structure des blocs

## ADR-008 : Typographie Fraunces + DM Mono
- **Date** : 2026-03-27
- **Statut** : Accepté
- **Décision** : Fraunces (serif, 300) pour les titres, DM Mono pour le corps/UI
- **Raison** : Identité visuelle unique, lisibilité rapport cybersec
- **Conséquences** : Import Google Fonts dans globals.css, possibilité de self-host plus tard

## ADR-009 : Double drawer (composants + arborescence)
- **Date** : 2026-03-27
- **Statut** : Accepté
- **Décision** : Drawer gauche pour les composants (260px) + drawer arborescence (220px) pour la vue structurée des blocs
- **Raison** : Inspiration PowerApps/Figma — manipulation rapide depuis 2 vues complémentaires
- **Conséquences** : Layout 5 zones (topbar + drawer + tree + canvas + properties)

## ADR-010 : Catégories de blocs métier
- **Date** : 2026-03-28
- **Statut** : Accepté
- **Décision** : 11 catégories de blocs — 3 génériques (content, layout, media) + 8 métier (pentest, network, grc, hardware, osint, graph, forensics, social-engineering)
- **Raison** : Arbor cible tous les domaines de la cybersécurité. Chaque catégorie regroupe des modules spécialisés. Les blocs risk existants migrent de "content" vers "pentest".
- **Conséquences** : Le drawer affiche toutes les catégories, les vides sont grisées avec "bientôt". `categoryLabels` centralisé dans blockRegistry.js.

## ADR-011 : Stratégie d'export HTML avec libs externes (dual rendering)
- **Date** : 2026-03-28
- **Statut** : Accepté
- **Décision** : Dual rendering — interactif dans l'éditeur (React), statique à l'export (SVG inline / Canvas→base64)
- **Raison** : L'export HTML doit être autonome (un seul fichier, pas de CDN, pas de JS externe). Les libs graphiques (charts, cartes, diagrams) sont utilisées uniquement dans l'éditeur React, puis leur rendu est capturé en SVG inline ou image base64 pour l'export.
- **Stratégie par type** :
  - Tableaux, cartes, badges → HTML/CSS inline (déjà en place)
  - Graphiques (Chart.js/D3/custom SVG) → export SVG inline via `.outerHTML` ou `canvas.toDataURL()`
  - Cartes géo (Leaflet/MapLibre) → capture Canvas→base64 `<img>`
  - Diagrammes réseaux/circuits → SVG pur inline
  - Chaque composant bloc expose une méthode `toExportHTML()` ou un ref pour capture
- **Conséquences** : Les blocs complexes ont 2 rendus (éditeur interactif + export statique). Le fichier HTML exporté reste 100% autonome.

## ADR-012 : SVG pur pour les graphiques (pas de lib externe)
- **Date** : 2026-03-28
- **Statut** : Accepté
- **Décision** : Tous les composants de la catégorie Graph utilisent du SVG pur (viewBox, <rect>, <polyline>, <circle>, etc.) — pas de Chart.js, D3, Recharts ou autre lib.
- **Raison** : Contrôle total du rendu, taille de bundle minimale, export HTML facilité (SVG inline), cohérence visuelle, pas de dépendance externe.
- **Conséquences** : Chaque chart est un composant React autonome ~100-300 lignes. Les utilitaires partagés (niceScale, formatValue, PALETTE) sont centralisés dans `app/frontend/lib/chartUtils.js`. Les tooltips utilisent `useState` natif.

## ADR-013 : Architecture modals/ — 1 fichier par éditeur modal
- **Date** : 2026-03-28
- **Statut** : Accepté
- **Décision** : Extraire chaque éditeur modal de EditorModal.jsx vers un dossier `modals/` avec 1 fichier par éditeur (~80-150 lignes chacun). EditorModal.jsx devient un hub de routage (~80 lignes).
- **Raison** : EditorModal.jsx atteignait 1281 lignes (20+ composants). Violation critique de la règle @quality (>400 lignes = à refactorer). Single Responsibility Principle.
- **Structure** :
  - `modals/ModalShell.jsx` — Conteneur réutilisable (backdrop, header, Escape)
  - `modals/shared.js` — Styles partagés (inputStyle, labelStyle, btnStyle, DEFAULT_COLORS)
  - `modals/[Name]Modal.jsx` — 1 fichier par type d'éditeur (20 fichiers)
  - `EditorModal.jsx` — MODAL_TYPES config + dispatch
- **Conséquences** : Imports plus nombreux mais fichiers lisibles, testables unitairement, et navigables.

## ADR-014 : Universal Table — consolidation 14 blocs tableau en 1
- **Date** : 2026-03-30
- **Statut** : Accepté
- **Décision** : Remplacer 14 blocs spécialisés (port-scan-table, credentials-table, cve-table, firewall-rules, server-inventory, dns-records, wireless-survey, risk-register, action-plan, raci-matrix, compliance-checklist, ebios-feared-events, ebios-scenarios, control-matrix) par un unique `UniversalTableBlock` avec 12 types de colonnes typées et 14 presets.
- **Raison** : Ces 14 blocs étaient des "tableaux déguisés" — même pattern (titre + meta + header + rows) avec juste des colonnes typées différemment. Code dupliqué massif (~3000 lignes de renderers + modals + export cases).
- **Architecture** :
  - `tablePresets.js` — 14 presets avec columns[], sampleRows[], config
  - `tableMigration.js` — normalizeTableData() + 14 BLOCK_MIGRATORS (migration render-time)
  - `UniversalTableBlock.jsx` — 12 cell renderers (text, rich-text, mono, badge, number, score-badge, progress, masked, status-dot, icon-status, row-id, circle-badge)
  - `UniversalTableModal.jsx` — Éditeur split-pane avec onglets (données, colonnes, options, modèles)
- **Migration** : Render-time (pas de migration DB). Les anciens types restent en registry avec `hidden: true`, mappés vers UniversalTableBlock. BLOCK_MIGRATORS convertit l'ancien format à la volée.
- **Conséquences** : Réduction massive de code. Les anciens fichiers Block/Modal sont dead code (à supprimer). Tout nouveau "tableau spécialisé" = juste un preset dans tablePresets.js.

<!-- Ajouter les ADR du projet ici lors du clonage du boilerplate -->
