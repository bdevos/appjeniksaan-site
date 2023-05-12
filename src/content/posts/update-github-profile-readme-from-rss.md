---
title: Update Github profile README from RSS
pubDate: 2023-05-12 17:04
---

On your GitHub profile, you can share information by updating the README.md in your profile repository. Initially, I was unsure about how to utilize this web space effectively, so I decided it would be a good idea to link back to this website.

To simplify the process of updating this file, I created a script that relies on the RSS feed of this website. Using a [template markdown file](https://github.com/bdevos/bdevos/blob/main/template.md) and some replace logic, I was able to generate an updated README file with the TypeScript code below running on Deno.

```typescript
import { parseFeed } from 'https://deno.land/x/rss@0.5.8/mod.ts'
import { partition } from 'https://deno.land/std@0.187.0/collections/partition.ts'
import { linkedTemplate, postTemplate } from './template.ts'

const response = await fetch('https://appjeniksaan.nl/feed.xml')

const xml = await response.text()
const feed = await parseFeed(xml)

const [linked, posts] = partition(
  feed.entries,
  ({ attachments }) => !!attachments
)

const linkedContent = linked.slice(0, 3).map(linkedTemplate).join('\n')
const postsContent = posts.slice(0, 3).map(postTemplate).join('\n')

const template = await Deno.readTextFile('./template.md')

await Deno.writeTextFile(
  './README.md',
  template.replace('<posts>', postsContent).replace('<linked>', linkedContent)
)
```

Additionally, I added a [GitHub Action workflow](https://github.com/bdevos/bdevos/blob/main/.github/workflows/generate-readme.yaml) that allows for manual triggering of updates. These updates are directly committed and pushed to the repository. Ideally, it would be great to connect this workflow to automatically run when the RSS feed is updated. However, for now, manual execution should suffice.
