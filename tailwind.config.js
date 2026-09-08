import flowbite from 'flowbite/plugin';
import lightswind from 'lightswind/plugin';

export default {
  darkMode: 'media',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite-react/**/*.js",
    "./node_modules/flowbite/**/*.js",
    "./node_modules/lightswind/**/*.js", // lightswind-এর জন্য extra line
  ],
  theme: {
    extend: {
      colors: {
        // Kairali Match Makers brand palette
        maroon: {
          DEFAULT: '#7A1F2B',
          dark: '#5C1620',
        },
        gold: {
          DEFAULT: '#C89B3C',
          dark: '#A67C2E',
        },
        cream: '#FBF6EC',
        sand: '#EFE6D5',
        forest: '#2F4A3E',
        ink: '#2B211C',
      },
    },
  },
  plugins: [
    flowbite,
    lightswind, // add this line
  ],
}
