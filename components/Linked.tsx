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
  return (
    <article>
      <h1 className={styles.title}>
        <a href={href}>{title}</a>
      </h1>
      <Date date={date} type="linked" slug={slug} />

      <div dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  )
}
