import { Container } from 'clappr'
import { useEffect, useState } from 'react'

export function usePlaybackRate(
  container: Container | undefined,
  initialValue = 1
) {
  const [playbackRate, setPlaybackRate] = useState(initialValue)

  useEffect(() => {
    if (!container) return

    const video = container.$el.find('video').get(0)

    if (!video || !(video instanceof HTMLVideoElement)) {
      console.error('Could not find a video element inside the player')
      return
    }

    video.playbackRate = playbackRate

    // после инициализации плеера скорость воспроизведения слетает, ставим её заново
    const onLoadedMetadata = () => {
      video.playbackRate = playbackRate
    }

    video.addEventListener('loadedmetadata', onLoadedMetadata)

    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
    }
  }, [container, playbackRate])

  return { playbackRate, setPlaybackRate }
}
