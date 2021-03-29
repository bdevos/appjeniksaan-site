import { format, parseISO } from 'date-fns'

type Props = {
    date: string
}

export default function Date({ date }: Props) {
    return <span>{format(parseISO(date), 'LLLL d, yyyy')}</span>
}
