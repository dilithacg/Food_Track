/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#f4f1ea",
          card: "#fcfaf7",
          primary: "#166534", // green-800
        }
      },
      borderRadius: {
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
};