import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Stealth dark theme
        charcoal: {
          DEFAULT: "#222222",
          deep: "#1A1A1A",
          soft: "#2B2B2B",
          line: "#333333",
        },
        // Muted neon accents (no aggressive red allowed)
        mint: {
          DEFAULT: "#7CE3B7",
          dim: "#56B894",
          glow: "#A6F0CE",
        },
        violet: {
          DEFAULT: "#8A6FD9",
          dim: "#6B54B0",
          glow: "#A892E8",
        },
        // Neutral text
        ash: {
          50: "#F5F5F5",
          200: "#C8C8C8",
          400: "#8A8A8A",
          600: "#5C5C5C",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        "glow-mint": "0 0 24px -4px rgba(124, 227, 183, 0.35)",
        "glow-violet": "0 0 24px -4px rgba(138, 111, 217, 0.35)",
      },
      animation: {
        "fade-in": "fadeIn 280ms ease-out",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
