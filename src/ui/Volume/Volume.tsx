import classNames from 'classnames'
import { MouseEvent, useEffect, useRef, useState } from 'react'

import css from './Volume.module.scss'

export interface VolumeProps {
  /**
   * percentage value from 0 to 1
   */
  value: number

  onChange: (value: number) => void
}

export function Volume(props: VolumeProps) {
  const { value, onChange } = props

  const [isDragging, setIsDragging] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)

  const getVolumeFromUIEvent = (pageY: number): number => {
    const bar = barRef.current
    if (!bar) return 0

    const { top, height } = bar.getBoundingClientRect()

    const yb = top + height
    const delta = yb - pageY

    return Math.min(1, Math.max(0, delta / height))
  }

  const onVolumeClick = (e: MouseEvent<HTMLDivElement>) => {
    onChange(getVolumeFromUIEvent(e.pageY))
  }

  const onDragStart = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.preventDefault()
    setIsDragging(true)
  }

  useEffect(() => {
    if (!isDragging) return

    const bar = barRef.current
    if (!bar) return

    const onPointerMove = (e: globalThis.MouseEvent) => {
      onChange(getVolumeFromUIEvent(e.pageY))
    }

    const onPointerUp = () => {
      setIsDragging(false)
    }

    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerup', onPointerUp)
    document.addEventListener('touchend', onPointerUp)

    return () => {
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', onPointerUp)
      document.removeEventListener('touchend', onPointerUp)
    }
  }, [isDragging, onChange])

  return (
    <div className={css.root} onClick={onVolumeClick}>
      <div className={css.bar} ref={barRef}>
        <div
          className={classNames({
            [css.scrubber]: true,
            [css.scrubberDragging]: isDragging,
          })}
          onPointerDown={onDragStart}
        />
        <div className={css.barValue} style={{ height: `${value * 100}%` }} />
      </div>
    </div>
  )
}
