import { defineConfig } from 'astro/config'
import vercel from '@astrojs/vercel/serverless'
import tailwind from '@astrojs/tailwind'

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
  integrations: [tailwind({ config: { applyBaseStyles: false } })],
})
