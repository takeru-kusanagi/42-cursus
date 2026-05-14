/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#000000',      
          surface: '#1E1E2E',
          accent: '#00BABC',
          purple: '#6246ea',
          victory: '#22c55e',
          defeat: '#ef4444',
        }
      },
    },
  },
  plugins: [],
}