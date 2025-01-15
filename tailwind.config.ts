import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceScale: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        glow: {
          '0%, 100%': {
            filter: 'drop-shadow(0 0 2px rgba(59, 130, 246, 0.2))',
          },
          '50%': {
            filter: 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.8))',
          },
        },
      },
      colors: {
        healthcare: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#b9e6fe',
          300: '#7cd4fd',
          400: '#36bffa',
          500: '#0ba5ec',
          600: '#0086c9',
          700: '#026aa2',
          800: '#065986',
          900: '#0b4a6f',
          950: '#082f4d',
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
        slideDown: 'slideDown 0.5s ease-out',
        slideUp: 'slideUp 0.5s ease-out',
        'bounce-scale': 'bounceScale 2s ease-in-out infinite',
        glow: 'glow 4s ease-in-out 4',
      },
    },
  },
  plugins: [],
};

export default config;
