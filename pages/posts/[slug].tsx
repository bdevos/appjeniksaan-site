import { GetStaticPaths, GetStaticProps } from 'next'
import { getContent, getSlugs } from '../../lib/content'
import Post from '../../components/Post'

export default function PostPage(props: any) {
    return (
        <Post {...props} />
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = getSlugs('post')
    return {
        paths,
        fallback: false
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const props = await getContent('post', params.slug as string)
    return { props }
}
