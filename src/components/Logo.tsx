import type { FunctionComponent } from 'preact'
import { useEffect, useRef } from 'preact/hooks'

interface Props {
  title: string
}

export const Logo: FunctionComponent<Props> = ({ title }: Props) => {
  const logoRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const updateOffset = () => {
      const offset = window.pageYOffset
      logoRef.current?.style.setProperty(
        '--offset',
        `${offset <= -100 ? -200 : (offset % 100) - 100}%`
      )
    }

    window.addEventListener('scroll', updateOffset)

    return () => window.removeEventListener('scroll', updateOffset)
  }, [])

  return (
    <span class="logo" ref={logoRef}>
      <span>{title}</span>
      <span aria-hidden="true" class="overlay">
        <span class="scrollable">{`${title} ${title}`}</span>
      </span>
    </span>
  )
}
