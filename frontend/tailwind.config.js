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

      kata: '#ec8b62',
      kyoukin: '#F6AB49',
      ude: '#CBD69D',
      fukkin: '#59CAB3',
      kahanshin: '#EE9CAD',

      kataH: '#7C6446',
      kyoukinH: '#363A48',
      udeH: '#5F6F8C',
      fukkinH: '#9B6A4D',
      kahanshinH: '#815E51',

      disable: '#d5d5d5',
      success: '#262626',
      purple: '#A4A1D7',
      black1: '#262626',
      green1: '#262626',
      green2: '#262626',
      bgbg: '#F3EDDD',
      hover: '#626262',
    },
    extend: {
      borderWidth: {
        'X': '3px',
      },
      boxShadow: {
        X: "3px 3px 0px rgba(0, 0, 0, 1)", // X軸 Y軸 ぼかしの量 RGBと透明度
        B: "4px 4px 0px rgba(192, 192, 192, 1)", // X軸 Y軸 ぼかしの量 RGBと透明度
      },
      backgroundImage: {
        'button': 'linear-gradient(180deg, #000 0%, #000 100%)',
        'gra-green': 'linear-gradient(180deg, #262626 0%, #262626 87%, #626262 87%, #626262 100%)',
        'gra-gray': 'linear-gradient(180deg, #FFF 0%, #FFF 87%, #c0c0c0 87%, #c0c0c0 100%)',
        'medal30': 'linear-gradient(162deg, rgba(200,185,43,1) 37%, rgba(231,200,15,1) 45%)',
        'bg': `
          linear-gradient(
            180deg,
            #EC8B62 0%, #EC8B62 19.8%,
            black 19.8%, black 20%,
            #F6AB49 20%, #F6AB49 39.8%,
            black 39.8%, black 40%,
            #CBD69D 40%, #CBD69D 59.8%,
            black 59.8%, black 60%,
            #59CAB3 60%, #59CAB3 79.8%,
            black 79.8%, black 80%,
            #EE9CAD 80%, #EE9CAD 100%
          )
        `,
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(1.0)', opacity: '0' },
          '30%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        pop: 'pop 0.5s ease-out',
      },
    },
  },
  plugins: [require("tailwindcss-text-stroke")],


  
}



