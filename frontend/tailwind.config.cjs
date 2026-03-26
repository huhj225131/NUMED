/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ocean: {
          900: '#061c2f',
          800: '#0d2a45',
          700: '#123655',
        },
        nucleus: {
          500: '#14b8a6',
          400: '#2dd4bf',
          300: '#5eead4',
        },
      },
    },
  },
  plugins: [],
}
