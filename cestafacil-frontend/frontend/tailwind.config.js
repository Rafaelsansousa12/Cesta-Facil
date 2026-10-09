/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary:  { DEFAULT: '#16a34a', light: '#22c55e', dark: '#15803d' },
        secondary:{ DEFAULT: '#ea580c', light: '#f97316', dark: '#c2410c' },
      }
    }
  },
  plugins: []
}
