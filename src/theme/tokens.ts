/**
 * Design tokens — the single source of truth for colors, spacing, type, and radii.
 * Components must consume these (directly or via Tailwind classes wired to them
 * in tailwind.config.js) and never hardcode values.
 */

export const palette = {
  // Neutral scale
  white: "#ffffff",
  gray50: "#fafafa",
  gray100: "#f4f4f5",
  gray200: "#e4e4e7",
  gray300: "#d4d4d8",
  gray400: "#a1a1aa",
  gray500: "#71717a",
  gray600: "#52525b",
  gray700: "#3f3f46",
  gray800: "#27272a",
  gray900: "#18181b",
  black: "#09090b",

  // Brand + semantic (placeholder identity until the product is named)
  primary: "#10b981", // emerald — progress, growth
  primaryDark: "#059669",
  primarySoft: "#d1fae5",
  accent: "#8b5cf6", // violet — milestones, celebration
  accentSoft: "#ede9fe",
  warn: "#f59e0b", // amber — gentle attention, never shame
  info: "#3b82f6"
} as const;

export type ThemeColors = {
  background: string;
  surface: string;
  surfaceMuted: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textInverse: string;
  primary: string;
  primarySoft: string;
  accent: string;
  accentSoft: string;
  warn: string;
  info: string;
};

export const lightColors: ThemeColors = {
  background: palette.gray50,
  surface: palette.white,
  surfaceMuted: palette.gray100,
  border: palette.gray200,
  textPrimary: palette.gray900,
  textSecondary: palette.gray500,
  textInverse: palette.white,
  primary: palette.primary,
  primarySoft: palette.primarySoft,
  accent: palette.accent,
  accentSoft: palette.accentSoft,
  warn: palette.warn,
  info: palette.info
};

export const darkColors: ThemeColors = {
  background: palette.black,
  surface: palette.gray900,
  surfaceMuted: palette.gray800,
  border: palette.gray700,
  textPrimary: palette.gray50,
  textSecondary: palette.gray400,
  textInverse: palette.gray900,
  primary: palette.primary,
  primarySoft: "#064e3b",
  accent: palette.accent,
  accentSoft: "#2e1065",
  warn: palette.warn,
  info: palette.info
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
  "3xl": 48
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999
} as const;

export const typography = {
  display: { fontSize: 34, lineHeight: 41, fontWeight: "700" },
  title: { fontSize: 28, lineHeight: 34, fontWeight: "700" },
  heading: { fontSize: 22, lineHeight: 28, fontWeight: "600" },
  body: { fontSize: 17, lineHeight: 24, fontWeight: "400" },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: "400" },
  stat: { fontSize: 40, lineHeight: 46, fontWeight: "800" }
} as const;
