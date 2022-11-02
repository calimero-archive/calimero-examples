/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontSize: {
      xs: ".75rem",
      sm: ".875rem",
      tiny: ".925rem",
      base: "1.125rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "4rem",
      "7xl": "5rem",
      "8xl": "6rem",
      "9xl": "7rem",
      "10xl": "8rem",
      "11xl": "9rem",
      "12xl": "10rem",
    },
    screens: {
      xs: "375px",
      // => @media (min-width: 375px) { ... }
      ssm: "390px",
      // => @media (min-width: 390px) { ... }

      ssmx: "530px",
      // => @media (min-width: 530px) { ... }

      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }

      hd: "1920px",
      // => @media (min-width: 1536px) { ... },

      "2hd": "2560px",
      // => @media (min-width: 1536px) { ... },
    },
    fontFamily: {
      inter: '"Inter"',
    },
    extend: {},
  },
  plugins: [],
};
