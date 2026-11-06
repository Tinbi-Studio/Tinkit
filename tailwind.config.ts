import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      spacing: {
        68: '16.5rem',
      },
      opacity: {
        8: '0.08',
        12: '0.12',
        14: '0.14',
        15: '0.15',
        35: '0.35',
        45: '0.45',
        55: '0.55',
        65: '0.65',
        85: '0.85',
      },
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--p) / <alpha-value>)',
          content: 'rgb(var(--pc) / <alpha-value>)',
          hover: 'rgb(var(--p-hover, var(--p)) / <alpha-value>)',
          ink: 'rgb(var(--p-ink, var(--p)) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--s) / <alpha-value>)',
          content: 'rgb(var(--sc) / <alpha-value>)',
          ink: 'rgb(var(--s-ink, var(--s)) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--a) / <alpha-value>)',
          content: 'rgb(var(--ac) / <alpha-value>)',
          ink: 'rgb(var(--a-ink, var(--a)) / <alpha-value>)',
        },
        neutral: {
          DEFAULT: 'rgb(var(--n) / <alpha-value>)',
          content: 'rgb(var(--nc) / <alpha-value>)',
          ink: 'rgb(var(--n-ink, var(--n)) / <alpha-value>)',
        },
        base: {
          100: 'rgb(var(--b1) / <alpha-value>)',
          200: 'rgb(var(--b2) / <alpha-value>)',
          300: 'rgb(var(--b3) / <alpha-value>)',
          content: 'rgb(var(--bc) / <alpha-value>)',
        },
        surface: {
          bg: 'var(--bg)',
          1: 'var(--surface-1)',
          2: 'var(--surface-2)',
          raised: 'var(--surface-raised)',
          input: 'var(--surface-input)',
        },
        theme: {
          text: 'var(--text)',
          muted: 'var(--text-muted)',
          faint: 'var(--text-faint)',
          border: 'var(--border)',
          'border-strong': 'var(--border-strong)',
          accent: 'var(--accent)',
          'accent-hover': 'var(--accent-hover)',
          'accent-soft': 'var(--accent-soft)',
          ring: 'var(--ring)',
        },
        info: {
          DEFAULT: 'rgb(var(--in) / <alpha-value>)',
          content: 'rgb(var(--inc) / <alpha-value>)',
        },
        success: {
          DEFAULT: 'rgb(var(--su) / <alpha-value>)',
          content: 'rgb(var(--suc) / <alpha-value>)',
        },
        warning: {
          DEFAULT: 'rgb(var(--wa) / <alpha-value>)',
          content: 'rgb(var(--wac) / <alpha-value>)',
        },
        error: {
          DEFAULT: 'rgb(var(--er) / <alpha-value>)',
          content: 'rgb(var(--erc) / <alpha-value>)',
        },
      },
      borderRadius: {
        xs: '0.125rem',
        box: 'var(--rounded-box, 0.625rem)',
        btn: 'var(--rounded-btn, 0.5rem)',
        badge: 'var(--rounded-badge, 0.5rem)',
        field: 'var(--rounded-field, 0.5rem)',
        panel: 'var(--rounded-panel, 0.625rem)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      },
    },
  },
  plugins: [],
} satisfies Config
