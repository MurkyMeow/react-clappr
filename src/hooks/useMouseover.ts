import { Core, Events } from 'clappr'
import { useEffect, useState } from 'react'

export function useMouseover(core: Core | undefined) {
  const [isMouseOver, setIsMouseOver] = useState(false)

  useEffect(() => {
    if (!core) return

    const onMouseMove = () => {
      setIsMouseOver(true)
    }
    const onMouseLeave = () => {
      setIsMouseOver(false)
    }

    core.on(Events.CORE_MOUSE_MOVE, onMouseMove)
    core.on(Events.CORE_MOUSE_LEAVE, onMouseLeave)

    return () => {
      core.off(Events.CORE_MOUSE_MOVE, onMouseMove)
      core.off(Events.CORE_MOUSE_LEAVE, onMouseLeave)
    }
  }, [core])

  return isMouseOver
}
