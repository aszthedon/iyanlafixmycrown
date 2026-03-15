import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: "#BC5EFF",
          gold: "#E7AA51",
          charcoal: "#312A2C",
          bronze: "#BE794C",
          gray: "#4E484D",
          softGold: "#EEC672"
        }
      },
      borderRadius: { xl2: "1.25rem" },
      boxShadow: { soft: "0 10px 30px rgba(0,0,0,0.10)" }
    },
  },
  plugins: [],
} satisfies Config;
