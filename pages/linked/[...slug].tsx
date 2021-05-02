import { GetStaticPaths } from 'next'
import { getArticle, getSlugs, LinkedArticle } from '../../lib/articles'
import Linked from '../../components/Linked'

type Props = {
  article: LinkedArticle
}

type GetStaticPropsParams = {
  params: {
    slug: string[]
  }
}

export default function LinkedPage({ article }: Props) {
  return <Linked {...article} />
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getSlugs('linked')
  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps = async ({ params }: GetStaticPropsParams) => {
  const article = (await getArticle('linked', params.slug)) as LinkedArticle
  return { props: { article } }
}
