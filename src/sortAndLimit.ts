import type { MarkdownInstance } from 'astro'

type ItemType = 'linked' | 'post'

type InstanceWithType<T> = MarkdownInstance<T> & {
  type: ItemType
}

interface Frontmatter {
  title: string
  date: string
}

export type Linked = Frontmatter & {
  href: string
}

export type Post = Frontmatter & {
  description: string
}

export type MDPost = MarkdownInstance<Post>
export type MDLinked = MarkdownInstance<Linked>
type MDFrontmatter = MarkdownInstance<Frontmatter>
export type MDItem = InstanceWithType<Linked | Post>

export type ItemsByMonth = {
  [month: string]: MDItem[]
}

const parseMonth = (date: string) => date.substring(0, 7) // Returns the YYYY-MM part

const sortByDate = (a: MDFrontmatter, b: MDFrontmatter) =>
  a.frontmatter.date.localeCompare(b.frontmatter.date) * -1

const appendType =
  (type: ItemType) => (item: MarkdownInstance<Linked | Post>) => ({
    type,
    ...item,
  })

export const sortAndLimit = (
  linked: MDLinked[],
  posts: MDPost[],
  limit?: number
): MDItem[] => {
  return [...linked.map(appendType('linked')), ...posts.map(appendType('post'))]
    .sort(sortByDate)
    .slice(0, limit)
}

export const splitByMonth = (items: MDItem[]): ItemsByMonth => {
  return items.reduce((acc, item) => {
    const month = parseMonth(item.frontmatter.date)
    const items = acc[month] ?? []

    return {
      ...acc,
      [month]: [...items, item],
    }
  }, {} as ItemsByMonth)
}
