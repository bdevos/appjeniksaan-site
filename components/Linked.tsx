import { LinkedArticle } from '../lib/articles'
import Date from './Date'
import styles from './Post.module.css'

export default function Linked({ slug, date, href, title, html }: LinkedArticle) {
  return (
    <article>
      <h1 className={styles.title}>
        <a href={href}>
          <span className={styles.emoji}>🔗 </span>
          <span className={styles.underlined}>{title}</span>
        </a>
      </h1>
      <Date date={date} type="linked" slug={slug} />

      {html && <div dangerouslySetInnerHTML={{ __html: html }} />}
    </article>
  )
}
