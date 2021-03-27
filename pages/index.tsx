import { GetStaticProps } from 'next'
import { snippet } from '../lib/snippets'
import Dots from '../components/Dots'

export default function Home({ about }) {
  return (
    <div>
      <main>
        PLACEHOLDER
      </main>

      <Dots />

      <div dangerouslySetInnerHTML={{ __html: about.html }} />

    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const about = await snippet('about')
  return {
    props: {
      about
    }
  }
}
