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
      }
    },
  },
  plugins: [],
}

