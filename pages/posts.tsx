import Head from 'next/head'
import { GetStaticProps } from 'next'
import { getSorted, PostArticle } from '../lib/articles'
import styles from '../styles/Linked.module.css'
import Date from '../components/Date'

type Props = {
  posts: PostArticle[]
}

export default function Posts({ posts }: Props) {
  return (
    <main>
      <Head>
        <title>Posts ― Appjeniksaan</title>
      </Head>

      <h1>Posts</h1>

      <h2>March, 2021</h2>

      <ul>
        {posts.map((item) => (
          <li key={item.slug.join('-')}>
            <span className={styles.title}>{item.title}</span>
            <Date date={item.date} slug={item.slug} type="posts" />
          </li>
        ))}
      </ul>
    </main>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = getSorted('post')
  return {
    props: {
      posts,
    },
  }
}
