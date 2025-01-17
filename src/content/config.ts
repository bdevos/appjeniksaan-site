import { z, defineCollection } from 'astro:content'

const linkedCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    href: z.string(),
    pubDate: z.string(),
  }),
})

const postsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    pubDate: z.string(),
    description: z.string().optional(),
    href: z.string().optional(),
  }),
})

const readingCollection = defineCollection({
  schema: z.object({
    author: z.string(),
    completed: z.date(),
    isbn: z.union([z.string(), z.array(z.string())]),
    title: z.string(),
    translation: z.string().optional(),
  }),
})

export const collections = {
  linked: linkedCollection,
  posts: postsCollection,
  reading: readingCollection,
}
