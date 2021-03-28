import Head from 'next/head'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import { getSorted } from '../lib/content'
import styles from '../styles/Linked.module.css'

export default function Posts({ posts }) {
  return (
    <main>
      <Head>
        <title>Posts ― Appjeniksaan</title>
      </Head>

      <h1>Posts</h1>

      <h2>March, 2021</h2>
      
      <ul>
        { posts.map((item) => (
          <li key={item.slug}>
            <span className={styles.title}>{item.title}</span>
            <Link href={`/posts/${item.slug}`}>
              <a className={styles.underline}>
                {item.date}
              </a>
            </Link>
          </li>
        )) }
      </ul>

    </main>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = getSorted('post')
  return {
      props: {
          posts
      }
  }
}
