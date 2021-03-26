import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Appjeniksaan</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Appjeniksaan
        </h1>

        <p className={styles.description}>
          Placeholder page
        </p>
      </main>

    </div>
  )
}
