/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        highlight: 'var(--highlight-color)',
        background: 'var(--background-color)',
      },
      dropShadow: {
        header: [
          '0 0 2px var(--background-color)',
          '0 0 5px var(--background-color)',
          '0 0 10px var(--background-color)',
        ],
      },
      fontFamily: {
        display: ['Londrina Solid', 'sans-serif'],
        shadow: ['Londrina Shadow', 'sans-serif'],
        sans: [
          'Satoshi',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Ubuntu',
          'Cantarell',
          'Noto Sans',
          'sans-serif',
        ],
        mono: [
          'Dank Mono',
          'Operator Mono',
          'Inconsolata',
          'Fira Mono',
          'ui-monospace',
          'SF Mono',
          'Monaco',
          'Droid Sans Mono',
          'Source Code Pro',
          'monospace',
        ],
      },
      gridTemplateColumns: {
        archive: '3ch 1fr',
      },
    },
  },
  plugins: [],
}
