import styles from './Footer.module.css'
import Link from 'next/link'

export default function Footer() {
    return (<footer className={styles.footer}>
        <div>
            <p className={styles.copy}>Links</p>
            <ul className={styles.list}>
                <li>
                    Archive
                </li>
                <li>
                    <a href="https://twitter.com/appjeniksaan">Twitter</a>
                </li>
                <li>
                    <Link href="/privacy">Privacy Policy</Link>
                </li>
            </ul>
        </div>
        <div>
            <p className={styles.copy}>&copy; 2021-present Appjeniksaan</p>
        </div>
    </footer>)
}
