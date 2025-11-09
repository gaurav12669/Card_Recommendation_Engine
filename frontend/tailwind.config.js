module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sf-pro': ['Inter', 'system-ui', 'sans-serif'],
        'inter': ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        shine: {
          '0%': { transform: 'translateX(-100px)' },
          '100%': { transform: 'translateX(calc(100% + 100px))' }
        },
        'slide-up': {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(80px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          }
        }
      },
      animation: {
        shine: 'shine 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }
    },
  },
  plugins: [],
}
