/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      transitionProperty: {
        width: 'width'
      },
      gradientColorStops: {
        'gray-800': '#343541',
        'gray-900': '#202123'
      },
      backgroundColor: {
        'gray-700': '#40414F',
        'gray-800': '#343541',
        'gray-900': '#202123'
      },
      backgroundImage: {
        'vert-light-gradient':
          'linear-gradient(180deg,hsla(0,0%,100%,0) 13.94%,#fff 54.73%)',
        'vert-dark-gradient':
          'linear-gradient(180deg,rgba(53,55,64,0),#353740 58.85%)'
      }
    }
  }
}
