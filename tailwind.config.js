/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    fontFamily: {
      SourceSan: ["Source Sans 3, sans-serif"],
      Mulish: ["Mulish, sans-serif"],
      Roboto: ["Roboto, sans-serif"],
    },

    extend: {
      fontSize: {
        custom: "calc(100vw / 20)", // Tạo fontSize tùy chỉnh
      },
      backgroundImage: {
        login: "url('/public/loginBackground.png')",
      },
      screens: {
        xsm: "500px",
        lgEqual: "992px",
        xxl: "1536px",
      },
      colors: {
        "red-rgba": "rgba(255, 0, 0, .1)",
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
