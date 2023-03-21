const withMT = require("@material-tailwind/react/utils/withMT");
/** @type {import('tailwindcss').Config} */

module.exports = withMT({
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        customPink: `var(--color-custom-pink)`,
        customDarkBlue: `var(--color-custom-dark-blue)`,
        customBlue: `var(--color-custom-blue)`,
        customLightBlue: `var(--color-custom-light-blue)`,
        customGrey: `var(--color-custom-grey)`,
        customDarkGrey: `var(--color-custom-dark-grey)`,
        customGraphGrey: `var(--color-custom-graph-grey)`,
        customPristineWhite: `var(--color-custom-pristine-white)`,
        customPopupGrey: `var(--color-custom-popup-grey)`
      },
      boxShadow: {
        card: "0px 0px 12px rgba(63, 125, 204, 0.12)",
        table: "0px 0px 6px 6px rgba(63,125,204, 0.08)"
      },
      fontFamily: {
        manrope: ["Manrope", "sans-serif"]
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
