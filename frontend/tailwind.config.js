export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: { ink: { 950: "#050505", 900: "#0a0a0b", 850: "#111113", 800: "#171719", 700: "#222225" }, ember: { 500: "#ef1d2f", 600: "#c91424", 700: "#9e0f1b" } },
      fontFamily: { display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"] },
      boxShadow: { glow: "0 0 34px rgba(239, 29, 47, 0.18)" }
    }
  },
  plugins: []
};
