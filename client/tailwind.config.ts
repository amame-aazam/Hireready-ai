import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#FFFAF7',
          pure: '#FFFFFF',
          subtle: '#FFF5F0',
          muted: '#F8EFEA',
        },
        ink: {
          DEFAULT: '#0A0706',
          secondary: '#6B544A',
          dim: '#8C7268',
          border: '#F2DDD2',
          'border-strong': '#E8CBBE',
        },
        coral: {
          50: '#FFF5F0',
          100: '#FFEBE1',
          200: '#FFD7C5',
          300: '#FFB896',
          400: '#FF976B',
          500: '#FF7A48',
          600: '#F05A24',
          700: '#C74112',
          800: '#96300B',
          900: '#5C1D06',
        },
        brand: {
          50: '#FFF5F0',
          100: '#FFEBE1',
          200: '#FFD7C5',
          300: '#FFB896',
          400: '#FF976B',
          500: '#FF7A48',
          600: '#F05A24',
          700: '#C74112',
          800: '#96300B',
          900: '#5C1D06',
        },
        crimson: {
          50: '#FFF5F0',
          100: '#FFEBE1',
          200: '#FFD7C5',
          300: '#FFB896',
          400: '#FF976B',
          500: '#FF7A48',
          600: '#F05A24',
          700: '#C74112',
          800: '#96300B',
          900: '#5C1D06',
        },
      },
      boxShadow: {
        'sakshaat': '0 24px 60px -34px rgba(240, 100, 50, 0.25)',
        'subtle': '0 4px 20px -2px rgba(107, 84, 74, 0.06)',
        'card': '0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 3px 0 rgba(0, 0, 0, 0.03)',
        'card-hover': '0 12px 30px -10px rgba(240, 100, 50, 0.18)',
      },
      fontFamily: {
        sans: ['"Hanken Grotesk"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Newsreader"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
