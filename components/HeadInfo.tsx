import Head from 'next/head'
import { host, siteDescription, siteTitle } from '../lib/constants'

type Props = {
  title?: string
  description?: string
  url?: string
  type?: 'website' | 'article'
}

export default function HeadInfo({ title, description, url = '', type = 'website' }: Props) {
  const newTitle = title ? `${title} - ${siteTitle}` : siteTitle

  return (
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />

      <title>{newTitle}</title>
      <meta property="og:title" content={newTitle} />

      <meta name="description" content={description ? description : siteDescription} />
      <meta property="og:description" content={description ? description : siteDescription} />

      <meta property="og:type" content={type} />
      <meta property="og:url" content={`${host}${url}`} />
      <link rel="canonical" href={`${host}${url}`} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:creator" content="@appjeniksaan" />

      <meta name="theme-color" content="#f9f5e3" />

      <link rel="icon" href="/favicon.ico" />

      <link rel="alternate" type="application/rss+xml" title="RSS Feed for Appjeniksaan" href="/feed/rss.xml" />
      <link rel="alternate" type="application/atom+xml" title="Atom Feed for Appjeniksaan" href="/feed/atom.xml" />
      <link rel="alternate" type="application/feed+json" title="JSON Feed for Appjeniksaan" href="/feed/feed.json" />
    </Head>
  )
}
