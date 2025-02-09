import type { CollectionEntry } from 'astro:content'
import { parseMonth, type ByMonth } from './parseMonth'

export const splitReadingByMonth = (items: CollectionEntry<'reading'>[]) => {
  return items
    .sort((a, b) => b.data.completed.getTime() - a.data.completed.getTime())
    .reduce(
      (acc, item) => {
        const month = parseMonth(item.data.completed.toISOString())
        const items = acc[month] ?? []

        return {
          ...acc,
          [month]: [...items, item],
        }
      },
      {} as ByMonth<CollectionEntry<'reading'>>,
    )
}
