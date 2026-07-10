import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        grass: {
          50:  "#f0fdf0",
          100: "#dcfcdc",
          200: "#bbf7bb",
          300: "#86ef86",
          400: "#4ade4a",
          500: "#22c522",
          600: "#16a316",
          700: "#158015",
          800: "#166516",
          900: "#145314",
          950: "#052e05",
        },
        brand: {
          primary:  "#2E7D32",
          light:    "#4CAF50",
          dark:     "#1B5E20",
          accent:   "#8BC34A",
          terra:    "#795548",
          sand:     "#F5F0E8",
        },
        stone: {
          50:  "#fafaf9",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c",
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917",
          950: "#0c0a09",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "fade-in":    "fadeIn 0.5s ease-in-out",
        "slide-up":   "slideUp 0.4s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        shimmer:      "shimmer 1.5s infinite",
      },
      keyframes: {
        fadeIn:    { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp:   { from: { transform: "translateY(20px)", opacity: "0" }, to: { transform: "translateY(0)", opacity: "1" } },
        slideDown: { from: { transform: "translateY(-10px)", opacity: "0" }, to: { transform: "translateY(0)", opacity: "1" } },
        shimmer:   { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
      backgroundImage: {
        "grass-gradient": "linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)",
        "hero-overlay":   "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)",
        "shimmer-gradient": "linear-gradient(90deg, #f0fdf0 25%, #dcfcdc 50%, #f0fdf0 75%)",
      },
      boxShadow: {
        card:  "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)",
        "card-hover": "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
        grass: "0 4px 14px 0 rgba(46,125,50,0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
