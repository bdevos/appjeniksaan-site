const domainRegex = /^https?:\/\/+(www\.)?(?<domain>.*?)(\/|$)/i

export const extractDomain = (href: string) =>
  domainRegex.exec(href)?.groups?.domain
