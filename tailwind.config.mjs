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
        flat: '0 1px 0 rgba(0, 0, 0, 0.5)',
      },
      fontFamily: {
        display: ['Londrina Solid', 'sans-serif'],
        shadow: ['Londrina Shadow', 'Londrina Solid', 'sans-serif'],
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
  // preflight: {
  //   '@font-face': [
  //     {
  //       fontFamily: 'Londrina Solid',
  //       fontWeight: '900',
  //       src: `url('/fonts/londrinasolid-black-webfont.woff2') format('woff2'),
  //             url('/fonts/londrinasolid-black-webfont.woff') format('woff')`,
  //     },
  //   ],
  // },
  plugins: [],
}
