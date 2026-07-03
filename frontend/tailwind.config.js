/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0F1A",
        "ink-2": "#10182B",
        paper: "#F5F3EE",
        slate: "#8B93A7",
        orange: "#FF6B35",
        cyan: "#4ECDC4",
        green: "#3ECF8E",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
