/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "600px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    extend: {
      fontSize: {
        custom: "calc(100vw / 20)", // Tạo fontSize tùy chỉnh
      },
      backgroundImage: {
        login: "url('/public/loginBackground.png')",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".scrollbar-none": {
          "scrollbar-width": "none" /* Firefox */,
          "-ms-overflow-style": "none" /* Internet Explorer 10+ */,
          "&::-webkit-scrollbar": {
            display: "none" /* Chrome, Safari, Opera */,
          },
        },
      };

      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
  corePlugins: {
    preflight: false,
  },
  important: "#app",
};
