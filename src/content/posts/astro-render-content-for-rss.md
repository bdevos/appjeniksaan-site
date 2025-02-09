---
title: Astro render content for RSS
pubDate: 2025-02-09 09:33
---

I just migrated this site from Tailwind 3 to 4, and because I ran into some breaking issues, I started with a freshly generated Astro project and copied in the content. This took surprisingly little effort, so I am happy with that.

When migrating, I ran into some old code that I used to render the markdown files to HTML as a string, to include in the RSS output. But for this task, I used a separate package and yet another package to sanitize the html.

But I noticed in the Astro docs that there is a new (and as of now still experimental) way to generate the html for the content in Astro: [Astro Container API](https://docs.astro.build/en/reference/container-reference/)

To use this new API, you can do something like:

```typescript
const container = await experimental_AstroContainer.create()

items.map(async (item) => {
  const { Content } = await render(item)
  const html = await container.renderToString(Content)

  return { ...item, html }
}),
```

Or check out the code to generate the RSS feed for this website: [feed.xml.ts](https://github.com/bdevos/appjeniksaan-site/blob/main/src/pages/feed.xml.ts)
