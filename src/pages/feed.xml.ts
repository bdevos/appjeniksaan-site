import rss from '@astrojs/rss'
import { getCollection, render, type CollectionEntry } from 'astro:content'
import type { APIContext } from 'astro'
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts'
import { experimental_AstroContainer } from 'astro/container'
import { sortAndLimit } from '../utils/sortAndLimit'
import { amsDate } from '../utils/dateFormat'

const parseLinkedAsEnclosure = (item: CollectionEntry<'linked'>) => ({
  length: item.data.href.length,
  url: item.data.href,
  type: 'text/html',
})

export async function GET(context: APIContext) {
  const posts = getCollection('posts')
  const linked = getCollection('linked')

  const container = await experimental_AstroContainer.create()

  const items = await Promise.all(
    sortAndLimit(await linked, await posts, 10).map(async (item) => {
      const { Content } = await render(item)
      const html = await container.renderToString(Content)

      return { ...item, html }
    }),
  )

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site!,
    items: items.map((item) => ({
      ...item.data,
      pubDate: amsDate(item.data.pubDate),
      link: `${item.collection}/${item.id}`,
      enclosure:
        item.collection === 'linked' ? parseLinkedAsEnclosure(item) : undefined,
      description:
        item.collection === 'posts' && item.data.description
          ? item.data.description
          : item.html,
    })),
  })
}
