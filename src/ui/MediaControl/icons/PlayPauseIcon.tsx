import { memo } from 'react'

export interface PlayPauseIconProps {
  isPlaying: boolean
}

export const PlayPauseIcon = memo((props: PlayPauseIconProps) => {
  const { isPlaying } = props

  if (isPlaying) {
    return (
      <svg viewBox="0 0 21 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M7.38 0H.92A.92.92 0 0 0 0 .92v22.16c0 .5.41.92.92.92h6.46c.51 0 .93-.41.93-.92V.92A.92.92 0 0 0 7.38 0Zm12.16 0h-6.46a.92.92 0 0 0-.93.92v22.16c0 .5.42.92.93.92h6.46c.5 0 .92-.41.92-.92V.92a.92.92 0 0 0-.92-.92Z"
          fill="#fff"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="-2 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18.05 11.232 1.435.155A.923.923 0 0 0 0 .923v22.154a.925.925 0 0 0 1.435.768L18.05 12.768a.923.923 0 0 0 0-1.536Z"
        fill="#fff"
      />
    </svg>
  )
})
