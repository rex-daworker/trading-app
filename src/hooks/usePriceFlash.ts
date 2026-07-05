import { useEffect, useRef, useState } from 'react'

export function usePriceFlash(value: number) {
  const prevRef = useRef(value)
  const [flash, setFlash] = useState<'up' | 'down' | null>(null)

  useEffect(() => {
    const prev = prevRef.current
    if (value > prev) setFlash('up')
    else if (value < prev) setFlash('down')
    prevRef.current = value
  }, [value])

  useEffect(() => {
    if (!flash) return
    const id = setTimeout(() => setFlash(null), 600)
    return () => clearTimeout(id)
  }, [flash])

  return flash
}