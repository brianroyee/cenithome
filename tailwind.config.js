/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        neutral: {
          950: '#0F131A', // Darkest text/bg
          900: '#1A202C', // Primary text
          800: '#2D3748', 
          700: '#4A5568', // Secondary text
          600: '#718096', 
          500: '#A0AEC0', 
          400: '#CBD5E0', 
          300: '#E2E8F0', 
          200: '#EDF2F7',
          100: '#F7FAFC', // Very light grey
          50:  '#F9FAFB', // Background
        },
        cenit: {
          blue: '#30557D', // Sampled Steel Blue from image
          light: '#53789E', // Lighter accent
          dark: '#1F3A56', // Darker accent
          accent: '#E6EFF8', // Very light blue for backgrounds
        }
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    }
  },
  plugins: [],
}
