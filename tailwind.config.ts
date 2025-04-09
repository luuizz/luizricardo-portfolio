import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': {
          'light': '#FFF4BE',
          'default': '#FFD300',
          'dark': '#816B05',
        },
        'brand-gray': {
          100: "#F6F6F6",
          200: "#DDDDDA",
          300: "#C8C7C6",
          400: "#BDBDBA",
          500: "#9E9E9A",
          600: "#7A7A78",
          700: "#52514F",
          800: "#35342D",
          900: "#151203",
        }
      },
      fontFamily: {
        inter: ["var(--font-inter)", "sans-serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
      fontSize: {
        '4xl-short': '40px',
        '6xl-short': '56px',
      },
      maxWidth: {
        container: "77.875rem",
      },
      lineHeight: {
        'short': '120%',
        'large': '150%',
      },
      transitionProperty: {
        'top': 'top',
      },
      transitionTimingFunction: {
        'transition-project-cards': 'cubic-bezier(0.76, 0, 0.24, 1)',
      },
      scrollMargin: {
        'header': 'var(--header-height)'
      }
    },
  },
  plugins: [],
} satisfies Config;
