import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'
import emoji from 'remark-emoji'

const snippetsDirectory = path.join(process.cwd(), 'snippets')

export async function snippet(slug: string) {
    const fullPath = path.join(snippetsDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
        .use(html)
        .use(emoji)
        .process(matterResult.content)

    return {
        slug,
        html: processedContent.toString()
    }
}