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
        brand: {
          50: "#f4f7ff",
          100: "#e5ecff",
          200: "#c8d7ff",
          300: "#a0b7ff",
          400: "#6e8cff",
          500: "#4460ff",
          600: "#2f42db",
          700: "#2433ac",
          800: "#1e2a88",
          900: "#1c266e",
          950: "#101434"
        }
      }
    }
  },
  plugins: []
};

export default config;
