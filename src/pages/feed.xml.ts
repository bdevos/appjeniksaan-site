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

const parseLinkedCustomData = (
  item: CollectionEntry<'linked'>,
  url: string
): string =>
  `<link rel="alternate" type="text/html" href="${item.data.href}"/>
  <link rel="related" type="text/html" href="${url}${item.collection}/${item.slug}"/>`

const parsePostsCustomData = (
  item: CollectionEntry<'posts'>,
  url: string
): string =>
  `<link rel="alternate" type="text/html" href="${url}${item.collection}/${item.slug}"/>`

export const get = async (context: APIContext) => {
  const linked = getCollection('linked')
  const posts = getCollection('posts')

  const items = [...(await linked), ...(await posts)].sort(sortByDate)
  const url = context.site?.toString() ?? ''

  return rss({
    title: site.title,
    description: site.description,
    site: context.site?.toString() ?? '',
    items: items.map((item) => ({
      customData:
        item.collection === 'linked'
          ? parseLinkedCustomData(item, url)
          : parsePostsCustomData(item, url),
      link: `${item.collection}/${item.slug}`,
      title: item.data.title,
      pubDate: new Date(item.data.pubDate),
      description:
        item.collection === 'posts' && item.data.description
          ? item.data.description
          : sanitizeHtml(parser.render(item.body)),
    })),
  })
}
