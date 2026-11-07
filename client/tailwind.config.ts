import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#0D0403',
          pure: '#080202',
          subtle: '#140705',
          card: '#1A0C09',
          cardHover: '#24110E',
          border: '#3E1D19',
          'border-light': '#52251E',
        },
        gold: {
          DEFAULT: '#F0B87A',
          hover: '#F3C48E',
          dim: '#C49156',
          muted: '#A67840',
          badge: '#FFE2B8',
          bg: '#2D1A10',
          border: '#54321C',
        },
        ink: {
          DEFAULT: '#F5E8DD',
          secondary: '#A88879',
          dim: '#856658',
          muted: '#5C4338',
          border: '#3E1D19',
        },
        coral: {
          DEFAULT: '#F0B87A',
          500: '#F0B87A',
          600: '#E0A86A',
        },
        brand: {
          DEFAULT: '#F0B87A',
          500: '#F0B87A',
          600: '#E0A86A',
        },
      },
      boxShadow: {
        'gold-glow': '0 0 35px -5px rgba(240, 184, 122, 0.35)',
        'gold-sm': '0 0 15px -2px rgba(240, 184, 122, 0.25)',
        'wine-glow': '0 20px 50px -15px rgba(62, 22, 18, 0.5)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.5), inset 0 1px 1px 0 rgba(255, 255, 255, 0.04)',
      },
      fontSize: {
        '2xs': ['0.78rem', { lineHeight: '1.2rem' }],
        'xs': ['0.875rem', { lineHeight: '1.3rem' }],
        'sm': ['0.965rem', { lineHeight: '1.45rem' }],
        'base': ['1.075rem', { lineHeight: '1.65rem' }],
        'lg': ['1.2rem', { lineHeight: '1.75rem' }],
        'xl': ['1.35rem', { lineHeight: '1.85rem' }],
        '2xl': ['1.65rem', { lineHeight: '2.15rem' }],
        '3xl': ['2.1rem', { lineHeight: '2.5rem' }],
        '4xl': ['2.75rem', { lineHeight: '3rem' }],
        '5xl': ['3.5rem', { lineHeight: '1.15' }],
        '6xl': ['4.25rem', { lineHeight: '1.1' }],
      },
      fontFamily: {
        sans: ['"Hanken Grotesk"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Newsreader"', 'Georgia', 'serif'],
        serif: ['"Newsreader"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
