import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'

// https://astro.build/config
export default defineConfig({
  output: 'static',
  markdown: {
    shikiConfig: {
      theme: 'vitesse-dark',
    },
  },
  site: 'https://appjeniksaan.nl',
  integrations: [tailwind({ config: { applyBaseStyles: false } })],
})
