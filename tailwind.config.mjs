/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Londrina Solid', 'sans-serif'],
        body: ['Poppins', 'sans-serif'],
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
      },
      gridTemplateColumns: {
        archive: '3ch 1fr',
      },
    },
  },
  plugins: [],
}
