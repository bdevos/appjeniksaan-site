import { GetStaticPaths, GetStaticProps } from 'next'
import { getContent, getSlugs } from '../../lib/content'
import Linked from '../../components/Linked'

export default function LinkedPage(props: any) {
    return (
        <Linked {...props} />
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = getSlugs('linked')
    return {
        paths,
        fallback: false
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const props = await getContent('linked', params.slug as string[])
    return { props }
}
