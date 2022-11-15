const withMT = require("@material-tailwind/react/utils/withMT");
/** @type {import('tailwindcss').Config} */

module.exports = withMT({
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        buttonPink: "#FF5896",
        buttonPinkHover: "#FF2576",
        textPinkHover: "#FF0C66",
        customDarkBlue: "#161C2E"
      },
      fontFamily: {
        manrope: ["Manrope", "sans-serif"]
      }
    }
  },
  plugins: []
});
