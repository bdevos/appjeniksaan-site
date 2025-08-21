export const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

export const dayFormatter = new Intl.DateTimeFormat('en-US', { day: '2-digit' })

export const monthFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
})

export const formatMonth = (input: string) => {
  const [year, month] = input.split('-').map((value) => parseInt(value, 10))

  return monthFormatter.format(new Date(`${year}-${month}`))
}

export const amsDate = (input: string) => {
  const [datePart, timePart] = input.trim().split(/\s+/)
  const [Y, M, D] = datePart.split('-').map(Number)
  const [h, m] = timePart.split(':').map(Number)

  const guessUtc = Date.UTC(Y, M - 1, D, h, m, 0)

  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Amsterdam',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
  const parts = Object.fromEntries(
    fmt.formatToParts(new Date(guessUtc)).map((p) => [p.type, p.value]),
  )
  const shownUtc = Date.UTC(
    +parts.year,
    +parts.month - 1,
    +parts.day,
    +parts.hour,
    +parts.minute,
  )
  const offsetMs = shownUtc - guessUtc
  return new Date(guessUtc - offsetMs)
}
