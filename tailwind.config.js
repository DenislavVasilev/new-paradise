/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2d5a3d', // Forest green
          light: '#4a7c59',
          dark: '#1a3d26'
        },
        secondary: {
          DEFAULT: '#d4a574', // Gold
          light: '#e6c299',
          dark: '#b8860b'
        },
        accent: {
          DEFAULT: '#4a7c59', // Light green
          light: '#6b9c7a',
          dark: '#2d5a3d'
        },
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827'
        }
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Poppins', 'Georgia', 'serif']
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      transitionDuration: {
        '300': '300ms',
      },
      height: {
        'screen-90': '90vh',
      }
    },
  },
  plugins: [],
};