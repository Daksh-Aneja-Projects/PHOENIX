import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        border: "hsl(var(--border))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        primary: "hsl(var(--primary))",
        destructive: "hsl(var(--destructive))",
        phoenix: {
          cyan: "#22d3ee",
          green: "#34d399",
          amber: "#f59e0b",
          red: "#fb7185",
          violet: "#a78bfa"
        }
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"]
      },
      boxShadow: {
        glow: "0 0 40px rgba(34, 211, 238, 0.22)",
        danger: "0 0 45px rgba(251, 113, 133, 0.28)"
      }
    }
  },
  plugins: []
};

export default config;

