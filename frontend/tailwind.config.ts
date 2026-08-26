import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-comfortaa)", "Comfortaa", "sans-serif"],
      },
      colors: {
        background: "#090D16",
        surface: "#0F172A",
        "surface-light": "#1E293B",
        primary: {
          DEFAULT: "#38BDF8",
          hover: "#0EA5E9",
          foreground: "#030712"
        },
        secondary: {
          DEFAULT: "#818CF8",
          foreground: "#FFFFFF"
        },
        accent: "#10B981",
        border: "rgba(255, 255, 255, 0.08)"
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "liquid-mesh": "radial-gradient(at 100% 0%, rgba(56, 189, 248, 0.15) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(129, 140, 248, 0.12) 0px, transparent 50%)",
      },
      animation: {
        "pulse-subtle": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 15px rgba(56, 189, 248, 0.2)" },
          "100%": { boxShadow: "0 0 30px rgba(56, 189, 248, 0.5)" },
        }
      }
    },
  },
  plugins: [],
};
export default config;