import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'
import prism from 'remark-prism'
import { parseISO, compareDesc } from 'date-fns'

export type BaseArticle = {
  html?: string
  date: string
  slug: string[]
  title: string
  type: ArticleType
}

export type PostArticle = BaseArticle & {
  description: string
}

export type LinkedArticle = BaseArticle & {
  href: string
}

type ArticleType = 'post' | 'linked'

export type Article = LinkedArticle | PostArticle

type ParseTo = 'html' | 'feed'

type DateCompare = {
  date: string
}

export type ArticlesPerMonth = {
  [id: string]: BaseArticle[]
}

const contentPath = [process.cwd(), 'content']

const slugRegex = /(\d{4})-(\d{2})-(\d{2})-([\w.\-]+)\.md/

const getPath = (type: ArticleType) => {
  switch (type) {
    case 'post':
      return [...contentPath, 'posts']
    case 'linked':
      return [...contentPath, 'linked']
  }
}

const dateCompare = ({ date: left }: DateCompare, { date: right }: DateCompare) =>
  compareDesc(parseISO(left), parseISO(right))

export const getArticle = async (
  type: ArticleType,
  slug: string[],
  parseTo: ParseTo = 'html'
): Promise<BaseArticle> => {
  const fullPath = path.join(...[...getPath(type), `${slug.join('-')}.md`])
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const matterResult = matter(fileContents)

  const processedContent = await remark()
    .use([...(parseTo === 'html' ? [prism] : []), html])
    .process(matterResult.content)

  return {
    ...(type === 'linked' ? { href: matterResult.data.href } : {}),
    ...(type === 'post' ? { description: matterResult.data.description } : {}),
    html: processedContent.toString(),
    date: matterResult.data.date,
    slug: slug,
    title: matterResult.data.title,
    type,
  }
}

const getSlug = (fileName: string): string[] => fileName.match(slugRegex)!.slice(1)

export const getSlugs = (type: ArticleType) => {
  const fileNames = fs.readdirSync(path.join(...getPath(type)))

  return fileNames.map((fileName) => {
    const slug = getSlug(fileName)

    return {
      params: { slug },
    }
  })
}

const getArticlesByType = (type: ArticleType): BaseArticle[] => {
  const directory = path.join(...getPath(type))
  const fileNames = fs.readdirSync(directory)

  return fileNames
    .map((fileName) => {
      const slug = getSlug(fileName)
      const fullPath = path.join(directory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const matterResult = matter(fileContents)

      return {
        ...(type === 'linked' ? { href: matterResult.data.href } : {}),
        ...(type === 'post' ? { description: matterResult.data.description } : {}),
        slug,
        type,
        date: matterResult.data.date,
        title: matterResult.data.title,
      }
    })
    .sort(dateCompare)
}

const getMonthIdFromArticle = ({ date }: BaseArticle): string => {
  const parsedDate = parseISO(date)
  return `${parsedDate.getFullYear()}-${parsedDate.getMonth()}`
}

export const getArticlesPerMonth = (): ArticlesPerMonth => {
  return [...getArticlesByType('post'), ...getArticlesByType('linked')].sort(dateCompare).reduce((acc, article) => {
    const id = getMonthIdFromArticle(article)
    const articles = acc[id] ?? []

    return {
      ...acc,
      [id]: [...articles, article],
    }
  }, {} as ArticlesPerMonth)
}

const getLatest = (limit: number) =>
  [...getArticlesByType('post'), ...getArticlesByType('linked')].sort(dateCompare).slice(0, limit)

export const getHomeContent = async () => Promise.all(getLatest(5).map(({ type, slug }) => getArticle(type, slug)))

export const getFeedContent = async () =>
  Promise.all(getLatest(15).map(({ type, slug }) => getArticle(type, slug, 'feed')))
