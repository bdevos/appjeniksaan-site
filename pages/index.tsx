import { GetStaticProps } from 'next'
import { getContent, getHomeContent } from '../lib/content'
import Dots from '../components/Dots'
import Linked from '../components/Linked'
import Post from '../components/Post'

export default function Home({ items, aboutHtml }) {
  return (
    <div>
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
  const { html } = await getContent('snippet', ['about'])
  const items = await getHomeContent()

  return {
    props: {
      items,
      aboutHtml: html,
    },
  }
}
