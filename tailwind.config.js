/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4E8490",
        secondary: "#FF511C",
        light: "#F8F8F8",
        dark: "#404040",
        success: "#43A373",
        warning: "#F0AD4E",
        danger: "#DC3545",
        completed: "yellow",
        queue: "lightpink",
      },
      animation: {
        "fade-in": 'fadeIn .5s ease-in-out',
        "fade-out": 'fadeOut .5s ease-in-out',
        "pulse-soft": 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;'
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        fadeOut: {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        pulseSoft: {
          '0%, 100%': { opacity: "1" },
          '50%': { opacity: "0.7" }
        }
      },
    },
  },
  darkMode: "class",
  plugins: [],
}

