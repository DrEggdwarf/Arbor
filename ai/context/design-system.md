# Design System — Arbor Report Builder

> Document vivant. Mis à jour par @frontend lors de chaque sprint UI.
> Source de vérité pour tous les choix visuels du projet.

---

## Tokens

Les valeurs concrètes sont dans `app/frontend/styles/tokens.js`.
Les variables CSS globales sont dans `app/frontend/styles/globals.css`.

**Règle** : jamais de valeur hardcodée dans un composant. Toujours importer depuis `tokens.js` ou utiliser une variable CSS.

---

## Palette de couleurs

### Surfaces
| Token | Valeur | Usage |
|-------|--------|-------|
| `colors.bg` | `#F5F3EE` | Fond canvas (crème chaud) |
| `colors.surface` | `#FDFCF9` | Surface page A4 (blanc cassé) |
| `colors.drawer.bg` | `#1A1A18` | Fond drawers et topbar |
| `colors.drawer.surface` | `#242420` | Éléments secondaires drawers |
| `colors.drawer.cardBg` | `#2C2C28` | Cartes composants drawer |

### Accent
| Token | Valeur | Usage |
|-------|--------|-------|
| `colors.accent` | `#C8B89A` | Accent subtil |
| `colors.accentBright` | `#E8A855` | Accent principal (ambre) |
| `colors.accentHover` | `#F0B960` | Hover sur accent |

### Sémantiques
| Token | Valeur | Usage |
|-------|--------|-------|
| `colors.success` | `#5CB85C` | Succès, sauvegardé |
| `colors.warning` | `#E9C46A` | Avertissements |
| `colors.error` | `#E57373` | Erreurs, suppression |
| `colors.info` | `#5B8FD4` | Info, hover bloc |

### Risques (matrice OWASP)
| Niveau | Fond | Texte |
|--------|------|-------|
| Faible | `#D4EDDA` | `#2D7A47` |
| Moyen | `#FFF3CD` | `#856404` |
| Élevé | `#FDDCB5` | `#9C4221` |
| Critique | `#F8D7DA` | `#842029` |

### Texte
| Token | Valeur | Usage |
|-------|--------|-------|
| `text.primary` | `#1A1A18` | Texte principal sur clair |
| `text.secondary` | `#6B6860` | Texte secondaire |
| `text.muted` | `#A8A59E` | Labels, métadonnées |
| `text.onDark` | `#F0EDE6` | Texte sur fond sombre |
| `text.mutedOnDark` | `#9A9690` | Labels sur fond sombre |

### Interactions blocs
| État | Style |
|------|-------|
| Hover | Outline pointillé `#5B8FD4` (bleu) |
| Sélectionné | Outline plein `#E8A855` (ambre) |

---

## Typographie

### Familles
| Usage | Font | Token |
|-------|------|-------|
| Titres, logo | **Fraunces** (serif, 300) | `fontFamily.heading` |
| Corps, UI, code | **DM Mono** (monospace) | `fontFamily.body` |

### Échelle
| Token | Taille | Usage |
|-------|--------|-------|
| `xs` | 9px | Labels uppercase, badges |
| `sm` | 10px | Catégories drawer, labels propriétés |
| `base` | 11px | Texte UI courant, boutons |
| `md` | 12px | Corps de texte page, code |
| `lg` | 13px | Texte de bloc |
| `xl` | 16px | Titre de section bloc |
| `2xl` | 18px | Logo |
| `3xl` | 28px | Titre rapport |

### Règles
- Labels uppercase : `letter-spacing: 0.08-0.12em`, `font-size: 9-10px`
- Titres : `font-weight: 300` (Fraunces light)
- Logo : Fraunces 18px, letter-spacing -0.02em

---

## Layout

| Zone | Dimension |
|------|-----------|
| Topbar | hauteur 48px, fond `drawer.bg` |
| Drawer composants | largeur 260px, fond `drawer.bg` |
| Tree drawer (arborescence) | largeur 220px, fond `surface` |
| Canvas | flex-1, fond `bg` avec grille de points |
| Page A4 | 794px × 1123px min, fond `surface` |
| Panel propriétés | largeur 220px, fond `surface` |

### Grille de points du canvas
```css
background-image: radial-gradient(circle at 1px 1px, rgba(26,26,24,0.07) 1px, transparent 0);
background-size: 24px 24px;
```

---

## Composants

### Boutons
| Type | Style |
|------|-------|
| Primaire (CTA) | bg=accentBright, text=dark, hover=accentHover + translateY(-1px) + shadow |
| Ghost | bg=transparent, border=drawer.border, text=mutedOnDark, hover=drawer.surface |
| Export | border=border, bg=bg, hover=text-primary border |

### Cartes composants (drawer)
```
bg=drawer.cardBg, border=1px solid drawer.cardBorder, radius=6px
Hover: border=accent, translateY(-1px), shadow elevated
Grid 2 colonnes dans le drawer, items `.wide` = span 2
Badge cybersec: point 5px ambre en haut à droite
```

### Blocs (canvas)
```
margin-bottom: 24px
Toolbar: absolute right -40px, visible au hover (↑↓⋯✕)
Hover: outline 1.5px dashed #5B8FD4 à -4px
Sélection: outline 1.5px solid #E8A855 à -4px
```

---

## Accessibilité

- Ratio de contraste texte/fond : **minimum 4.5:1** (WCAG AA)
- Focus visible : outline 2px solid accentBright
- Pas de couleur seule pour transmettre l'info (toujours icône + texte)
- Navigation clavier dans le drawer et l'arborescence
- ARIA roles sur les zones drag & drop

---

## Historique des décisions design

| Date | Décision | Raison |
|------|----------|--------|
| 2026-03-11 | System fonts stack | Performance — pas de requête externe |
| 2026-03-27 | Migration vers Fraunces + DM Mono | Alignement sur mockup Arbor, identité visuelle unique |
| 2026-03-27 | Palette crème/ambre/sombre | Charte Arbor — rapport cybersec élégant et lisible |
| 2026-03-27 | Ajout tree drawer (arborescence blocs) | UX : vue structurée, drag & drop depuis l'arbre |
| 2026-03-11 | Spacing unit = 4px | Cohérence avec les standards (Tailwind, Material) |
| 2026-03-11 | WCAG AA comme standard minimum | Accessibilité comme exigence de base |
