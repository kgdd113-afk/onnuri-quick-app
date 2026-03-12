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
          50: "#eef8f5",
          100: "#d6efe8",
          200: "#addfd0",
          300: "#7ac9b4",
          400: "#4cb095",
          500: "#2f947a",
          600: "#237761",
          700: "#1f5f4f",
          800: "#1b4c41",
          900: "#173f36"
        },
        slategreen: "#f3f8f6",
        ink: "#1f2937",
        steel: "#5b6777"
      },
      boxShadow: {
        panel: "0 18px 40px rgba(20, 51, 43, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
