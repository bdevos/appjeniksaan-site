import { format } from 'https://deno.land/std/datetime/mod.ts'
import paramCase from 'https://deno.land/x/case/paramCase.ts'

type PageType = 'linked' | 'posts'

const postData = (title: string, pubDate: string) => `
---
title: ${title}
pubDate: ${pubDate}
description: ...
layout: ../../layouts/Post.astro
---

`

const linkedData = (title: string, pubDate: string) => `
---
title: ${title}
href: https://...
pubDate: ${pubDate}
layout: ../../layouts/Linked.astro
---

`

const path = (slug: string, type: PageType) => `./src/pages/${type}/${slug}.md`

const pageExists = async (slug: string, type: PageType) => {
  try {
    await Deno.lstat(path(slug, type))
    return true
  } catch {
    return false
  }
}

const askType = (): PageType => {
  const type = prompt('Enter type ([P]osts / [L]inked):', 'L')

  return type?.toLowerCase().startsWith('p') ? 'posts' : 'linked'
}

const createPlaceholderFile = async (
  slug: string,
  type: PageType,
  title: string
) => {
  const pubDate = format(new Date(), 'yyyy-MM-dd HH:mm')
  const data =
    type === 'linked' ? linkedData(title, pubDate) : postData(title, pubDate)

  await Deno.writeTextFile(path(slug, type), data)
}

const main = async () => {
  const title = prompt('Enter title:') ?? 'default'
  const slug = paramCase(title)

  const existsAsLinked = await pageExists(slug, 'linked')
  const existsAsPost = await pageExists(slug, 'posts')

  if (existsAsLinked || existsAsPost) {
    console.log('Slug already exists')
    await main()
  } else {
    const type = askType()

    await createPlaceholderFile(slug, type, title)
  }
}

await main()
