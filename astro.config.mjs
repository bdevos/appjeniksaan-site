import { defineConfig } from 'astro/config'
import preact from '@astrojs/preact'
import vercel from '@astrojs/vercel/serverless'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [preact()],
  markdown: {
    shikiConfig: {
      theme: 'dracula-soft',
    },
  },
  site: 'https://appjeniksaan.nl',
})
