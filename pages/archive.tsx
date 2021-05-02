import Head from 'next/head'
import { GetStaticProps } from 'next'
import { ArticlesPerMonth, getArticlesPerMonth } from '../lib/articles'
import Emoji from '../components/Emoji'
import MonthHeader from '../components/MonthHeader'
import ArticleLink from '../components/ArticleLink'

type Props = {
  articlesPerMonth: ArticlesPerMonth
}

export default function Linked({ articlesPerMonth }: Props) {
  return (
    <main>
      <Head>
        <title>Archive ― Appjeniksaan</title>
      </Head>

      <h1>
        <Emoji emoji="🗄" label="Archive" /> Archive
      </h1>

      {Object.keys(articlesPerMonth).map((id) => (
        <div key={id}>
          <MonthHeader id={id} />

          <ul>
            {articlesPerMonth[id].map((article) => (
              <ArticleLink key={article.slug.join('-')} article={article} />
            ))}
          </ul>
        </div>
      ))}
    </main>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const articlesPerMonth = getArticlesPerMonth()

  return {
    props: {
      articlesPerMonth,
    },
  }
}
