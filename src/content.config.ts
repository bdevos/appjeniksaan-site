import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.string(),
    description: z.string().optional(),
    href: z.string().optional(),
  }),
})

const linked = defineCollection({
  loader: glob({ base: './src/content/linked', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    href: z.string(),
    pubDate: z.string(),
  }),
})

const reading = defineCollection({
  loader: glob({ base: './src/content/reading', pattern: '**/*.md' }),
  schema: z.object({
    author: z.string(),
    completed: z.date(),
    isbn: z.union([z.string(), z.array(z.string())]),
    title: z.string(),
    translation: z.string().optional(),
  }),
})

export const collections = { posts, linked, reading }
