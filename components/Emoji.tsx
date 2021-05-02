type Props = {
  emoji: string
  label: string
}

export default function Emoji({ emoji, label }: Props) {
  return (
    <span role="img" aria-label={label}>
      {emoji}
    </span>
  )
}
