import Link from 'next/link'
import Date from './Date'
import styles from './Post.module.css'

type Props = {
    slug: string[]
    html: string
    date: string
    title: string
    href: string
}

export default function Linked({ slug, date, href, title, html }: Props) {
    return (<article>
        
        <h1 className={styles.title}>
            <a href={href}>{title}</a>
        </h1>
        <div className={styles.date}>
            <Link href={`/linked/${slug.join('/')}`}>
                <a>
                    <Date date={date} />
                </a>
            </Link>
        </div>
        
        <div dangerouslySetInnerHTML={{ __html: html }} />
    </article>)
}