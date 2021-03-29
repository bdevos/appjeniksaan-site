import Head from 'next/head'
import { GetStaticProps } from 'next'
import { getContent } from '../lib/content'

export default function Privacy({ html }) {
  return (
    <main>
      <Head>
        <title>Privacy Policy</title>
      </Head>
      
      <div dangerouslySetInnerHTML={{ __html: html }} />

    </main>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { html } = await getContent('snippet', ['privacy'])
  return {
      props: {
          html
      }
  }
}
