module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        "primary-light": "var(--color-primary-light)",
        accent: "var(--color-accent)",
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        text: "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        success: "var(--color-success)",
        danger: "var(--color-danger)",
        inverse: "var(--color-inverse)",
      },
      spacing: {
        xxs: "var(--space-xxs)",
        xs: "var(--space-xs)",
        s: "var(--space-s)",
        m: "var(--space-m)",
        l: "var(--space-l)",
        xl: "var(--space-xl)",
        xxl: "var(--space-xxl)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        heading: ["var(--font-heading)", "sans-serif"],
      },
      fontSize: {
        sm: ["var(--text-sm)", { lineHeight: "1.4" }],
        base: ["var(--text-base)", { lineHeight: "1.6" }],
        h3: ["var(--text-h3)", { lineHeight: "1.4" }],
        h2: ["var(--text-h2)", { lineHeight: "1.3" }],
        h1: ["var(--text-h1)", { lineHeight: "1.2" }],
      },
    },
  },
  plugins: [],
};
