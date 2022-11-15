import { useEffect } from 'react'

export interface UseShortcutsOptions {
  onPlayPause: () => void
  onSeek: (percentage: number) => void
  onSeekRelative: (delta: number) => void
  onToggleFullscreen: () => void
  onToggleMute: () => void
}

export function useShortcuts(options: UseShortcutsOptions) {
  const {
    onPlayPause,
    onSeek,
    onSeekRelative,
    onToggleMute,
    onToggleFullscreen,
  } = options

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.code

      switch (key) {
        case 'Space':
          return onPlayPause()
        case 'ArrowLeft':
          return onSeekRelative(e.shiftKey ? (e.ctrlKey ? -15 : -10) : -5)
        case 'ArrowRight':
          return onSeekRelative(e.shiftKey ? (e.ctrlKey ? 15 : 10) : 5)
        case 'KeyF':
          return onToggleFullscreen()
        case 'KeyM':
          return onToggleMute()
        case 'Digit1':
        case 'Digit2':
        case 'Digit3':
        case 'Digit4':
        case 'Digit5':
        case 'Digit6':
        case 'Digit7':
        case 'Digit8':
        case 'Digit9':
          return onSeek(Number(key.slice(5)) / 10)
        case 'Digit0':
          return onSeek(0)
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onPlayPause, onSeek, onSeekRelative, onToggleFullscreen, onToggleMute])
}
