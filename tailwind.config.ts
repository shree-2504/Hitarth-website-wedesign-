import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      // Brand identity palette, sampled from the swatch sheet. Contrast was
      // measured against both grounds before anything was assigned.
      colors: {
        // STONE — the light ground.
        paper: '#F2EFEA',
        // The light-grey swatch, a step down for secondary bands and the
        // contour gradient's far stop.
        'paper-2': '#CAC9C7',
        // The stone swatch, pure white, for type and marks on the dark.
        'paper-hi': '#FFFFFF',

        // BLACK — the dark ground.
        ink: '#000000',
        // GREY — secondary dark sections, a step up from black.
        'ink-2': '#3F4042',

        // Secondary text on stone. The grey swatch lands at 4.39:1, just under
        // the floor, so body copy takes this instead — 5.17:1.
        // Deepened when the concrete background brought the effective ground
        // from 237 down to 224: the previous value fell to 4.49:1, a hair
        // under the floor. Now 4.99:1.
        muted: '#5C5D5F',

        // LIGHT GREY, only 1.93:1 on stone, so it is hairlines and dividers
        // rather than anything that has to be read.
        line: 'rgba(175, 174, 172, 0.6)',

        // STONE GREY is the one colour in the set with a hue, and it clears
        // the bar on both grounds — 4.87:1 on stone, and 5.58:1 as a button
        // ground behind white. So it takes the accent role outright.
        accent: {
          // Stone grey, carried a shade deeper for the same reason as `muted`:
          // against the 224 ground the swatch value measured 4.23:1. Now
          // 4.95:1, and 6.54:1 as a button behind white.
          DEFAULT: '#555F65',
          dim: '#4A555A',
          // The stone-grey swatch, which is the readable tone on black
          // (7.15:1).
          light: '#8A99A0',
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
