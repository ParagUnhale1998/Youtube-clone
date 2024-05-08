/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode:'class',
  theme: {
    extend: {
      colors: {
        hovercolor: 'bg-slate-200',
      },
    },
    
    
  },
  plugins: [],
}