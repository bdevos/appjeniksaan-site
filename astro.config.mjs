import { defineConfig } from 'astro/config'
import vercel from '@astrojs/vercel/serverless'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  markdown: {
    shikiConfig: {
      theme: 'dracula-soft',
    },
  },
  site: 'https://appjeniksaan.nl',
})
