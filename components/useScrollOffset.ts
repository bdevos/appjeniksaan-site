import { useEffect, useState } from 'react'

const useScrollOffset = () => {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const updateOffset = () => setOffset(window.pageYOffset)
    window.addEventListener('scroll', updateOffset)
    return () => window.removeEventListener('scroll', updateOffset)
  }, [])

  return offset
}

export default useScrollOffset
