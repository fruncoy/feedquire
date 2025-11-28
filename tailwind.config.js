/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      width: {
        '15': '60px'
      },
      margin: {
        '15': '60px'
      }
    },
  },
  plugins: [],
}