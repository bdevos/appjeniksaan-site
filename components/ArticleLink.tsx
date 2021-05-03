import { format, parseISO } from 'date-fns'
import Link from 'next/link'
import styles from './ArticleLink.module.css'
import { BaseArticle, LinkedArticle, PostArticle } from '../lib/articles'

type Props = {
  article: BaseArticle
}

type LinkedLinkProps = {
  article: LinkedArticle
}

type PostLinkProps = {
  article: PostArticle
}

const LinkedLink = ({ article }: LinkedLinkProps) => (
  <>
    <span className={styles.date}>{format(parseISO(article.date), 'do')}</span>
    <a className={styles.link} href={article.href}>
      🔗
    </a>
    <Link href={`/linked/${article.slug.join('/')}`}>{article.title}</Link>
  </>
)

const PostLink = ({ article }: PostLinkProps) => (
  <>
    <span className={styles.date}>{format(parseISO(article.date), 'do')}</span>
    <Link href={`/posts/${article.slug.join('/')}`}>{article.title}</Link>
  </>
)

export default function ArticleLink({ article }: Props) {
  return (
    <li>
      {article.type == 'linked' && <LinkedLink article={article as LinkedArticle} />}
      {article.type == 'post' && <PostLink article={article as PostArticle} />}
    </li>
  )
}
