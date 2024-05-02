/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens:{
        "3xl": "1920px"
      },
      colors: {
        primary: {
          '50': '#f3f8f8',
          '100': '#dfecee',
          '200': '#c3dade',
          '300': '#99c0c7',
          '400': '#689ea8',
          DEFAULT: '#4e8490',
          '500': '#4e8490',
          '600': '#426b78',
          '700': '#3b5a63',
          '800': '#364c54',
          '900': '#304149',
          '950': '#1d292f',
        },
        secondary: {
          '50': '#fff4ed',
          '100': '#ffe5d4',
          '200': '#ffc8a8',
          '300': '#ffa170',
          '400': '#ff6e37',
          DEFAULT: "#ff511c",
          '500': '#ff511c',
          '600': '#f02d06',
          '700': '#c71d07',
          '800': '#9e190e',
          '900': '#7f180f',
          '950': '#450805',
        },
        light: "#F5F5F5",
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

