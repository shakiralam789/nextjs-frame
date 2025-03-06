/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          purple: '#5E35CC',
          light: '#F3F4F6'
        },
        gray: {
          icon: '#6B7280',
          text: '#374151',
          light: '#F9FAFB'
        },
        "body-color" : "#f3f4f6"
      }
    },
  },
  plugins: [],
};

export default tailwindConfig;
