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
        "ink-muted": "#5f5d57",
        paper: "#f7f7f4",
        "paper-deep": "#edede8",
        line: "#d9d7cf",
        brass: "#b89652"
      },
      boxShadow: {
        executive: "0 24px 80px rgba(17, 17, 16, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
