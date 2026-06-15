/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0b1120',
        panel: '#111827',
        panelAlt: '#1f2937',
        line: '#334155',
        accent: '#dc2626',
        accentSoft: '#b91c1c',
      },
      boxShadow: {
        glow: '0 8px 20px rgba(0, 0, 0, 0.18)',
      },
      backgroundImage: {
        'hero-glow': 'linear-gradient(180deg, #0b1120 0%, #0f172a 100%)',
      },
    },
  },
  plugins: [],
};
