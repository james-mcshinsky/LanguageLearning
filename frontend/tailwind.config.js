module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg-primary)",
        text: "var(--text-primary)",
        primary: "var(--text-primary)",
        secondary: "var(--bg-secondary)",
        "text-secondary": "var(--text-secondary)",
        "accent-primary": "var(--accent-primary)",
        "accent-secondary": "var(--accent-secondary)",
        inverse: "var(--text-inverse)",
      },
      spacing: {
        xs: "var(--space-xs)",
        sm: "var(--space-sm)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
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
