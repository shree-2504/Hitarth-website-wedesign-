import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#E7D4BB',
        'paper-2': '#CAB8A0',
        ink: '#101211',
        muted: '#645746',
        line: 'rgba(133, 120, 97, 0.35)',
        accent: {
          DEFAULT: '#48252F',
          dim: '#2E1620',
          light: '#C48F98',
        },
      },
      fontFamily: {
        display: ["'Century Gothic'", 'var(--font-jost)', 'sans-serif'],
        sans: ["'Century Gothic'", 'var(--font-jost)', 'sans-serif'],
        mono: ['var(--font-plexmono)', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
