import { GetStaticProps } from 'next'
import Head from 'next/head'
import { getContent, getHomeContent } from '../lib/content'
import { generateFeed } from '../lib/feed'
import Dots from '../components/Dots'
import Linked from '../components/Linked'
import Post from '../components/Post'

const isProduction = process.env.NODE_ENV === 'production'

export default function Home({ items, aboutHtml }) {
  return (
    <div>
      <Head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS Feed for Appjeniksaan"
          href="/feed/rss.xml"
        />
        <link
          rel="alternate"
          type="application/atom+xml"
          title="Atom Feed for Appjeniksaan"
          href="/feed/atom.xml"
        />
        <link
          rel="alternate"
          type="application/feed+json"
          title="JSON Feed for Appjeniksaan"
          href="/feed/feed.json"
        />
      </Head>

      <main>
        {items.map((item) => {
          switch (item.type) {
            case 'linked':
              return <Linked key={item.slug.join('-')} {...item} />
            case 'post':
              return <Post key={item.slug.join('-')} {...item} />
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

  const { html } = await getContent('snippet', ['about'])
  const items = await getHomeContent()

  return {
    props: {
      items,
      aboutHtml: html,
    },
  }
}
