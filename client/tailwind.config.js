/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:{
        100: "#fef3ea",
        200: "#242423",
        },
        secondary: {
          100: "#46b8b0",
          200: "#95ceca",
          300: "#f5ba43",
        },
      },
    },
    fontFamily: {
      body: ["Nunito"],
    },

  },
  plugins: [],
}