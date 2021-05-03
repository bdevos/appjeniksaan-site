import Head from 'next/head'
import { GetStaticProps } from 'next'
import { ArticlesPerMonth, getArticlesPerMonth } from '../lib/articles'
import MonthHeader from '../components/MonthHeader'
import ArticleLink from '../components/ArticleLink'
import styles from '../styles/Archive.module.css'
import HeadInfo from '../components/HeadInfo'

type Props = {
  articlesPerMonth: ArticlesPerMonth
}

export default function Linked({ articlesPerMonth }: Props) {
  return (
    <main>
      <HeadInfo title="Archive" url="/archive" />

      <h1>🗄 Archive</h1>

      {Object.keys(articlesPerMonth).map((id) => (
        <div key={id}>
          <MonthHeader id={id} />

          <ul className={styles.archive}>
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
