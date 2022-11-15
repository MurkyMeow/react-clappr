import Tippy from '@tippyjs/react'
import classNames from 'classnames'
import { useBuffered } from 'hooks/useBuffered'
import { ClapprThings } from 'hooks/useClappr'
import { useCurrentTime } from 'hooks/useCurrentTime'
import { useIsPlaying } from 'hooks/useIsPlaying'
import { useLevels } from 'hooks/useLevels'
import { useMouseover } from 'hooks/useMouseover'
import { usePlaybackRate } from 'hooks/usePlaybackRate'
import { useVolume } from 'hooks/useVolume'
import { useCallback, useEffect, useState } from 'react'
import 'tippy.js/animations/perspective.css'
import { Seekbar } from 'ui/Seekbar'
import { Section, Settings, SettingsMenu } from 'ui/SettingsMenu'
import { Volume } from 'ui/Volume'

import css from './MediaControl.module.scss'
import { FullscreenIcon } from './icons/FullscreenIcon'
import { PlayPauseIcon } from './icons/PlayPauseIcon'
import { SettingsIcon } from './icons/SettingsIcon'
import { VolumeIcon } from './icons/VolumeIcon'
import { useShortcuts } from './useShortcuts'

const POPUP_ANIMATION = 'perspective' // depends on the above imported css

function formatTime(time: number) {
  if (!isFinite(time)) return '--:--'
  time = time * 1000
  time = Math.floor(time / 1000)
  const seconds = time % 60
  time = Math.floor(time / 60)
  const minutes = time % 60
  time = Math.floor(time / 60)
  const hours = time % 24
  const days = Math.floor(time / 24)
  let out = ''
  if (days && days > 0) {
    out += days + ':'
    if (hours < 1) out += '00:'
  }
  if (hours && hours > 0) out += ('0' + hours).slice(-2) + ':'
  out += ('0' + minutes).slice(-2) + ':'
  out += ('0' + seconds).slice(-2)
  return out.trim()
}

const POPUP_OFFSET_TOP = 30

const SETTINGS_QUALITY = 'quality'
const SETTINGS_LANGUAGE = 'language'
const SETTINGS_SPEED = 'speed'

export interface MediaControlProps {
  clappr: ClapprThings
  isMobile: boolean
}

const speedOptions = [
  { title: '0.5', value: 0.5 },
  { title: '0.75', value: 0.65 },
  { title: 'Normal', value: 1 },
  { title: '1.1', value: 1.1 },
  { title: '1.25', value: 1.25 },
  { title: '1.5', value: 1.5 },
  { title: '2', value: 2 },
]

