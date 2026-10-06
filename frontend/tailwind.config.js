/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ─── Color tokens from UX mockups ─────────────────────────────────
      colors: {
        // Primary — blue
        primary: {
          DEFAULT: '#0048c9',
          container: '#1e60f3',
          fixed: '#dbe1ff',
          'fixed-dim': '#b5c4ff',
        },
        'on-primary': {
          DEFAULT: '#ffffff',
          container: '#edeeff',
          fixed: '#00174d',
          'fixed-variant': '#003cab',
        },

        // Secondary — slate-blue
        secondary: {
          DEFAULT: '#565e74',
          container: '#dae2fd',
          fixed: '#dae2fd',
          'fixed-dim': '#bec6e0',
        },
        'on-secondary': {
          DEFAULT: '#ffffff',
          container: '#5c647a',
          fixed: '#131b2e',
          'fixed-variant': '#3f465c',
        },

        // Tertiary — green
        tertiary: {
          DEFAULT: '#006141',
          container: '#007c55',
          fixed: '#6ffbbe',
          'fixed-dim': '#4edea3',
        },
        'on-tertiary': {
          DEFAULT: '#ffffff',
          container: '#b5ffd7',
          fixed: '#002113',
          'fixed-variant': '#005236',
        },

        // Surface
        surface: {
          DEFAULT: '#f8f9ff',
          dim: '#cbdbf5',
          bright: '#f8f9ff',
          tint: '#0051df',
          container: {
            DEFAULT: '#e5eeff',
            lowest: '#ffffff',
            low: '#eff4ff',
            high: '#dce9ff',
            highest: '#d3e4fe',
          },
        },
        'on-surface': {
          DEFAULT: '#0b1c30',
          variant: '#434655',
        },

        // Background
        background: '#f8f9ff',
        'on-background': '#0b1c30',

        // Outline
        outline: {
          DEFAULT: '#737687',
          variant: '#c3c5d8',
        },

        // Error
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
        },
        'on-error': {
          DEFAULT: '#ffffff',
          container: '#93000a',
        },

        // Inverse
        'inverse-surface': '#213145',
        'inverse-on-surface': '#eaf1ff',
        'inverse-primary': '#b5c4ff',
      },

      // ─── Border radius ─────────────────────────────────────────────────
      borderRadius: {
        DEFAULT: '0.25rem',
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px',
      },

      // ─── Spacing tokens ────────────────────────────────────────────────
      spacing: {
        'space-2xs': '0.25rem',
        'space-xs': '0.5rem',
        'space-sm': '0.75rem',
        'space-md': '1rem',
        'space-lg': '1.5rem',
        'space-xl': '2rem',
        'space-2xl': '3rem',
        gutter: '1.5rem',
        'gutter-mobile': '0.75rem',
        margin: '2rem',
        'margin-mobile': '1rem',
      },

      // ─── Typography ────────────────────────────────────────────────────
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-jakarta)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        'display-hero': ['40px', { lineHeight: '48px', letterSpacing: '-0.02em', fontWeight: '800' }],
        'headline-xl': ['28px', { lineHeight: '36px', letterSpacing: '-0.015em', fontWeight: '700' }],
        'headline-lg': ['20px', { lineHeight: '28px', fontWeight: '700' }],
        'headline-md': ['16px', { lineHeight: '24px', fontWeight: '600' }],
        'label-lg': ['14px', { lineHeight: '20px', fontWeight: '600' }],
        'label-md': ['12px', { lineHeight: '16px', fontWeight: '600' }],
        'label-sm': ['11px', { lineHeight: '14px', letterSpacing: '0.04em', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '26px', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '22px', fontWeight: '400' }],
        'body-sm': ['12px', { lineHeight: '18px', fontWeight: '400' }],
      },

      // ─── Animations ────────────────────────────────────────────────────
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        ping: {
          '75%, 100%': { transform: 'scale(2)', opacity: '0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in-left': 'slide-in-left 0.3s ease-out',
      },
    },
  },
  plugins: [],
};
