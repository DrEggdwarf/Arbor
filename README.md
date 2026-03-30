# Arbor — Cybersecurity Report Builder

Éditeur de rapports cybersécurité par blocs, conçu pour les pentesters, auditeurs GRC et analystes sécurité. Assemblage visuel de composants métier spécialisés, export HTML autonome.

![Rails](https://img.shields.io/badge/Rails-8.1-red) ![React](https://img.shields.io/badge/React-18-blue) ![Blocs](https://img.shields.io/badge/Blocs-61%2F100-green)

## Fonctionnalités

- **100 types de blocs** métier (61 implémentés) : pentest, GRC, network, graphs, et plus
- **Universal Table** — 1 composant tableau avec 12 types de colonnes typées et 14 presets (RACI, CVE, scan de ports, registre de risques...)
- **14 types de graphiques** SVG pur (barres, lignes, radar, Sankey, treemap, heatmap...)
- **Export HTML** fidèle et autonome (un seul fichier, pas de CDN)
- **Drag & drop** avec @dnd-kit (réordonnancement, insertion depuis le drawer)
- **Autosave** avec feedback visuel temps réel
- **5 rapports démo** inclus (pentest, GRC, infra, dashboard, web)
- **Système multi-agents IA** pour le développement assisté

## Stack

| Couche | Technologie |
|--------|------------|
| Backend | Ruby on Rails 8.1 |
| Frontend | React 18 + Inertia.js |
| Bundler | Vite 6 (vite_rails) |
| State | Zustand + Immer |
| Drag & Drop | @dnd-kit |
| DB dev | SQLite |
| DB prod | PostgreSQL |
| i18n | Rails I18n (fr + en) |

## Prérequis

- Ruby 3.3+ (via [rbenv](https://github.com/rbenv/rbenv))
- Node.js 20+ (via [nvm](https://github.com/nvm-sh/nvm))
- SQLite3 (`sudo apt install sqlite3 libsqlite3-dev` sur Debian/Ubuntu)

## Installation

```bash
git clone https://github.com/DrEggdwarf/Arbor.git
cd Arbor
bash bin/setup
```

> Ouvrir **http://localhost:3000**

`bin/setup` installe les gems, les packages JS, prépare la base et lance le serveur. Les ports 3000 et 3036 sont libérés automatiquement.

## Catalogue des blocs

| Catégorie | Blocs | Statut |
|-----------|-------|--------|
| Content | section-title, text, code, table, callout | ✅ 5/5 |
| Layout | separator, spacer, columns, drawer | ✅ 4/4 |
| Media | image | ✅ 1/1 |
| Pentest | vuln-card, CVE, CVSS, kill-chain, attack-path, credentials... | ✅ 13/13 |
| Network | topology, port-scan, firewall, VLAN, DNS, certificat... | ✅ 12/12 |
| GRC | EBIOS, compliance, risk-register, RACI, maturity radar... | ✅ 12/12 |
| Graph | bar, line, pie, radar, sankey, heatmap, treemap... | ✅ 14/14 |
| Hardware | circuit, pin, waveform, memory-map... | 🔲 0/10 |
| OSINT | relationship-graph, geo-map, whois, timeline... | 🔲 0/13 |
| Forensics | disk-map, process-tree, IOC, hex-viewer... | 🔲 0/10 |
| Social Eng. | phishing-stats, awareness-score, vishing... | 🔲 0/6 |

Détails complets : [ai/context/module-catalogue.md](ai/context/module-catalogue.md)

## Architecture

```
app/
├── controllers/          # Rails controllers (reports CRUD)
├── models/               # Report model (JSON content)
├── frontend/
│   ├── pages/            # Home, Editor (Inertia pages)
│   ├── components/Editor/
│   │   ├── blocks/       # Block renderers (61 fichiers)
│   │   ├── modals/       # Modal editors
│   │   ├── Canvas.jsx    # Zone de rendu A4
│   │   ├── ComponentDrawer.jsx
│   │   ├── TreeDrawer.jsx
│   │   └── Topbar.jsx
│   ├── stores/           # Zustand (editorStore, blockRegistry)
│   ├── lib/              # Utilitaires (chartUtils, tableMigration, tablePresets)
│   └── styles/           # Tokens, globals, editor CSS
├── views/layouts/        # Rails layout avec Inertia + Vite
db/
├── seeds.rb              # 5 rapports démo complets
ai/
├── agents/               # 12 agents IA (YAML configs)
├── context/              # Mémoire projet (sprint_log, decisions, backlog)
└── workflows/            # Workflows code_review, new_feature
```

## Développement

```bash
bin/dev              # Lance Rails + Vite (ports 3000 + 3036)
bin/rails db:seed    # Recrée les rapports démo
bin/rails db:reset   # Reset complet (drop + create + migrate + seed)
```

## Système Multi-Agents IA

Arbor inclut un framework de développement assisté par IA (12 agents spécialisés pilotés par Claude Code).

Voir [CLAUDE.md](CLAUDE.md) pour la documentation complète du framework.

| Agent | Domaine |
|-------|---------|
| @pm | Specs, user stories |
| @architect | Structure, patterns |
| @backend | Rails, controllers |
| @frontend | React, composants |
| @security | Audit OWASP |
| @testing | Tests unitaires |
| @quality | Code quality |
| @performance | Perf, N+1 |
| @a11y | WCAG 2.1 AA |
| @pentester | Tests d'intrusion |
| @database | SQL, migrations |
| @devops | Docker, CI/CD |

## Licence

[MIT](LICENSE)

## i18n

L'app est multilingue dès le départ (fr par défaut, en inclus).

```jsx
// Dans un composant React
import { useTranslation } from "../lib/useTranslation";
const { t } = useTranslation();
return <h1>{t("app.name")}</h1>;
```

Ajouter une langue : créer `config/locales/xx.yml` + ajouter `:xx` dans `config/initializers/i18n.rb`.

## Structure du projet

```
├── ai/
│   ├── agents/          # 12 agents YAML (rôle, scope, rules, prompt)
│   ├── workflows/       # new_feature.yml, code_review.yml
│   └── context/         # sprint_log.md, decisions.md, backlog.md
├── app/
│   ├── controllers/     # Controllers Rails (render inertia:)
│   ├── frontend/
│   │   ├── components/  # Composants React partagés
│   │   ├── entrypoints/ # Point d'entrée Vite (application.jsx)
│   │   ├── lib/         # Hooks utilitaires (useTranslation)
│   │   └── pages/       # Pages Inertia (PascalCase)
│   └── views/layouts/   # Layout HTML avec tags Vite
├── config/
│   ├── locales/         # fr.yml, en.yml
│   └── initializers/    # i18n.rb
├── CLAUDE.md            # Instructions Manager (framework 5 phases)
└── vite.config.ts
```
