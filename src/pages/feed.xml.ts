import rss from '@astrojs/rss'
import type { MDItem } from '../sortAndLimit'
import { site } from '../constants'

const sortByDate = (a: any, b: any) =>
  a.frontmatter.pubDate.localeCompare(b.frontmatter.pubDate) * -1

const postsImportResult = import.meta.glob<MDItem>('./posts/*.md', {
  eager: true,
})
const linkedImportResult = import.meta.glob<MDItem>('./linked/*.md', {
  eager: true,
})
const posts = Object.values(postsImportResult)
const linked = Object.values(linkedImportResult)

const items = [...posts, ...linked].sort(sortByDate)

export const get = () =>
  rss({
    title: site.title,
    description: site.description,
    site: import.meta.env.SITE,
    items: items.map((item) => ({
      link: `${item.url}`,
      title: item.frontmatter.title,
      pubDate: new Date(item.frontmatter.pubDate),
      description: item?.compiledContent() ?? '',
    })),
    updated: new Date(items[0].frontmatter.pubDate),
  })
