/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-black": "#22262A",
        "custom-lightBlack": "#2D3135",
        "custom-light-orange": "#FFEBDF",
      },
    },
  },
  plugins: [],
};
