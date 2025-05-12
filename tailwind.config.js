import flowbite from "flowbite-react/tailwind";
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    './src/styles/**/*.css', 
    flowbite.content()
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#F6F8FF",
          100: "#EDF0FF",
          2: " #7B61FF",
          3: " #FFB836",
          DEFAULT: "#0C21C1",
        },
        secondary: {
          50: "#F9FAFB",
          100: "#F4F5F7",
          DEFAULT: "#97060B",
        },

       

        danger: {
          50: "#FFF7F7",
          100: "#FEEFEF",
          200: "#FCD6D7",
          300: "#FABBBD",
          400: "#F68B8D",
          500: "#F1595C",
          600: "#D75052",
          700: "#913638",
          800: "#6D292A",
          900: "#461A1B",
        },
        black: {
          50: "#F9FAFB",
          100: "#F4F5F7",
          200: "#E5E7EB",
          300: "#D2D6DC",
          400: "#9FA6B2",
          500: "#111112",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
        warning: {
          50: "#FFFAF8",
          100: "#FFF4F1",
          200: "#FEE4DA",
          300: "#FDD2C3",
          400: "#FCB298",
          500: "#FA916B",
          600: "#DF8260",
          700: "#965741",
          800: "#714231",
          900: "#492B20",
        },
        info: {
          50: "#F3FEFF",
          100: "#E7FEFF",
          200: "#C5FDFF",
          300: "#A3FCFF",
          400: "#5FF9FF",
          500: "#0CE7FA",
          600: "#00B8D4",
          700: "#007A8D",
          800: "#005E67",
          900: "#003F42",
        },
        success: {
          50: "#F3FEF8",
          100: "#E7FDF1",
          200: "#C5FBE3",
          300: "#A3F9D5",
          400: "#5FF5B1",
          500: "#50C793",
          600: "#3F9A7A",
          700: "#2E6D61",
          800: "#1F4B47",
          900: "#0F2A2E",
        },
        gray: {
          50: "#F9FAFB",
          100: "#F4F5F7",
          200: "#E5E7EB",
          300: "#D2D6DC",
          400: "#9FA6B2",
          500: "#68768A",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
      },

      // animation and key Frame
      keyframes: {
        bounce: {
          "0%, 100%": {
            transform: "translateY(-25%)",
            "animation-timing-function": "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "none",
            "animation-timing-function": "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' },
        },
        vibrate: {
          '0%': { transform: 'translateX(0)' },
          '10%': { transform: 'translateX(-10px)' },
          '20%': { transform: 'translateX(10px)' },
          '30%': { transform: 'translateX(-10px)' },
          '40%': { transform: 'translateX(10px)' },
          '50%': { transform: 'translateX(-10px)' },
          '60%': { transform: 'translateX(10px)' },
          '70%': { transform: 'translateX(-10px)' },
          '80%': { transform: 'translateX(10px)' },
          '90%': { transform: 'translateX(-10px)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        bounce: "bounce 1s infinite",
        shake: 'shake 0.8s cubic-bezier(.36,.07,.19,.97) both',
        vibrate: 'vibrate 0.5s linear',
      },
    },
  },
  plugins: [],
};
