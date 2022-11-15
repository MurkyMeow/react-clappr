import { Events, Playback } from 'clappr'
import { useEffect, useState } from 'react'

export function useIsPlaying(playback: Playback | undefined): boolean {
  const [isPlaying, setIsPlaying] = useState(() =>
    playback ? playback.isPlaying() : false
  )

  useEffect(() => {
    if (!playback) return

    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)

    playback.on(Events.PLAYBACK_PLAY, onPlay)
    playback.on(Events.PLAYBACK_PLAY_INTENT, onPlay)
    playback.on(Events.PLAYBACK_PAUSE, onPause)

    return () => {
      playback.off(Events.PLAYBACK_PLAY, onPlay)
      playback.off(Events.PLAYBACK_PLAY_INTENT, onPlay)
      playback.off(Events.PLAYBACK_PAUSE, onPause)
    }
  }, [playback])

  return isPlaying
}
