import Head from 'next/head'
import { GetStaticProps } from 'next'
import { getContent } from '../lib/content'

export default function Contact({ html }) {
  return (
    <main>
      <Head>
        <title>Contact</title>
      </Head>

      <div dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { html } = await getContent('snippet', ['contact'])
  return {
    props: {
      html,
    },
  }
}
