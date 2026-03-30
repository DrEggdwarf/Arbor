/**
 * Design Tokens — Arbor Report Builder
 * Source de vérité pour tous les styles, aligné sur le mockup.
 *
 * Usage : import { colors, spacing, typography } from "../styles/tokens";
 */

export const colors = {
  // Canvas & surfaces
  bg: "#F5F3EE",
  surface: "#FDFCF9",
  surfaceHover: "rgba(200,184,154,0.04)",

  // Drawer (dark)
  drawer: {
    bg: "#1A1A18",
    surface: "#242420",
    border: "#333330",
    cardBg: "#2C2C28",
    cardBorder: "#3A3A36",
    cardHover: "#2A2A26",
  },

  // Accent
  accent: "#C8B89A",
  accentBright: "#E8A855",
  accentHover: "#F0B960",

  // Sémantiques
  success: "#5CB85C",
  warning: "#E9C46A",
  error: "#E57373",
  info: "#5B8FD4",

  // Risques (matrice OWASP)
  risk: {
    low: { bg: "#D4EDDA", text: "#2D7A47" },
    medium: { bg: "#FFF3CD", text: "#856404" },
    high: { bg: "#FDDCB5", text: "#9C4221" },
    critical: { bg: "#F8D7DA", text: "#842029" },
  },

  // Texte
  text: {
    primary: "#1A1A18",
    secondary: "#4A4840",
    muted: "#807D76",
    onDark: "#F0EDE6",
    mutedOnDark: "#B5B0A8",
  },

  // Bordures
  border: "#E2DDD5",

  // Interactions blocs
  blockHover: "#5B8FD4",
  blockSelected: "#E8A855",

  // Ombres
  shadow: {
    soft: "0 2px 12px rgba(26,26,24,0.06)",
    card: "0 1px 3px rgba(26,26,24,0.08), 0 4px 16px rgba(26,26,24,0.04)",
    page: "0 1px 3px rgba(26,26,24,0.08), 0 4px 16px rgba(26,26,24,0.04), 0 20px 60px rgba(26,26,24,0.08)",
    elevated: "0 4px 16px rgba(0,0,0,0.3)",
  },
};

export const typography = {
  fontFamily: {
    heading: "'Fraunces', serif",
    body: "'DM Mono', monospace",
  },
  fontSize: {
    xs: "10px",
    sm: "11px",
    base: "12px",
    md: "13px",
    lg: "14px",
    xl: "17px",
    "2xl": "20px",
    "3xl": "28px",
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
  },
  letterSpacing: {
    tight: "-0.02em",
    normal: "0",
    wide: "0.02em",
    wider: "0.04em",
    widest: "0.08em",
    caps: "0.12em",
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
    loose: 1.75,
  },
};

export const spacing = {
  0: "0",
  1: "4px",
  2: "6px",
  3: "8px",
  4: "10px",
  5: "12px",
  6: "14px",
  7: "16px",
  8: "20px",
  9: "24px",
  10: "32px",
  12: "40px",
  16: "64px",
  20: "72px",
};

export const radii = {
  none: "0",
  sm: "2px",
  md: "6px",
  lg: "10px",
  xl: "16px",
  full: "9999px",
};

export const layout = {
  drawerWidth: "260px",
  treeDrawerWidth: "220px",
  topbarHeight: "48px",
  propertiesPanelWidth: "260px",
  pageWidth: "794px",
  pageMinHeight: "1123px",
  pagePadding: "64px 72px",
};

export const zIndex = {
  base: 0,
  drawer: 10,
  topbar: 100,
  overlay: 300,
  modal: 400,
  tooltip: 999,
};
const tokens = { colors, typography, spacing, radii, zIndex };
export default tokens;
