# Arbor — Expression des besoins
*Outil de construction de rapports cybersécurité*

---

## 1. Contexte et problématique

Dans le cadre d'études en cybersécurité (M1 Oteria Cyber School), la production de rapports techniques est fréquente et couvre des domaines variés : tests d'intrusion, analyse de risques GRC, audits d'infrastructure Active Directory. Chaque type de rapport obéit à des contraintes de structure et de contenu différentes, rendant l'usage d'un template universel inefficace.

Les outils généralistes existants (Notion, Google Docs) ne proposent pas de composants métier adaptés au domaine cybersécurité. L'objectif d'Arbor est de combler ce manque avec un éditeur web bloc-based spécialisé, épuré, et autohébergé.

---

## 2. Objectifs

- Construire des rapports cybersécurité par assemblage visuel de blocs pré-designés
- Capitaliser sur des composants métier spécialisés introuvables dans les outils généralistes
- Permettre la sauvegarde, le rechargement et l'export des rapports
- Offrir une expérience de consultation et d'annotation sur mobile

---

## 3. Périmètre fonctionnel

### 3.1 V1 — Desktop

#### Éditeur

- Page blanche centrale représentant le rapport (format A4)
- Drawer gauche listant les composants disponibles par catégorie
- Drag & drop des composants depuis le drawer vers la page
- Réorganisation des blocs par drag & drop sur la page
- Sélection d'un bloc → affichage de ses propriétés dans le panel droit
- Suppression, duplication de blocs
- Outline pointillé bleu au hover d'un bloc, outline ambre à la sélection

#### Sauvegarde et chargement

- Sauvegarde automatique du rapport en JSON dans la base de données
- Export manuel du JSON
- Import d'un fichier JSON pour reconstruire un rapport existant

#### Export

- Export HTML (rendu fidèle au rapport construit)
- Export Typst → PDF (rendu mise en page propre)

#### Gestion des rapports

- Liste des rapports avec titre, type, date
- Types : Pentest / GRC-EBIOS / Infrastructure AD / Audit de code
- Couleur d'accent personnalisable par rapport (swatches + color picker)

---

### 3.2 V1.5 — Mobile

- Consultation responsive d'un rapport existant
- Annotation rapide sur un bloc (commentaire texte)
- Partage direct du rapport en HTML ou PDF

---

### 3.3 Hors scope

- Création complète d'un rapport sur mobile
- Pipelines API live sur les composants
- Collaboration multi-utilisateurs en temps réel
- Paste & Build automatique

---

## 4. Catalogue des composants

### Blocs génériques

| Composant | Description |
|---|---|
| Titre | Titre de section numéroté |
| Texte | Bloc de texte riche (gras, italique, code inline) |
| Code | Bloc de code avec coloration syntaxique et bouton copier |
| Image | Image avec légende |
| Image + Zoom | Image avec loupe au hover pour afficher des screenshots de code |
| Tableau | Tableau configurable (colonnes, lignes, en-têtes) |
| 2 Colonnes | Conteneur 2 colonnes acceptant d'autres blocs |
| 3 Colonnes | Conteneur 3 colonnes |
| Séparateur | Ligne de séparation visuelle |
| En-tête rapport | Titre, type, client, date, classification, version |

### Blocs cybersécurité ✦

| Composant | Description |
|---|---|
| Matrice de risque OWASP | Grille vraisemblance × impact avec cellules colorées configurables |
| Radar EBIOS RM | Graphique en toile d'araignée des scénarios de risque |
| Tableau CVE | Liste de vulnérabilités avec score CVSS coloré, statut, remédiation |
| Fiche vulnérabilité | Titre, sévérité, CVSS, description, preuve (screenshot/code), remédiation |
| Timeline d'attaque | Visualisation chronologique d'une kill chain |
| Architecture réseau | Schéma réseau en vue isométrique (nœuds, liaisons, zones) |
| Synthèse CVSS | Graphique de distribution des scores par criticité |
| Recommandation | Bloc structuré avec priorité (critique / haute / moyenne / faible) |
| Scope / Périmètre | Liste d'IPs, domaines, plages réseau, exclusions |
| Tableau de synthèse | Vue consolidée de toutes les vulnérabilités avec statut de remédiation |

---

## 5. Modèle de données

### Structure JSON d'un rapport

```json
{
  "version": "1.0",
  "meta": {
    "title": "Pentest Acme Corp",
    "type": "pentest",
    "classification": "confidentiel",
    "date": "2026-03-27",
    "accent": "#E8A855"
  },
  "blocks": [
    {
      "id": "b_001",
      "type": "report-header",
      "data": {
        "title": "Acme Corp",
        "tag": "Pentest",
        "version": "1.2"
      }
    },
    {
      "id": "b_002",
      "type": "risk-matrix",
      "data": {
        "standard": "owasp",
        "cells": []
      }
    }
  ]
}
```

### Schéma base de données

```
reports
  id            uuid
  user_id       uuid
  title         string
  type          enum (pentest | grc | infra | audit)
  content       jsonb
  created_at    timestamp
  updated_at    timestamp
```

---

## 6. Stack technique

| Couche | Technologie |
|---|---|
| Frontend | React |
| Backend | Ruby on Rails |
| Glue frontend/backend | Inertia.js |
| Base de données | PostgreSQL (jsonb) |
| Hébergement | VPS Debian autohébergé |
| Export PDF | Typst (rendu serveur) |

---

## 7. Charte graphique

- **Fond canvas** : crème chaud `#F5F3EE`
- **Surface page** : blanc cassé `#FDFCF9`
- **Drawer** : sombre `#1A1A18`
- **Typographie titres** : Fraunces (serif, 300)
- **Typographie corps/UI** : DM Mono
- **Accent par défaut** : ambre `#E8A855`
- **Hover bloc** : pointillé bleu `#5B8FD4`
- **Sélection bloc** : outline ambre plein

---

## 8. Priorités de développement

| Priorité | Livrable |
|---|---|
| P0 | Éditeur drag & drop + blocs génériques |
| P0 | Save / Load JSON |
| P1 | Blocs cybersec : matrice risque, tableau CVE, fiche vulnérabilité |
| P1 | Export HTML |
| P2 | Blocs cybersec : radar EBIOS, timeline, archi réseau |
| P2 | Export Typst / PDF |
| P3 | Version mobile consultation + annotation |

---

*Document rédigé le 27 mars 2026 — v1.0*
