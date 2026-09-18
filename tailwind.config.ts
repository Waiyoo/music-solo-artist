//tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        artist: {
          deepRed: "#8B1E1E",
          richBrown: "#3D2314",
          warmCream: "#FBF7F2",
          sand: "#E6DCCD",
          earth: "#7A6553",
          charcoal: "#1A1A1A",
          mutedGold: "#C5A880",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "editorial-gradient": "linear-gradient(to bottom, rgba(26,26,26,0.8), rgba(61,35,20,0.9))",
      },
    },
  },
  plugins: [],
};

export default config;