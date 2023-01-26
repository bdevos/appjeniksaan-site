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
  }),
})

export const collections = {
  linked: linkedCollection,
  posts: postsCollection,
}
