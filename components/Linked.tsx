import Link from 'next/link'

type Props = {
    slug: string
    html: string
    date: string
    title: string
    href: string
}

export default function Linked({ slug, date, href, title, html }: Props) {
    return (<article>
        
        <h1><a href={href}>{title}</a></h1>
        <p><Link href={`/linked/${slug}`}>{date}</Link></p>
        
        <div dangerouslySetInnerHTML={{ __html: html }} />
    </article>)
}