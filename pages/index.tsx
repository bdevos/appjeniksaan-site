import { GetStaticProps } from 'next'
import Head from 'next/head'
import { getHomeContent, Article, LinkedArticle, PostArticle } from '../lib/articles'
import { getSnippet } from '../lib/snippets'
import { generateFeed } from '../lib/feed'
import Dots from '../components/Dots'
import Linked from '../components/Linked'
import Post from '../components/Post'
import { isProduction } from '../lib/utils'

type Props = {
  aboutHtml: string
  articles: Article[]
}

export default function Home({ aboutHtml, articles }: Props) {
  return (
    <div>
      <Head>
        <link rel="alternate" type="application/rss+xml" title="RSS Feed for Appjeniksaan" href="/feed/rss.xml" />
        <link rel="alternate" type="application/atom+xml" title="Atom Feed for Appjeniksaan" href="/feed/atom.xml" />
        <link rel="alternate" type="application/feed+json" title="JSON Feed for Appjeniksaan" href="/feed/feed.json" />
      </Head>

      <main>
        {articles.map((article: Article) => {
          switch (article.type) {
            case 'linked':
              return <Linked key={article.slug.join('-')} {...(article as LinkedArticle)} />
            case 'post':
              return <Post key={article.slug.join('-')} {...(article as PostArticle)} />
          }
        })}
      </main>

      <Dots />

      <aside>
        <div dangerouslySetInnerHTML={{ __html: aboutHtml }} />
      </aside>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  if (isProduction) {
    // Not 100% sure what the best place is to generate the feed.
    // I do not like installing `ts-node` just to generate it at
    // build. This way it is only called once when generating
    // production, but because it is here it feels a bit hidden.
    generateFeed()
  }

  const { html } = await getSnippet('about')
  const articles = await getHomeContent()

  return {
    props: {
      aboutHtml: html,
      articles,
    },
  }
}
