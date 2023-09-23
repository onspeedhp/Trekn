/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'work-sans': ['Work Sans', 'sans-serif'],
      },
      colors: {
        'dark-green': '#0D1606',
        'light-green': '#93E454',
        'medium-green': '#4C871E',
      },
    },
  },
  plugins: [],
};
