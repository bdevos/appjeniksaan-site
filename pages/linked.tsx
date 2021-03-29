import Head from 'next/head'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import { getSorted } from '../lib/content'
import styles from '../styles/Linked.module.css'
import Date from '../components/Date'

export default function Linked({ linked }) {
  return (
    <main>
      <Head>
        <title>Linked ― Appjeniksaan</title>
      </Head>

      <h1>Linked</h1>

      <h2>March, 2021</h2>

      <ul>
        {linked.map((item) => (
          <li key={item.slug.join('-')}>
            <Link href={item.href}>
              <a className={styles.title}>{item.title}</a>
            </Link>
            <Date date={item.date} slug={item.slug} type="linked" />
          </li>
        ))}
      </ul>
    </main>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const linked = getSorted('linked')
  return {
    props: {
      linked,
    },
  }
}
