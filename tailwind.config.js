const { palette, spacing, radii } = require("./src/theme/tokens-cjs");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: palette.primary,
        "primary-dark": palette.primaryDark,
        "primary-soft": palette.primarySoft,
        accent: palette.accent,
        "accent-soft": palette.accentSoft,
        warn: palette.warn,
        info: palette.info
      },
      spacing: Object.fromEntries(Object.entries(spacing).map(([k, v]) => [k, `${v}px`])),
      borderRadius: Object.fromEntries(Object.entries(radii).map(([k, v]) => [k, `${v}px`]))
    }
  },
  plugins: []
};
