import Date from './Date'
import styles from './Post.module.css'

type Props = {
  slug: string[]
  html: string
  date: string
  title: string
}

export default function Linked({ slug, date, title, html }: Props) {
  return (
    <article>
      <h1 className={styles.title}>{title}</h1>
      <Date date={date} type="posts" slug={slug} />

      <div dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  )
}
