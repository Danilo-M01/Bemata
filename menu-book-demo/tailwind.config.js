/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        editorial: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        taupe: {
          50: '#9a9590',
          100: '#8a8580',
          200: '#6f6a66',
          300: '#5c5754',
          400: '#4a4643',
          500: '#3d3a38',
          600: '#32302e',
          700: '#2a2826',
          800: '#221f1d',
          900: '#1a1816',
        },
        cream: {
          page: '#f4f1ea',
          ink: '#1a1a1a',
        },
      },
      boxShadow: {
        book: '0 25px 50px -12px rgba(0, 0, 0, 0.45), 0 12px 24px -8px rgba(0, 0, 0, 0.35)',
        'book-soft': '0 18px 40px -15px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
};
