import Head from 'next/head'
import { GetStaticProps } from 'next'
import { snippet } from '../lib/snippets'

export default function Home({ privacy }) {
  return (
    <main>
      <Head>
        <title>Privacy Policy</title>
      </Head>
      
      <div dangerouslySetInnerHTML={{ __html: privacy.html }} />

    </main>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const privacy = await snippet('privacy')
  return {
      props: {
          privacy
      }
  }
}
