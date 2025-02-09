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
