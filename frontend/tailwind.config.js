/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: 0, transform: 'translateY(20px) scale(0.98)' },
          '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
        },
        'breathing-glow': {
          '0%, 100%': { opacity: '0.15' },
          '50%': { opacity: '0.3' },
        },
        'twinkle': {
          '0%, 100%': { opacity: '0.2', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.2)' },
        },
        'curved-horizon-pulse': {
          '0%, 100%': {
            opacity: '0.4',
            transform: 'translateX(-50%) translateY(0px)'
          },
          '50%': {
            opacity: '0.6',
            transform: 'translateX(-50%) translateY(-3px)'
          },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'breathing-glow': 'breathing-glow 4s ease-in-out infinite',
        'twinkle': 'twinkle 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'curved-horizon-pulse': 'curved-horizon-pulse 10s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
