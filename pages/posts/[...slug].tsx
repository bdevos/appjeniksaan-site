import { GetStaticPaths } from 'next'
import { PostArticle, getArticle, getSlugs } from '../../lib/articles'
import Post from '../../components/Post'
import HeadInfo from '../../components/HeadInfo'

type Props = {
  article: PostArticle
}

type GetStaticPropsParams = {
  params: {
    slug: string[]
  }
}

export default function PostPage({ article }: Props) {
  return (
    <>
      <HeadInfo
        title={article.title}
        description={article.description}
        url={`/posts/${article.slug.join('/')}`}
        type="article"
      />
      <Post {...article} />
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getSlugs('post')
  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps = async ({ params }: GetStaticPropsParams) => {
  const article = (await getArticle('post', params.slug)) as PostArticle
  return { props: { article } }
}
