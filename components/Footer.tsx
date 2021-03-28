import styles from './Footer.module.css'
import Link from 'next/link'

export default function Footer() {
    return (<footer className={styles.footer}>
        <div>
            <ul className={styles.list}>
                <li>
                    <Link href="/posts">Posts</Link> / <Link href="/linked">Linked</Link>
                </li>
                <li>
                    <Link href="https://twitter.com/appjeniksaan">Twitter</Link>
                </li>
                <li>
                    <Link href="/contact">Contact</Link>
                </li>
                <li>
                    <Link href="/privacy">Privacy Policy</Link>
                </li>
            </ul>
        </div>
        <div>
            <p className={styles.copy}>Copyright &copy; 2021-present Appjeniksaan</p>
        </div>
    </footer>)
}
