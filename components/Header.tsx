import styles from './Header.module.css'
import appStyles from '../styles/App.module.css'
import Link from 'next/link'
import { siteTitle } from '../lib/constants'
import useScrollOffset from './useScrollOffset'

export default function Header() {
  const offset = useScrollOffset()

  return (
    <header className={styles.header}>
      <div className={appStyles.container}>
        <Link href="/">
          <a>
            <span>{siteTitle}</span>
            <span aria-hidden="true" className={styles.overlay}>
              <span className={styles.scrollable} style={{ left: `${offset <= -100 ? -200 : (offset % 100) - 100}%` }}>
                {`${siteTitle} ${siteTitle}`}
              </span>
            </span>
          </a>
        </Link>
      </div>
    </header>
  )
}
