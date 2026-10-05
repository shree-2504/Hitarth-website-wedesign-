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

        // Secondary text. Measured against the *rendered* ground rather than
        // the paper token, because the concrete background shows through the
        // sections: that ground is 210, not 242. The palette's own grey
        // swatch reaches only 3.1:1 there. This is 5.42:1.
        muted: '#4E4F51',

        // LIGHT GREY, only 1.93:1 on stone, so it is hairlines and dividers
        // rather than anything that has to be read.
        line: 'rgba(175, 174, 172, 0.6)',

        // Stone grey is the one colour in the set with a hue, so it takes the
        // accent role. Carried deeper than the swatch for the same reason as
        // `muted`: the concrete ground is 210, where the swatch itself manages
        // only 3.2:1.
        accent: {
          // 5.38:1 on the rendered ground, 8.13:1 as a button behind white.
          DEFAULT: '#475157',
          // Darker than DEFAULT, for hover and pressed states.
          dim: '#394247',
          // The swatch itself, which is the readable tone on black (7.15:1).
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
