import Link from 'next/link'

type Props = {
    slug: string
    html: string
    date: string
    title: string
}

export default function Linked({ slug, date, title, html }: Props) {
    return (<article>
        <h1>{title}</h1>
        <p><Link href={`/posts/${slug}`}>{date}</Link></p>
        
        <div dangerouslySetInnerHTML={{ __html: html }} />
    </article>)
}