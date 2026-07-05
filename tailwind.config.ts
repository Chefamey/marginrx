import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111110",
        "ink-soft": "#24231f",
        "ink-muted": "#63635d",
        paper: "#f8faf7",
        "paper-deep": "#edf2ee",
        line: "#d8dfd9",
        brass: "#b89652",
        jade: "#0f9f6e",
        cobalt: "#2458db",
        ruby: "#d6285f",
        signal: "#16a3a3"
      },
      boxShadow: {
        executive: "0 24px 80px rgba(17, 17, 16, 0.12)",
        command: "0 28px 90px rgba(15, 159, 110, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
