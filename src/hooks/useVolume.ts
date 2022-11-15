import { Container } from 'clappr'
import { useEffect, useState } from 'react'

export interface UseVolumeOptions {
  container: Container | undefined
  initialValue: number
  isMuted: boolean
}

export function useVolume(options: UseVolumeOptions) {
  const { container, initialValue, isMuted } = options

  const [_volume, setVolume] = useState(initialValue)

  const volume = isMuted ? 0 : _volume

  useEffect(() => {
    container?.setVolume(volume)
  }, [container, volume])

  return { volume, setVolume }
}
