/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'medical': {
          50: '#f0f9f4',
          100: '#dcf3e5',
          200: '#b9e7cb',
          300: '#86d5a8',
          400: '#4fbc7f',
          500: '#10b981',  // Primary green
          600: '#059669',
          700: '#047857',
          800: '#045a42',
          900: '#064e3b',
        },
        'healthcare': {
          teal: '#14b8a6',
          blue: '#3b82f6',
          amber: '#f59e0b',
          red: '#dc2626',
        }
      },
    },
  },
  plugins: [],
};
