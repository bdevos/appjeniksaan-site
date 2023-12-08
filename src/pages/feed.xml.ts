import rss from '@astrojs/rss'
import { CollectionEntry, getCollection } from 'astro:content'
import sanitizeHtml from 'sanitize-html'
import MarkdownIt from 'markdown-it'
import { site } from '@src/constants'

import type { LinkedOrPosts } from '@src/sortAndLimit'
import type { APIContext } from 'astro'

const parser = new MarkdownIt()

const sortByDate = (a: LinkedOrPosts, b: LinkedOrPosts) =>
  a.data.pubDate.localeCompare(b.data.pubDate) * -1

const parseLinkedAsEnclosure = (item: CollectionEntry<'linked'>) => ({
  length: item.data.href.length,
  url: item.data.href,
  type: 'text/html',
})

export async function GET(context: APIContext) {
  const linked = getCollection('linked')
  const posts = getCollection('posts')

  const items = [...(await linked), ...(await posts)].sort(sortByDate)

  return rss({
    title: site.title,
    description: site.description,
    site: context.site?.toString() ?? '',
    items: items.map((item) => ({
      link: `${item.collection}/${item.slug}`,
      title: item.data.title,
      pubDate: new Date(item.data.pubDate),
      enclosure:
        item.collection === 'linked' ? parseLinkedAsEnclosure(item) : undefined,
      description:
        item.collection === 'posts' && item.data.description
          ? item.data.description
          : sanitizeHtml(parser.render(item.body)),
    })),
  })
}
