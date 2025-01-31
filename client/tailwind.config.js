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
    animation: {
      bounceStop: 'bounceStop 1s ease-in-out 3',
      fadeInOut: 'fadeInOut 5s ease-in-out infinite', 
    },
    keyframes: {
      bounceStop: {
        '0%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-10px)' },
        '100%': { transform: 'translateY(0)' },
      },
      fadeInOut: {
        '0%': { opacity: 0 },
        '50%': { opacity: 1 },
        '100%': { opacity: 0 },
      },
    },

  },
  plugins: [],
}