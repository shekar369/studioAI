/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium Dark Studio Theme
        studio: {
          950: '#0a0a0f',
          900: '#12121a',
          850: '#1a1a28',
          800: '#1f1f2e',
          700: '#2a2a3e',
          600: '#3a3a52',
          500: '#4a4a66',
          400: '#6b6b8a',
        },
        // Electric Accent Colors
        electric: {
          purple: {
            50: '#f4f0ff',
            100: '#ebe5ff',
            200: '#d9ccff',
            300: '#bfa3ff',
            400: '#9d70ff',
            500: '#7c3aed',
            600: '#6d28d9',
            700: '#5b21b6',
            800: '#4c1d95',
            900: '#3b1570',
          },
          blue: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
          },
          indigo: {
            500: '#6366f1',
            600: '#4f46e5',
            700: '#4338ca',
          },
          pink: {
            500: '#ec4899',
            600: '#db2777',
          },
        },
        // Legacy support
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#3b82f6',
          600: '#2563eb',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#faf5ff',
          500: '#a855f7',
          900: '#581c87',
        },
        accent: {
          pink: '#ec4899',
          purple: '#8b5cf6',
          indigo: '#6366f1',
        },
      },
      fontFamily: {
        primary: ['Inter', 'sans-serif'],
        heading: ['Manrope', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-studio': 'linear-gradient(135deg, #1a1a28 0%, #0a0a0f 100%)',
        'gradient-purple': 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
        'gradient-electric': 'linear-gradient(135deg, #6366f1 0%, #7c3aed 50%, #ec4899 100%)',
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(124, 58, 237, 0.3)',
        'glow': '0 0 30px rgba(124, 58, 237, 0.4)',
        'glow-lg': '0 0 50px rgba(124, 58, 237, 0.5)',
        'electric': '0 0 30px rgba(99, 102, 241, 0.4)',
        'studio': '0 10px 40px rgba(0, 0, 0, 0.5)',
        'studio-lg': '0 20px 60px rgba(0, 0, 0, 0.6)',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient-shift': 'gradient-shift 15s ease infinite',
        'border-glow': 'border-glow 2s ease-in-out infinite',
        'scale-in': 'scale-in 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.4s ease-out',
        'slide-in-left': 'slide-in-left 0.4s ease-out',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(124, 58, 237, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(124, 58, 237, 0.8)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'border-glow': {
          '0%, 100%': { borderColor: 'rgba(124, 58, 237, 0.3)' },
          '50%': { borderColor: 'rgba(124, 58, 237, 0.8)' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(20px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-20px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
