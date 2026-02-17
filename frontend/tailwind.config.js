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
          primary: '#1A2B23', // Deep dark navy/green from logo
          secondary: '#344E41', // Dark green from logo
          accent: '#C5A059', // Gold from logo text
          light: '#F5F1E3', // Cream/off-white from logo text
          bg: '#F8F9FA' // Light grey for main content
        }
      }
    },
  },
  plugins: [],
}
