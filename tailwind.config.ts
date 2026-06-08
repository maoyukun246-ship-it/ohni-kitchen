import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#fff7ea",
        milk: "#fffdf8",
        butter: "#ffdca3",
        honey: "#ffad45",
        caramel: "#b8662e",
        wood: "#d79256",
        mint: "#91cfa5",
        tea: "#6b442d",
        linen: "#f4e4cc",
        kimchi: "#dc663b",
      },
      boxShadow: {
        warm: "0 18px 50px rgba(179, 101, 38, 0.16)",
        insetWarm: "inset 0 1px 0 rgba(255,255,255,0.72)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Microsoft YaHei",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [animate],
} satisfies Config;
