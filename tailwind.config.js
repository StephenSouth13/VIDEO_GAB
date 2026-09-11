/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gab-navy': '#0B132B',
        'gab-blue': '#1C2541',
        'gab-cyan': '#3A506B',
        'gab-cyan-light': '#5BC0BE',
        'gab-electric': '#00F0FF',
      }
    },
  },
  plugins: [],
}
