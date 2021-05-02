import { format } from 'date-fns'

type Props = {
  id: string
}

export default function MonthHeader({ id }: Props) {
  const [year, month] = id.split('-')
  const date = new Date(parseInt(year), parseInt(month), 1)

  return <h2>{format(date, 'MMMM, yyyy')}</h2>
}
