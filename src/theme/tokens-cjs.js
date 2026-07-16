// CommonJS mirror of the palette/spacing/radii tokens for tailwind.config.js,
// which cannot import TypeScript. Keep in sync with tokens.ts.
const palette = {
  primary: "#10b981",
  primaryDark: "#059669",
  primarySoft: "#d1fae5",
  accent: "#8b5cf6",
  accentSoft: "#ede9fe",
  warn: "#f59e0b",
  info: "#3b82f6"
};

const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, "2xl": 32, "3xl": 48 };
const radii = { sm: 8, md: 12, lg: 16, xl: 24, full: 9999 };

module.exports = { palette, spacing, radii };
