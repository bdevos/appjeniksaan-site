import '../styles/globals.css'
import '../styles/prism.css'
import styles from '../styles/App.module.css'
import { AppProps } from 'next/app'
import Head from 'next/head'
import Dots from '../components/Dots'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { description, title } from '../lib/constants'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
        <title>{title}</title>
      </Head>

      <Header />

      <div className={styles.container}>
        <Component {...pageProps} />

        <Dots />

        <Footer />
      </div>
    </div>
  )
}
