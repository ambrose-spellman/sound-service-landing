/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./modal1.html",
    "./modal2.html",
    "./contacts.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ["Montserrat", "sans-serif"],
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
      },
    },
    extend: {
      colors: {
        bgc: "#080808",
        main: "#362000",
        silver: "#D7D7D7",
        primary: "#FAC114",
        success: "#84CE25",
        danger: "#EB5757",
        secondary: "#C1C1C1",
        "text-yellow": "#A89C78",
        "titile-yellow": "#FFF6DB",
      },
    },
  },
  plugins: [],
};
