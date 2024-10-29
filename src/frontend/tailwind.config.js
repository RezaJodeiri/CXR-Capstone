/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        error: "#D23955",
        primary: "#3C7187",
        primaryHover: "#4C92AE",
        secondary: "#68B0E7",
        secondaryHover: "#90C9F4",
      },
    },
  },
  plugins: [],
};
