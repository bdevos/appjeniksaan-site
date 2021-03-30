import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'

type Snippet = {
  html: string
}

export const getSnippet = async (snippet: string): Promise<Snippet> => {
  const filePath = path.join(process.cwd(), 'content', 'snippets', `${snippet}.md`)
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const matterResult = matter(fileContents)

  const processedContent = await remark().use(html).process(matterResult.content)

  return {
    html: processedContent.toString(),
  }
}
