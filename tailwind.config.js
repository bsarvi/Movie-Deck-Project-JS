/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js,css}"],
  theme: {
    extend: {
      colors: {
        "primary-600": "#000",
        "primary-500": "#121212",
        "primary-400": "#212121",
        "primary-300": "#535353",
        "primary-200": "#b3b3b3",
        "primary-100": "#fff",
        accent: "#1db954",
      },
    },
  },
  plugins: [],
};
