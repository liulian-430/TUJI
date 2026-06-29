/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#ec4899',
        textPrimary: '#1e293b',
        textSecondary: '#64748b',
        textLight: '#94a3b8',
        bg: '#f8fafc',
        border: '#e2e8f0',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'float-up': 'floatUp 3s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        floatUp: {
          '0%': { transform: 'translateY(0) translateX(-50%)', opacity: '0.6' },
          '100%': { transform: 'translateY(-120px) translateX(-50%)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
