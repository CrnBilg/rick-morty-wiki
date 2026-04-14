/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        portal: {
          green: '#00b5cc',
          lime: '#97ce4c',
          dark: '#0a0a0f',
          card: '#111827',
          border: '#1f2937',
        }
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'cursive'],
        body: ['"Nunito"', 'sans-serif'],
      },
      animation: {
        'portal-spin': 'portalSpin 8s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        portalSpin: {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(1.05)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #97ce4c, 0 0 20px #97ce4c40' },
          '100%': { boxShadow: '0 0 20px #97ce4c, 0 0 60px #97ce4c60' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'portal-gradient': 'radial-gradient(ellipse at center, #97ce4c20 0%, transparent 70%)',
        'card-gradient': 'linear-gradient(135deg, #111827 0%, #0f172a 100%)',
        'hero-gradient': 'linear-gradient(to bottom, #0a0a0f 0%, #0d1117 50%, #0a0a0f 100%)',
      }
    },
  },
  plugins: [],
}
