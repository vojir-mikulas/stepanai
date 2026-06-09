import { useEffect, useRef, useState } from "react"

/**
 * Reveals `fullText` character-by-character when `enabled` is true.
 * Calls `onDone` once the whole string is shown. When disabled, the full
 * text is returned immediately (e.g. for messages loaded from storage).
 */
export function useStreaming(
  fullText: string,
  enabled: boolean,
  onDone?: () => void,
) {
  const [shown, setShown] = useState(enabled ? "" : fullText)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    if (!enabled) {
      setShown(fullText)
      return
    }
    setShown("")
    let i = 0
    let timer: ReturnType<typeof setTimeout>

    const tick = () => {
      i++
      setShown(fullText.slice(0, i))
      if (i >= fullText.length) {
        doneRef.current?.()
        return
      }
      // jittery, human-ish typing speed
      timer = setTimeout(tick, 35 + Math.random() * 70)
    }
    timer = setTimeout(tick, 120)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullText, enabled])

  return { shown, done: shown.length >= fullText.length }
}
