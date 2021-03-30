import fs from 'fs'
import path from 'path'
import { Feed } from 'feed'

const writeToPublic = (fileName: string, data: string) => {
  const feedPath = path.join(process.cwd(), 'public', fileName)
  fs.writeFileSync(feedPath, data)
}

export const generate = () => {
  const feed = new Feed({
    title: 'Appjeniksaan',
    id: 'https://appjeniksaan.nl',
    link: 'https://appjeniksaan.nl',
    language: 'en',
    favicon: 'https://appjeniksaan.nl/favicon.ico',
    copyright: 'Copyright 2021 - present, Appjeniksaan',
    feedLinks: {
      json: 'https://appjeniksaan.nl/json',
      atom: 'https://appjeniksaan.nl/atom',
    },
    author: {
      name: 'Berry de Vos',
      email: 'hello@appjeniksaan.nl',
      link: 'https://appjeniksaan.nl/contact',
    },
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
