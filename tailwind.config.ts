import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        'poppins': ['var(--font-poppins)'],
      },
      colors : {
        "cash-green" : "#92E3A9",
        "cash-blue" : "#3B82F6",
        "cash-black" : "#1A1A1A",
        "cash-gray" : "#F9F9F9"
      }
    },
  },
  plugins: [],
};
export default config;
