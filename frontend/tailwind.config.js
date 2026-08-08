const plum = {
  50: '#f9f3fa',
  100: '#f1e4f2',
  200: '#e3cbe5',
  300: '#cdaaca',
  400: '#af80ae',
  500: '#925c93',
  600: '#754373',
  700: '#61355e',
  800: '#502c4d',
  900: '#422640',
  950: '#281426',
};

const peach = {
  50: '#fff6f1',
  100: '#ffe9de',
  200: '#fbd2bf',
  300: '#f3b092',
  400: '#e58d69',
  500: '#d07452',
  600: '#b45a3d',
  700: '#944632',
  800: '#793a2f',
  900: '#64322a',
  950: '#361812',
};

const signal = {
  50: '#f0fdf4',
  100: '#dcfce7',
  200: '#bbf7d0',
  300: '#86efac',
  400: '#4ade80',
  500: '#22c55e',
  600: '#16a34a',
  700: '#15803d',
  800: '#166534',
  900: '#14532d',
  950: '#052e16',
};

const semanticRole = (name, scale = {}) => ({
  ...scale,
  DEFAULT: `rgb(var(--color-${name}) / <alpha-value>)`,
  text: `rgb(var(--color-${name}-text) / <alpha-value>)`,
});

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        xs: '480px',
      },
      colors: {
        brand: plum,
        primary: semanticRole('primary', plum),
        accent: peach,
        signal,
        technical: semanticRole('technical', peach),
        creative: semanticRole('creative'),
        dream: semanticRole('dream'),
        'dream-soft': 'rgb(var(--color-dream-soft) / <alpha-value>)',
        rose: semanticRole('rose'),
        glow: 'rgb(var(--color-glow) / <alpha-value>)',
        glass: 'rgb(var(--color-glass) / <alpha-value>)',
        success: semanticRole('success'),
        highlight: semanticRole('highlight'),
        canvas: {
          DEFAULT: 'rgb(var(--color-canvas) / <alpha-value>)',
          subtle: 'rgb(var(--color-canvas-subtle) / <alpha-value>)',
        },
        surface: {
          DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
          muted: 'rgb(var(--color-surface-muted) / <alpha-value>)',
          raised: 'rgb(var(--color-surface-raised) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--color-text) / <alpha-value>)',
          muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
          subtle: 'rgb(var(--color-text-subtle) / <alpha-value>)',
          inverse: 'rgb(var(--color-text-inverse) / <alpha-value>)',
        },
        line: {
          DEFAULT: 'rgb(var(--color-border) / <alpha-value>)',
          strong: 'rgb(var(--color-border-strong) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'rgb(var(--color-surface-muted) / <alpha-value>)',
          foreground: 'rgb(var(--color-text-muted) / <alpha-value>)',
        },
        focus: 'rgb(var(--color-focus) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"Aptos Display"', '"Segoe UI Variable Display"', '"Trebuchet MS"', 'sans-serif'],
        sans: ['"Aptos"', '"Segoe UI Variable Text"', '"Segoe UI"', 'sans-serif'],
        mono: ['"Cascadia Code"', '"SFMono-Regular"', 'Consolas', '"Liberation Mono"', 'monospace'],
      },
      fontSize: {
        display: [
          'clamp(2.75rem, 7vw, 5.75rem)',
          { lineHeight: '0.96', letterSpacing: '-0.055em', fontWeight: '700' },
        ],
        section: [
          'clamp(2rem, 4.5vw, 3.75rem)',
          { lineHeight: '1.02', letterSpacing: '-0.04em', fontWeight: '650' },
        ],
        title: [
          'clamp(1.5rem, 3vw, 2.25rem)',
          { lineHeight: '1.15', letterSpacing: '-0.025em', fontWeight: '650' },
        ],
        lead: [
          'clamp(1.0625rem, 1.8vw, 1.25rem)',
          { lineHeight: '1.7', letterSpacing: '-0.01em' },
        ],
      },
      spacing: {
        section: 'clamp(4.5rem, 9vw, 8rem)',
        'section-sm': 'clamp(3rem, 6vw, 5rem)',
        'section-lg': 'clamp(6rem, 12vw, 10rem)',
      },
      maxWidth: {
        site: '72rem',
        'site-wide': '82rem',
        reading: '68ch',
      },
      borderRadius: {
        card: '1.75rem',
        control: '0.875rem',
        panel: '2.25rem',
      },
      boxShadow: {
        soft: '0 18px 55px -28px rgb(var(--color-glow) / 0.38)',
        surface: '0 28px 80px -40px rgb(var(--color-dream) / 0.48)',
        glow: '0 0 0 1px rgb(var(--color-dream) / 0.14), 0 24px 72px -34px rgb(var(--color-glow) / 0.58)',
        glass: 'inset 0 1px 0 rgb(255 255 255 / 0.26), 0 24px 64px -36px rgb(var(--color-dream) / 0.42)',
      },
      lineHeight: {
        16: '4rem',
      },
      transitionDelay: {
        2000: '2000ms',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: 0, transform: 'translateY(20px) scale(0.98)' },
          '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
        },
        'breathing-glow': {
          '0%, 100%': { opacity: '0.15' },
          '50%': { opacity: '0.3' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'marquee-vertical': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-100%)' },
        },
        'curved-horizon-pulse': {
          '0%, 100%': {
            opacity: '0.4',
            transform: 'translateX(-50%) translateY(0px)',
          },
          '50%': {
            opacity: '0.6',
            transform: 'translateX(-50%) translateY(-3px)',
          },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'breathing-glow': 'breathing-glow 4s ease-in-out infinite',
        twinkle: 'twinkle 2s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        marquee: 'marquee var(--duration, 40s) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration, 40s) linear infinite',
        'curved-horizon-pulse': 'curved-horizon-pulse 10s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
