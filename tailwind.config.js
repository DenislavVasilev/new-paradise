/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2C3E50', // Rich navy blue
          light: '#34495E',
          dark: '#1A252F'
        },
        secondary: {
          DEFAULT: '#2ECC71', // Green
          light: '#27AE60',
          dark: '#27AE60'
        },
        accent: {
          DEFAULT: '#16A085', // Teal
          light: '#1ABC9C',
          dark: '#0E6655'
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
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif']
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