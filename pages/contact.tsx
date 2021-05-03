import { GetStaticProps } from 'next'
import { getSnippet } from '../lib/snippets'
import HeadInfo from '../components/HeadInfo'

type Props = {
  html: string
}

export default function Contact({ html }: Props) {
  return (
    <main>
      <HeadInfo title="Contact" url="/contact" />

      <div dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { html } = await getSnippet('contact')

  return {
    props: {
      html,
    },
  }
}
