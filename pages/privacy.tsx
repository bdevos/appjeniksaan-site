import { GetStaticProps } from 'next'
import { getSnippet } from '../lib/snippets'
import HeadInfo from '../components/HeadInfo'

type Props = {
  html: string
}

export default function Privacy({ html }: Props) {
  return (
    <main>
      <HeadInfo title="Privacy Policy" url="/privacy" />

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
