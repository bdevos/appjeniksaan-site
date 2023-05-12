import { format } from 'https://deno.land/std/datetime/mod.ts'
import paramCase from 'https://deno.land/x/case/paramCase.ts'

type PageType = 'linked' | 'posts'

type PromptReturn = {
  type: PageType
  href?: string
}

const postData = (title: string, pubDate: string) => `---
title: ${title}
pubDate: ${pubDate}
---

`

const linkedData = (title: string, pubDate: string, href: string) => `---
title: ${title}
href: ${href}
pubDate: ${pubDate}
---

`

const path = (slug: string, type: PageType) =>
  `./src/content/${type}/${slug}.md`

const pageExists = async (slug: string, type: PageType) => {
  try {
    await Deno.lstat(path(slug, type))
    return true
  } catch {
    return false
  }
}

const promptArgs = (): PromptReturn => {
  const type = prompt('Enter type ([P]osts / [L]inked):', 'L')

  if (type?.toLowerCase().startsWith('p')) {
    return { type: 'posts' }
  } else {
    const href = prompt('Enter href', 'https://...')!

    return { type: 'linked', href }
  }
}

const createPlaceholderFile = async (
  slug: string,
  type: PageType,
  title: string,
  href?: string
) => {
  const pubDate = format(new Date(), 'yyyy-MM-dd HH:mm')
  const data =
    type === 'linked'
      ? linkedData(title, pubDate, href!)
      : postData(title, pubDate)

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
    const { type, href } = promptArgs()

    await createPlaceholderFile(slug, type, title, href)
  }
}

await main()
