import type { CollectionEntry } from 'astro:content'
import { parseMonth, type ByMonth } from './parseMonth'

export type LinkedOrPosts = CollectionEntry<'posts'> | CollectionEntry<'linked'>

const sortByDate = (a: LinkedOrPosts, b: LinkedOrPosts) =>
  a.data.pubDate.localeCompare(b.data.pubDate) * -1

export const sortAndLimit = (
  linked: CollectionEntry<'linked'>[],
  posts: CollectionEntry<'posts'>[],
  limit?: number,
): LinkedOrPosts[] => {
  return [...linked, ...posts].sort(sortByDate).slice(0, limit)
}

export const splitPostByMonth = (
  items: LinkedOrPosts[],
): ByMonth<LinkedOrPosts> => {
  return items.reduce((acc, item) => {
    const month = parseMonth(item.data.pubDate)
    const items = acc[month] ?? []

    return {
      ...acc,
      [month]: [...items, item],
    }
  }, {} as ByMonth<LinkedOrPosts>)
}
