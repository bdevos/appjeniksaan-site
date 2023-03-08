import { defineConfig } from 'astro/config'
import vercel from '@astrojs/vercel/static'
import tailwind from '@astrojs/tailwind'

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: vercel(),
  markdown: {
    shikiConfig: {
      theme: 'vitesse-dark',
    },
  },
  site: 'https://appjeniksaan.nl',
  integrations: [tailwind({ config: { applyBaseStyles: false } })],
})
