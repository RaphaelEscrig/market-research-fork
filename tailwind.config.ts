import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        danger: {
          DEFAULT: 'hsl(var(--danger))',
          foreground: 'hsl(var(--danger-foreground))',
          hover: 'hsl(var(--danger-hover))',
          border: 'hsl(var(--danger-border))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
          hover: 'hsl(var(--destructive-hover))',
          border: 'hsl(var(--destructive-border))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        'green-700': {
          DEFAULT: 'hsl(var(--green-700))',
        },
        'green-900': {
          DEFAULT: 'hsl(var(--green-900))',
        },
        neutral: {
          DEFAULT: 'hsl(var(--neutral))',
        },
        'neutral-hover': {
          DEFAULT: 'hsl(var(--neutral-hover))',
        },
        'neutral-subtle': {
          DEFAULT: 'hsl(var(--neutral-subtle))',
        },
        'neutral-subtle-hover': {
          DEFAULT: 'hsl(var(--neutral-subtle-hover))',
        },
        'beige-50': {
          DEFAULT: 'hsl(var(--beige-50))',
        },
        'beige-100': {
          DEFAULT: 'hsl(var(--beige-100))',
        },
        'beige-300': {
          DEFAULT: 'hsl(var(--beige-300))',
        },
        'beige-500': {
          DEFAULT: 'hsl(var(--beige-500))',
        },
        'table-header': {
          DEFAULT: 'hsl(var(--table-header))',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
      },
      fontSize: {
        xs: '0.75rem',
        md: '0.875rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '2.625rem',
        '6xl': '3rem',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      backgroundImage: {
        'logo': "url('/background-logo.svg')",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require('tailwindcss-animate')],
};
