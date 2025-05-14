/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            ul: {
              listStyleType: "disc",
              marginTop: "0.5em",
              marginBottom: "0.5em",
              paddingLeft: "1.625em",
              li: {
                marginTop: "0.25em",
                marginBottom: "0.25em",
              },
            },
            ol: {
              listStyleType: "decimal",
              marginTop: "0.5em",
              marginBottom: "0.5em",
              paddingLeft: "1.625em",
              li: {
                marginTop: "0.25em",
                marginBottom: "0.25em",
              },
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
