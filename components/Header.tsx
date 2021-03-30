import styles from './Header.module.css'
import appStyles from '../styles/App.module.css'
import Link from 'next/link'
import { title } from '../lib/constants'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={appStyles.container}>
        <Link href="/">{title}</Link>
      </div>
    </header>
  )
}
