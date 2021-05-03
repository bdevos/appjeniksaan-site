import fs from 'fs'
import path from 'path'
import { Feed } from 'feed'
import { siteDescription, host, siteTitle } from './constants'
import { getFeedContent } from './articles'
import { parseISO } from 'date-fns'

const feedDir = path.join(process.cwd(), 'public', 'feed')

const writeToPublic = (fileName: string, data: string) => {
  if (!fs.existsSync(feedDir)) {
    fs.mkdirSync(feedDir)
  }
  fs.writeFileSync(path.join(feedDir, fileName), data)
}

export const generateFeed = async () => {
  const feed = new Feed({
    title: siteTitle,
    description: siteDescription,
    id: host,
    link: host,
    language: 'en',
    favicon: `${host}/favicon.ico`,
    copyright: 'Copyright 2021 - present, Appjeniksaan',
    feedLinks: {
      json: `${host}/feed/feed.json`,
      atom: `${host}/feed/atom.xml`,
      rss: `${host}/feed/rss.xml`,
    },
    author: {
      name: 'Berry de Vos',
      email: 'hello@appjeniksaan.nl',
      link: 'https://appjeniksaan.nl/contact',
    },
    updated: new Date(),
  })

  const items = await getFeedContent()
  items.forEach((item) =>
    feed.addItem({
      title: item.title,
      id: `${host}/${item.slug.join('/')}`,
      link: `${host}/${item.slug.join('/')}`,
      content: item.html ?? '',
      date: parseISO(item.date),
    })
  )

  writeToPublic('atom.xml', feed.atom1())
  writeToPublic('feed.json', feed.json1())
  writeToPublic('rss.xml', feed.rss2())
}
