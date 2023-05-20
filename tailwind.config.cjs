/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2b58de",
      },
    },
  },
  plugins: [require("@headlessui/tailwindcss"), require("tailwind-scrollbar")],
};

module.exports = config;
