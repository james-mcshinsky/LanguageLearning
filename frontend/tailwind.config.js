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
    },
  },
  plugins: [],
};
