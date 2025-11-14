import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#fffffe',
        headline: '#33272a',
        'sub-headline': '#594a4e',
        'card-background': '#faeee7',
        'card-heading': '#33272a',
        'card-paragraph': '#594a4e',
        stroke: '#33272a',
        main: '#fffffe',
        highlight: '#ff8ba7',
        secondary: '#ffc6c7',
        tertiary: '#c3f0ca',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
