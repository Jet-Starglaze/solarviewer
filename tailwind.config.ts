import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#020617",
        aurora: "#7dd3fc"
      },
      boxShadow: {
        panel: "0 22px 80px rgba(2, 6, 23, 0.48)"
      }
    }
  },
  plugins: []
};

export default config;
