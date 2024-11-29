// frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/styles/**/*.{css,scss}',
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      emerald: colors.emerald,
      indigo: colors.indigo,
      yellow: colors.yellow,

      kata: '#F2C288',
      kyoukin: '#616F8C',
      ude: '#A3B0D9',
      fukkin: '#F2A679',
      kahanshin: '#D99E89',

      kataH: '#7C6446',
      kyoukinH: '#363A48',
      udeH: '#5F6F8C',
      fukkinH: '#9B6A4D',
      kahanshinH: '#815E51',
      black1: '#000000',
      green1: '#AED036',
      bg: '#edeae1',
    },
    extend: {
      borderWidth: {
        'X': '3px',
      },
      boxShadow: {
          X: "3px 3px 0px rgba(0, 0, 0, 1)", // X軸 Y軸 ぼかしの量 RGBと透明度
      },
      backgroundImage: {
        'gra-green': 'linear-gradient(180deg, #AED036 0%, #AED036 87%, #79B535 87%, #79B535 100%)',
      },
    },
  },
  plugins: [require("tailwindcss-text-stroke")],
}



