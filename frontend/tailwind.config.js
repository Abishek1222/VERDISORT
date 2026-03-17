/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        verde: {
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
        },
        dark: {
          900: '#0a0a0a',
          800: '#171717',
          700: '#262626',
          600: '#404040',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
