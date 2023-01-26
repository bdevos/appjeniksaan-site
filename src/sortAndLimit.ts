import type { CollectionEntry } from 'astro:content'

export type LinkedOrPosts = CollectionEntry<'posts'> | CollectionEntry<'linked'>

export type ItemsByMonth = {
  [month: string]: LinkedOrPosts[]
}

const parseMonth = (date: string) => date.substring(0, 7) // Returns the YYYY-MM part

const sortByDate = (a: LinkedOrPosts, b: LinkedOrPosts) =>
  a.data.pubDate.localeCompare(b.data.pubDate) * -1

export const sortAndLimit = (
  linked: CollectionEntry<'linked'>[],
  posts: CollectionEntry<'posts'>[],
  limit?: number
): LinkedOrPosts[] => {
  return [...linked, ...posts].sort(sortByDate).slice(0, limit)
}

export const splitByMonth = (items: LinkedOrPosts[]): ItemsByMonth => {
  return items.reduce((acc, item) => {
    const month = parseMonth(item.data.pubDate)
    const items = acc[month] ?? []

    return {
      ...acc,
      [month]: [...items, item],
    }
  }, {} as ItemsByMonth)
}
