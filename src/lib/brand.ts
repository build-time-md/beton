/**
 * Brand system — derived from the client's MAN concrete mixer:
 * vivid green drum, charcoal/black cab grille, grey chassis, on a white base.
 *
 * Single source of truth for brand colors. Used by components (marker pins,
 * route line) and mirrored as CSS custom properties in globals.css.
 */
export const BRAND = {
  name: "Beton",
  tagline: "Livrare beton — Chișinău",

  /** Truck green. */
  green: "#3FA535",
  greenDark: "#2C7A28",
  greenDarker: "#1F5C1C",
  greenSoft: "#EAF5E8",

  /** Cab grille / chassis. */
  ink: "#1A1F1C",
  charcoal: "#2B312D",
  grey: "#6B746E",

  /** Surfaces. */
  white: "#FFFFFF",
  surface: "#FFFFFF",
  surface2: "#F3F6F2",
  line: "#E1E7DF",

  /** Functional marker accents (kept distinct from brand greens). */
  client: "#E5392F",
  route: "#3FA535",
} as const;
