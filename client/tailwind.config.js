/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-black": "#22262A",
        "custom-light-black": "#2D3135",
        "custom-orange": "#FFC4A0",
        "custom-light-orange": "#FFEBDF",
        "custom-exlight-orange": "#FAFAFA",
        "custom-light-blue": "#EDF0F8",
      },
    },
  },
  plugins: [typography],
};
