import classNames from 'classnames'
import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react'

import css from './Seekbar.module.scss'

export interface SeekbarProps {
  currentTime: number
  duration: number
  bufferedStart: number
  bufferedEnd: number
  onSeek: (percentage: number) => void
}

export function Seekbar(props: SeekbarProps) {
  const { currentTime, duration, bufferedStart, bufferedEnd, onSeek } = props

  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const seekbarRef = useRef<HTMLDivElement>(null)

  const progressWidth = `${(currentTime / duration) * 100}%`

  const onSeekbarClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const value = (e.pageX - rect.left) / rect.width
      onSeek(Math.max(0, Math.min(1, value)))
      setIsDragging(false)
    },
    [onSeek]
  )

  const onDragStart = useCallback(() => {
    setIsDragging(true)
  }, [])

  const onDragEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (!isDragging) return

    const seekbar = seekbarRef.current
    if (!seekbar) return

    const onMouseMove = (e: globalThis.MouseEvent | TouchEvent) => {
      const clientX =
        e instanceof globalThis.MouseEvent ? e.clientX : e.touches[0].clientX
      onSeek(Math.max(0, Math.min(1, clientX / seekbar.clientWidth)))
    }

    const onMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('touchmove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('touchend', onMouseUp)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('touchmove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('touchend', onMouseUp)
    }
  }, [isDragging, onSeek])

  return (
    <div
      className={css.root}
      onMouseDown={onDragStart}
      onTouchStart={onDragStart}
      onTouchEnd={onDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSeekbarClick}
      ref={seekbarRef}
    >
      <div className={css.background}>
        <div
          className={css.buffering}
          style={{
            left: `${bufferedStart * 100}%`,
            width: `${(bufferedEnd - bufferedStart) * 100}%`,
          }}
        />
        <div className={css.progress} style={{ width: progressWidth }} />
      </div>
      <div
        className={classNames({
          [css.scrubber]: true,
          [css.scrubberHover]: isHovered,
        })}
        style={{ left: progressWidth }}
      />
      <div className={css.hover} />
    </div>
  )
}
