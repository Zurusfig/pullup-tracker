/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
      colors: {
        brand: {
          green: '#58CC02',
          purple: '#9333EA',
          blue: '#1CB0F6',
          orange: '#FF9600',
          red: '#FF4B4B',
          yellow: '#FFC800',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F7F7F7',
          dark: '#111827',
          card: '#1F2937',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
