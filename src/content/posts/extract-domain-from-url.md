---
title: Extract domain from URL
pubDate: 2023-02-04 08:37
---

This blog mostly links out to other content on the web, but from the main page, that isn't immediately obvious. I wanted to make this clearer by displaying the top-level domain of the linked articles.

I found many unsatisfactory regular expressions while searching the web, so I derived my own solution.

```ts
const url = 'https://appjeniksaan.nl/posts/extract-domain-from-url'

const domainRegex = /^https?:\/\/+(www\.)?(?<domain>.*?)(\/|$)/i
const domain = domainRegex.exec(url)?.groups?.domain

console.log(domain) // 'appjeniksaan.nl'
```
