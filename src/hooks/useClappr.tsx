import {
  Container,
  Core,
  Events,
  Playback,
  Player,
  PlayerOptions,
} from 'clappr'
import { useEffect, useState } from 'react'

export interface UseClapprOptions {
  player: Player
}

export interface ClapprThings {
  player: Player
  core: Core | undefined
  playback: Playback | undefined
  container: Container | undefined
  options: PlayerOptions
}

export function useClappr(options: UseClapprOptions): ClapprThings {
  const { player } = options

  const [core, setCore] = useState(() => player.core)
  const [container, setContainer] = useState(() => core?.getCurrentContainer())
  const [playback, setPlayback] = useState(() => core?.getCurrentPlayback())
  const [playerOptions, setPlayerOptions] = useState(() => player.options)

  useEffect(() => {
    if (!core) return

    const setContainers = () => {
      const newCore = player.core
      setCore(newCore)

      if (newCore) {
        setContainer(newCore.getCurrentContainer())
        setPlayback(newCore.getCurrentPlayback())
      }
    }

    setContainers()

    const configure = (changedOptions: Partial<PlayerOptions>) => {
      setPlayerOptions((options) => ({ ...options, changedOptions }))
    }

    core.on(Events.CORE_ACTIVE_CONTAINER_CHANGED, setContainers)
    core.on(Events.CORE_OPTIONS_CHANGE, configure)

    return () => {
      core.off(Events.CORE_ACTIVE_CONTAINER_CHANGED, setContainers)
      core.off(Events.CORE_OPTIONS_CHANGE, configure)
    }
  }, [core, player])

  return { player, core, container, playback, options: playerOptions }
}
