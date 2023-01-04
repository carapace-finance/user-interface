const withMT = require("@material-tailwind/react/utils/withMT");
/** @type {import('tailwindcss').Config} */

module.exports = withMT({
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        customPink: "#FF639F",
        customDarkBlue: "#161C2E",
        customBlue: "#293C8E",
        customLightBlue: "#2B69F5",
        customGrey: "#6E7191",
        customDarkGrey: "#14142B",
        customGraphGrey: "#B8B8B8",
        customPristineWhite: "#F9F9FF",
        customPopupGrey: "#87898E"
      },
      boxShadow: {
        boxShadow: "0px 0px 12px rgba(63, 125, 204, 0.12)"
      },
      fontFamily: {
        manrope: ["Manrope", "sans-serif"]
      },
      boxShadow: {
        table: "0px 0px 6px 6px rgba(63,125,204, 0.08)"
      },
      width: {
        700: "700px",
        600: "600px",
        450: "450px",
        550: "550px",
        450: "450px",
        400: "400px"
      }
    }
  },
  plugins: []
});
