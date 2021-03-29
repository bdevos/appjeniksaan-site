import { format, parseISO } from 'date-fns'
import Link from 'next/link'
import { ContentType } from '../lib/content'
import styles from './Date.module.css'

type Props = {
    date: string
    type: 'posts' | 'linked'
    slug: string[]
}

export default function Date({ date, type, slug }: Props) {
    return <div className={styles.date}>
        <Link href={`/${type}/${slug.join('/')}`}>
            <a>
                {format(parseISO(date), 'LLLL d, yyyy')}
            </a>
        </Link>
    </div>
}
