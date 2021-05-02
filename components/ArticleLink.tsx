import { format, parseISO } from 'date-fns'
import Link from 'next/link'
import styles from './ArticleLink.module.css'
import { Article, LinkedArticle, PostArticle } from '../lib/articles'

type Props = {
  article: Article
}

type LinkedLinkProps = {
  article: LinkedArticle
}

type PostLinkProps = {
  article: PostArticle
}

const LinkedLink = ({ article }: LinkedLinkProps) => (
  <>
    <a href={article.href}>🔗</a>
    <Link href={`/linked/${article.slug.join('/')}`}>{article.title}</Link>
    <span className={styles.date}>{format(parseISO(article.date), 'LLLL d')}</span>
  </>
)

const PostLink = ({ article }: PostLinkProps) => (
  <>
    <Link href={`/posts/${article.slug.join('/')}`}>{article.title}</Link>
    <span className={styles.date}>{format(parseISO(article.date), 'LLLL d')}</span>
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
