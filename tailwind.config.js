/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        finance: {
          950: '#001438',
          900: '#00225E',
          850: '#002C78',
          800: '#003588',
          700: '#002E78', // Hover state
          600: '#003E9E', // Logo exact dark blue (#003E9E)
          500: '#0A3F9F', // Logo dark blue variant (#0A3F9F)
          400: '#1A59C4',
          300: '#4D82DD',
          200: '#94B4ED',
          100: '#DBE6F8',
          50: '#F0F5FD',
        },
        emerald: {
          900: '#064E3B',
          800: '#065F46',
          700: '#047857',
          600: '#059669',
          500: '#10B981',
          100: '#D1FAE5',
          50: '#ECFDF5',
        },
        amber: {
          900: '#78350F',
          800: '#92400E',
          700: '#B45309',
          600: '#D97706',
          500: '#F59E0B',
          100: '#FEF3C7',
          50: '#FFFBEB',
        },
        slate: {
          850: '#151F32',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 10px -2px rgba(15, 23, 42, 0.06), 0 1px 3px -1px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
        'dropdown': '0 10px 30px -5px rgba(15, 23, 42, 0.15)',
      }
    },
  },
  plugins: [],
}
