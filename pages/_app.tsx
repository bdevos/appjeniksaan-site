import '../styles/globals.css'
import styles from '../styles/App.module.css'
import { AppProps } from 'next/app'
import Head from 'next/head'
import Link from 'next/link'
import Dots from '../components/Dots'
import Footer from '../components/Footer'

export default function App({ Component, pageProps }: AppProps) {
    return <div>
        <Head>
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital@0;1&display=swap" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
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
  