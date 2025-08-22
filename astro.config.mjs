// @ts-check
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  site: 'https://appjeniksaan.nl',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        // Override assets filename, so CSS is in styles.hash.css, instead of privacy.hash.css
        output: { assetFileNames: 'assets/styles.[hash][extname]' },
      },
    },
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: 'one-light',
        dark: 'one-dark-pro',
      },
    },
  },
})
