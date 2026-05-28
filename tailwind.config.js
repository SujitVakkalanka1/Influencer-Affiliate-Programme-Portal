/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0a0a0a',
        panel: '#111111',
        panelAlt: '#171717',
        line: '#242424',
        accent: '#e50914',
        accentSoft: '#ff4a52',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(229, 9, 20, 0.18), 0 20px 60px rgba(0, 0, 0, 0.45)',
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(circle at top, rgba(229, 9, 20, 0.22), transparent 42%), radial-gradient(circle at 80% 20%, rgba(255, 74, 82, 0.12), transparent 18%)',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        floatSlow: 'floatSlow 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
