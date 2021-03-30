import fs from 'fs'
import path from 'path'
import { Feed } from 'feed'
import { description, host, title } from './constants'

const feedDir = path.join(process.cwd(), 'public', 'feed')

const writeToPublic = (fileName: string, data: string) => {
  if (!fs.existsSync(feedDir)) {
    fs.mkdirSync(feedDir)
  }
  fs.writeFileSync(path.join(feedDir, fileName), data)
}

export const generateFeed = () => {
  const feed = new Feed({
    title,
    description,
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

  feed.addItem({
    title: 'Title',
    id: 'https://appjeniksaan.nl/2021/03/28/bla-bla',
    link: 'https://appjeniksaan.nl/2021/03/28/bla-bla',
    content: 'Content',
    date: new Date(),
  })

  writeToPublic('atom.xml', feed.atom1())
  writeToPublic('feed.json', feed.json1())
  writeToPublic('rss.xml', feed.rss2())
}
