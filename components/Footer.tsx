import Link from 'next/link'
import styles from './Footer.module.css'
import Emoji from './Emoji'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div>
        <ul className={styles.list}>
          <li>
            <Link href="/archive">
              <a>
                Archive <Emoji emoji="🗄" label="Archive" />
              </a>
            </Link>
          </li>
          <li>
            <Link href="/privacy">Privacy Policy</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
      </div>
      <div>
        <p className={styles.copy}>Copyright &copy; 2021-present Appjeniksaan</p>
      </div>
    </footer>
  )
}
