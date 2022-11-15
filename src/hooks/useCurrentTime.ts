import { Events, Playback } from 'clappr'
import { useEffect, useState } from 'react'

export function useCurrentTime(playback: Playback | undefined) {
  const [currentTime, setCurrentTime] = useState(() => ({
    current: 0,
    total: 0,
  }))

  useEffect(() => {
    if (!playback) return

    playback.on(Events.PLAYBACK_TIMEUPDATE, setCurrentTime)

    return () => {
      playback.off(Events.PLAYBACK_TIMEUPDATE, setCurrentTime)
    }
  }, [playback])

  return currentTime
}
