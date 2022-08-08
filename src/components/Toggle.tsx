import type { FunctionComponent } from 'preact'
import { useState, useEffect } from 'preact/hooks'

type ColorScheme = 'light' | 'dark'

const setProperties = (colorScheme: ColorScheme) => {
  document.documentElement.style.setProperty(
    '--text-color',
    `var(--${colorScheme}-text-color)`
  )
  document.documentElement.style.setProperty(
    '--background-color',
    `var(--${colorScheme}-background-color)`
  )
  document.documentElement.style.setProperty(
    '--highlight-color',
    `var(--${colorScheme}-highlight-color)`
  )
}

const initialColorScheme = (): ColorScheme => {
  if (localStorage.getItem('colorScheme')) {
    return localStorage.getItem('colorScheme') as ColorScheme
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

const setHeaderColorScheme = (colorScheme: ColorScheme) => {
  const headerElements = document.getElementsByTagName('header')

  for (const headerElement of headerElements) {
    headerElement.setAttribute('data-color-scheme', colorScheme)
  }
}

export const Toggle: FunctionComponent = () => {
  const [colorScheme, setColorScheme] =
    useState<ColorScheme>(initialColorScheme)

  useEffect(() => {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (event) => {
        if (!localStorage.getItem('colorScheme')) {
          const colorScheme = event.matches ? 'dark' : 'light'
          setColorScheme(colorScheme)
          setHeaderColorScheme(colorScheme)
        }
      })
  }, [])

  const handleClick = () => {
    const newColorScheme = colorScheme === 'dark' ? 'light' : 'dark'

    setProperties(newColorScheme)
    setColorScheme(newColorScheme)
    setHeaderColorScheme(newColorScheme)
    localStorage.setItem('colorScheme', newColorScheme)
  }

  return (
    <div class="toggle-button" onClick={handleClick}>
      {colorScheme === 'dark' ? '🔆' : '🌒'}
    </div>
  )
}
