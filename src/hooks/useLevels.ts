import { Events, LevelSwitch, Playback } from 'clappr'
import { useCallback, useEffect, useState } from 'react'

export function useLevels(playback: Playback | undefined) {
  const [levels, setLevels] = useState(() => playback?.levels || [])
  const [isAuto, setIsAuto] = useState(true)

  const [currentLevelIndex, _setCurrentLevelIndex] = useState(
    () => playback?.currentLevel || -1
  )

  useEffect(() => {
    if (!playback) return

    const onLevelSwitch = (level: LevelSwitch) => {
      _setCurrentLevelIndex(level.level)
    }

    playback.on(Events.PLAYBACK_LEVELS_AVAILABLE, setLevels)
    playback.on(Events.PLAYBACK_LEVEL_SWITCH, onLevelSwitch)

    return () => {
      playback.off(Events.PLAYBACK_LEVELS_AVAILABLE, setLevels)
      playback.off(Events.PLAYBACK_LEVEL_SWITCH, onLevelSwitch)
    }
  }, [playback])

  const setCurrentLevel = useCallback(
    (levelId: number) => {
      if (!playback) return
      playback.currentLevel = levelId
      _setCurrentLevelIndex(levelId)
      setIsAuto(levelId === -1)
    },
    [playback]
  )

  return {
    levels,
    isAuto,
    currentLevelIndex,
    setCurrentLevel,
  }
}
