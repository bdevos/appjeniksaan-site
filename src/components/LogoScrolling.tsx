import type { FunctionComponent } from 'preact'
import { useEffect } from 'preact/hooks'

export const LogoScrolling: FunctionComponent = () => {
  const element = document.getElementById('logo')

  useEffect(() => {
    const updateOffset = () => {
      const offset = window.pageYOffset
      element?.style.setProperty(
        '--offset',
        `${offset <= -100 ? -200 : (offset % 100) - 100}%`
      )
    }

    window.addEventListener('scroll', updateOffset)

    return () => window.removeEventListener('scroll', updateOffset)
  }, [])

  return null
}
