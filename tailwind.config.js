/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        hovercolor: 'bg-slate-200',
        // Background colors
        'youtube-bg': '#181818', // Main background color
        'youtube-bg-secondary': '#212121', // Secondary background color

        // Text colors
        'youtube-text-primary': '#FFFFFF', // Primary text color
        'youtube-text-secondary': '#B3B3B3', // Secondary text color
        'youtube-text-placeholder': '#757575', // Placeholder text color

        // Accent colors
        'youtube-red': '#FF0000', // Red color used for buttons, icons, etc.
        'youtube-blue': '#0666CC', // Blue color used for links, buttons, etc.
        'youtube-grey': '#909090', // Grey color used for icons, text, etc.

        // Other colors
        'youtube-border': '#2D2D2D', // Border color
        'youtube-divider': '#4F4F4F', // Divider color
        'youtube-overlay': 'rgba(0,0,0,0.6)' // Overlay color for modals, dialogs, etc.
      },
    },


  },
  plugins: [],
}