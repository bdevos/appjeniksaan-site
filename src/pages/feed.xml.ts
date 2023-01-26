import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import sanitizeHtml from 'sanitize-html'
import MarkdownIt from 'markdown-it'
import { site } from '../constants'

import type { LinkedOrPosts } from '../sortAndLimit'
import type { APIContext } from 'astro'

const parser = new MarkdownIt()

const sortByDate = (a: LinkedOrPosts, b: LinkedOrPosts) =>
  a.data.pubDate.localeCompare(b.data.pubDate) * -1

export const get = async (context: APIContext) => {
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
      description:
        item.collection === 'posts' ? item.data.description : undefined,
      content: sanitizeHtml(parser.render(item.body)),
    })),
  })
}
