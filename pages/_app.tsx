import '../styles/globals.css'
import '../styles/prism.css'
import styles from '../styles/App.module.css'
import { AppProps } from 'next/app'
import Dots from '../components/Dots'
import Footer from '../components/Footer'
import Header from '../components/Header'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Header />

      <div className={styles.container}>
        <Component {...pageProps} />

        <Dots />

        <Footer />
      </div>
    </div>
  )
}
