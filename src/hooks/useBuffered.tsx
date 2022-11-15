import { Container, Events, Progress } from 'clappr'
import { useEffect, useState } from 'react'

export function useBuffered(container: Container | undefined) {
  const [buffered, setBuffered] = useState<[number, number]>([0, 0])

  useEffect(() => {
    if (!container) return

    const onProgress = (progress: Progress) => {
      setBuffered([
        progress.start / progress.total,
        progress.current / progress.total,
      ])
    }

    container.on(Events.CONTAINER_PROGRESS, onProgress)

    return () => {
      container.off(Events.CONTAINER_PROGRESS, onProgress)
    }
  }, [container])

  return buffered
}
