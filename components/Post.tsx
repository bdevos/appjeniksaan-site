import Link from 'next/link'
import Date from './Date'

type Props = {
    slug: string[]
    html: string
    date: string
    title: string
}

export default function Linked({ slug, date, title, html }: Props) {
    return (<article>
        <h1>{title}</h1>
        <p>
            <Link href={`/posts/${slug.join('/')}`}>
                <a>
                    <Date date={date} />
                </a>
            </Link>
        </p>
        
        <div dangerouslySetInnerHTML={{ __html: html }} />
    </article>)
}