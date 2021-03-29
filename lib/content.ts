import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'
import prism from 'remark-prism'
import { parseISO, compareDesc } from 'date-fns'

type ContentType = 'post' | 'linked' | 'snippet'

type BaseContent = {
    type: ContentType
    slug: string[]
    html: string
}

type Snippet = BaseContent & {
    type: 'snippet'
}

type Post = BaseContent & {
    type: 'post'
    title: string
    date: string
}

type Linked = BaseContent & {
    type: 'linked'
    title: string
    date: string
    href: string
}

const contentPath = [process.cwd(), 'content']

const slugRegex = /(\d{4})-(\d{2})-(\d{2})-([\w.\-]+)\.md/

const getPath = (type: ContentType) => {
    switch(type) {
        case 'post':
            return [...contentPath, 'posts']
        case 'linked':
            return [...contentPath, 'linked']
        case 'snippet':
            return [...contentPath, 'snippets']
    }
}

const dateCompare = ({ date: left }, {date: right}) => compareDesc(parseISO(left), parseISO(right))

export const getContent = async (type: ContentType, slug: string[]): Promise<Post | Snippet | Linked> => {
    const fullPath = path.join(...[...getPath(type), `${slug.join('-')}.md`])
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const matterResult = matter(fileContents)

    const processedContent = await remark()
        .use(prism)
        .use(html)
        .process(matterResult.content)

    const base: BaseContent = {
        type,
        slug,
        html: processedContent.toString()
    }

    switch(type) {
        case 'snippet':
            return base as Snippet
        case 'post':
            return {
                ...base,
                title: matterResult.data.title,
                date: matterResult.data.date
            } as Post
        case 'linked':
            return {
                ...base,
                title: matterResult.data.title,
                date: matterResult.data.date,
                href: matterResult.data.href
            } as Linked
    }
}

const getSlug = (fileName: string): string[] => fileName.match(slugRegex).slice(1)

export const getSlugs = (type: ContentType) => {
    const fileNames = fs.readdirSync(path.join(...getPath(type)))
    return fileNames.map(fileName => {
        const slug = getSlug(fileName)

        return {
            params: { slug }
        }
    })
}

export const getSorted = (type: ContentType) => {
    if (type === 'snippet') {
        return []
    }

    const directory = path.join(...getPath(type))
    const fileNames = fs.readdirSync(directory)
    
    return fileNames.map(fileName => {
        const slug = getSlug(fileName)
        const fullPath = path.join(directory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const matterResult = matter(fileContents)

        switch(type) {
            case 'post':
                return {
                    slug,
                    type,
                    date: matterResult.data.date,
                    title: matterResult.data.title
                }
            case 'linked':
                return {
                    slug,
                    type,
                    date: matterResult.data.date,
                    title: matterResult.data.title,
                    href: matterResult.data.href
                }
        }
    }).sort(dateCompare)
}

export const getHomeContent = async () => {
    const contentItems = await Promise.all([...getSorted('post'), ...getSorted('linked')]
        .sort(dateCompare)
        .slice(0, 5)
        .map(async ({ type, slug }) => {
            const content = await getContent(type, slug)
            return content
        }))
    return contentItems
}