import '../styles/globals.css'
import '../styles/prism.css'
import styles from '../styles/App.module.css'
import { AppProps } from 'next/app'
import Head from 'next/head'
import Link from 'next/link'
import Dots from '../components/Dots'
import Footer from '../components/Footer'

export default function App({ Component, pageProps }: AppProps) {
    return <div>
        <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="description" content="Appjeniksaan is my personal software development shop to let me build things that I think are interesting or just fun to create." />
            <link rel="icon" href="/favicon.ico" />
            <title>Appjeniksaan</title>
        </Head>

        <header className={styles.header}>
            <div className={styles.container}>
                <Link href="/">Appjeniksaan</Link>
            </div>
        </header>

        <div className={styles.container}>
            <Component {...pageProps} />

            <Dots />

            <Footer />
        </div>
    </div>
}
  