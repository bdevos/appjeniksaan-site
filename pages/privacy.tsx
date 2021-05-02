import Head from 'next/head'
import { GetStaticProps } from 'next'
import { getSnippet } from '../lib/snippets'

type Props = {
  html: string
}

export default function Privacy({ html }: Props) {
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
  const { html } = await getSnippet('privacy')

  return {
    props: {
      html,
    },
  }
}
