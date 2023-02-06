/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        highlight: 'var(--highlight-color)',
        background: 'hsl(var(--background-color-hsl))',
      },
      fontFamily: {
        display: ['Londrina Solid', 'sans-serif'],
        sans: [
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
