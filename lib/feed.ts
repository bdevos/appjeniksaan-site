import fs from 'fs'
import path from 'path'
import { Feed } from 'feed'

const feedDir = path.join(process.cwd(), 'public', 'feed')

const writeToPublic = (fileName: string, data: string) => {
  if (!fs.existsSync(feedDir)) {
    fs.mkdirSync(feedDir)
  }
  fs.writeFileSync(path.join(feedDir, fileName), data)
}

export const generate = () => {
  const feed = new Feed({
    title: 'Appjeniksaan',
    description: '',
    id: 'https://appjeniksaan.nl',
    link: 'https://appjeniksaan.nl',
    language: 'en',
    favicon: 'https://appjeniksaan.nl/favicon.ico',
    copyright: 'Copyright 2021 - present, Appjeniksaan',
    feedLinks: {
      json: 'https://appjeniksaan.nl/feed/json',
      atom: 'https://appjeniksaan.nl/feed/atom',
      rss: 'https://appjeniksaan.nl/feed/rss',
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

  writeToPublic('atom', feed.atom1())
  writeToPublic('json', feed.json1())
  writeToPublic('rss', feed.rss2())
}
