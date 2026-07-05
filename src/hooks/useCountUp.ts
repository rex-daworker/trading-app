import { useEffect, useRef, useState } from 'react'

export function useCountUp(target: number, duration = 600) {
  const [display, setDisplay] = useState(target)
  const displayRef = useRef(target)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    const from = displayRef.current
    const to = target
    if (from === to) return

    let start: number | null = null
    const tick = (now: number) => {
      if (start === null) start = now
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
      const current = from + (to - from) * eased
      displayRef.current = current
      setDisplay(current)
      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        displayRef.current = to
        setDisplay(to)
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [target, duration])

  return display
}