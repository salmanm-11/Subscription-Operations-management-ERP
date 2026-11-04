/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          750: '#26334a',
          850: '#151d2f',
          950: '#070b13',
        },
        brand: {
          gold: '#f59e0b',
          dark: '#0b0f19',
          card: '#151c2c',
        }
      },
    },
  },
  plugins: [],
}
