import { PostArticle } from '../lib/articles'
import Date from './Date'
import styles from './Post.module.css'

export default function Post({ slug, date, title, html, description }: PostArticle) {
  return (
    <article>
      <h1 className={styles.title}>{title}</h1>
      <Date date={date} type="posts" slug={slug} />

      {html && <div dangerouslySetInnerHTML={{ __html: html }} />}
    </article>
  )
}