export function MediaControl(props: MediaControlProps) {
  const { clappr, isMobile } = props
  const { player, core, playback, container, options } = clappr

  const [mobileVisible, setMobileVisible] = useState(false)

  useEffect(() => {
    if (mobileVisible) {
      const timeout = Number(options.hideMediaControlDelay) || 2000
      const hideTimeout = setTimeout(() => setMobileVisible(false), timeout)

      return () => {
        clearTimeout(hideTimeout)
      }
    }
  }, [mobileVisible, options.hideMediaControlDelay])

  const currentTime = useCurrentTime(playback)
  const isPlaying = useIsPlaying(playback)
  const isMouseOver = useMouseover(core)

  const [isMuted, setIsMuted] = useState(false)
  const { volume, setVolume } = useVolume({
    container,
    isMuted,
    initialValue: 0.5,
  })

  const [bufferedStart, bufferedEnd] = useBuffered(container)
  const { playbackRate, setPlaybackRate } = usePlaybackRate(container)
  const { currentLevelIndex, setCurrentLevel, levels, isAuto } =
    useLevels(playback)

  const currentLevel = levels[currentLevelIndex]
  const autoQualityLabel = `AUTO${
    currentLevel && isAuto ? ` (${currentLevel.label})` : ''
  }`

  const sections: Section[] = [
    {
      id: SETTINGS_QUALITY,
      title: 'Quality',
      options: [
        { title: autoQualityLabel, value: -1 },
        ...levels.map((level) => ({ title: level.label, value: level.id })),
      ],
    },
    {
      id: SETTINGS_LANGUAGE,
      title: 'Language',
      options: [],
    },
    {
      id: SETTINGS_SPEED,
      title: 'Speed',
      defaultOption: 2,
      options: speedOptions,
    },
  ]

  const settings: Settings = {
    [SETTINGS_SPEED]: playbackRate,
    [SETTINGS_QUALITY]: isAuto ? -1 : levels[currentLevelIndex]?.id,
    [SETTINGS_LANGUAGE]: 0,
  }

  const onSettingsChange = useCallback(
    (sectionId: string, value: number) => {
      switch (sectionId) {
        case SETTINGS_SPEED:
          return setPlaybackRate(value)
        case SETTINGS_QUALITY:
          return setCurrentLevel(value)
        case SETTINGS_LANGUAGE:
          return
      }
    },
    [setCurrentLevel, setPlaybackRate]
  )

  const onSeek = useCallback(
    (percentage: number) => {
      player.seekPercentage(percentage * 100)
    },
    [player]
  )

  const onSeekRelative = useCallback(
    (delta: number) => {
      const currentTime = player.getCurrentTime()
      const duration = player.getDuration()

      let position = Math.min(Math.max(currentTime + delta, 0), duration)
      position = Math.min((position * 100) / duration, 100)

      player.seekPercentage(position)
    },
    [player]
  )

  const onPlayPause = useCallback(() => {
    if (isPlaying) {
      player.pause()
    } else {
      player.play()
    }
  }, [isPlaying, player])

  const onToggleFullscreen = useCallback(() => {
    core?.toggleFullscreen()
  }, [core])

  const onToggleMute = useCallback(() => {
    setIsMuted((muted) => !muted)
  }, [])

  useShortcuts({
    onPlayPause,
    onSeek,
    onSeekRelative,
    onToggleMute,
    onToggleFullscreen,
  })

  const seekbar = (
    <Seekbar
      currentTime={currentTime.current}
      duration={currentTime.total}
      bufferedStart={bufferedStart}
      bufferedEnd={bufferedEnd}
      onSeek={onSeek}
    />
  )

  if (isMobile) {
    return (
      <div
        className={classNames({
          [css.root]: true,
          [css.mobileRoot]: true,
          [css.mobileRootHidden]: isPlaying && !mobileVisible,
        })}
        onClick={() => setMobileVisible(true)}
      >
        <div className={css.top}>
          <div className={css.panel}>
            <div className={css.left}>
              <button className={css.btn} onClick={onToggleMute}>
                <VolumeIcon value={volume} />
              </button>
            </div>
            <div className={css.center} />
            <div className={css.right}>
              <button className={css.btn}>
                <SettingsIcon />
              </button>
            </div>
          </div>
        </div>
        <div className={css.centerBtnWrap}>
          <button
            className={css.centerBtn}
            aria-label="playpause"
            onClick={onPlayPause}
          >
            <PlayPauseIcon isPlaying={isPlaying} />
          </button>
        </div>
        <div className={css.bottom}>
          <div className={css.panel}>
            <div className={css.left}>
              <div className={css.time}>
                {`${formatTime(currentTime.current)} / ${formatTime(
                  currentTime.total
                )}`}
              </div>
            </div>
            <div className={css.center}>{seekbar}</div>
            <div className={css.right}>
              <button className={css.btn} onClick={onToggleFullscreen}>
                <FullscreenIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={classNames({
        [css.root]: true,
        [css.desktopRoot]: true,
        [css.desktopRootHidden]: !isMouseOver,
      })}
    >
      <div className={css.bottom}>
        <div className={css.seekbar}>{seekbar}</div>
        <div className={css.panel}>
          <div className={css.left}>
            <div>
              <button className={css.btn} onClick={onPlayPause}>
                <PlayPauseIcon isPlaying={isPlaying} />
              </button>
            </div>
            <div>
              <Tippy
                interactive
                animation={POPUP_ANIMATION}
                hideOnClick={false}
                offset={[0, POPUP_OFFSET_TOP]}
                content={<Volume value={volume} onChange={setVolume} />}
              >
                <button className={css.btn} onClick={onToggleMute}>
                  <VolumeIcon value={volume} />
                </button>
              </Tippy>
            </div>
            <div className={css.time}>
              {`${formatTime(currentTime.current)} / ${formatTime(
                currentTime.total
              )}`}
            </div>
          </div>
          <div className={css.center} />
          <div className={css.right}>
            <div>
              <Tippy
                interactive
                animation={POPUP_ANIMATION}
                placement="top-end"
                hideOnClick={false}
                offset={[35, POPUP_OFFSET_TOP]}
                content={
                  <SettingsMenu
                    sections={sections}
                    isMobile={false}
                    settings={settings}
                    onChange={onSettingsChange}
                  />
                }
              >
                <button className={css.btn}>
                  <SettingsIcon />
                </button>
              </Tippy>
            </div>
            <div>
              <button className={css.btn} onClick={onToggleFullscreen}>
                <FullscreenIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
