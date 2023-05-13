/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily: {
      'fredoka': ['Fredoka'],
      'fredokaone': ['Fredoka One'],
      'lato':['Lato'],
      'roboto': ['Roboto'],
    }
  },
  plugins: [],
}