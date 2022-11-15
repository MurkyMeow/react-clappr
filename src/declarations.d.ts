declare module '*.scss' {
  const content: Record<string, string>
  export default content
}

declare module 'clappr' {
  const Clappr: any

  export interface PlayerOptions {
    [key: string]: unknown
    source?: string
    chromeless?: boolean
    hideMediaControl?: boolean
  }

  export enum Events {
    CORE_READY = 'core:ready',
    CORE_OPTIONS_CHANGE = 'core:options:change',
    CORE_MOUSE_MOVE = 'core:mouse:move',
    CORE_MOUSE_LEAVE = 'core:mouse:leave',
    CORE_ACTIVE_CONTAINER_CHANGED = 'core:active:container:changed',
    PLAYBACK_PLAY = 'playback:play',
    PLAYBACK_PLAY_INTENT = 'playback:play:intent',
    PLAYBACK_PAUSE = 'playback:pause',
    PLAYBACK_TIMEUPDATE = 'playback:timeupdate',
    PLAYBACK_LEVELS_AVAILABLE = 'playback:levels:available',
    PLAYBACK_LEVEL_SWITCH = 'playback:level:switch',
    MEDIACONTROL_RENDERED = 'mediacontrol:rendered',
    MEDIACONTROL_HIDE = 'mediacontrol:hide',
    MEDIACONTROL_SHOW = 'mediacontrol:show',
    CONTAINER_PROGRESS = 'container:progress',
  }

  export interface CurrentTime {
    current: number
    total: number
  }

  export interface Progress {
    total: number
    start: number
    current: number
  }

  export interface ClapprListeners {
    [Events.CORE]: () => void
    [Events.CORE_OPTIONS_CHANGE]: (changes: Partial<PlayerOptions>) => void
    [Events.CORE_MOUSE_MOVE]: () => void
    [Events.CORE_MOUSE_LEAVE]: () => void
    [Events.CORE_READY]: () => void
    [Events.CORE_ACTIVE_CONTAINER_CHANGED]: () => void
    [Events.MEDIACONTROL_RENDERED]: () => void
    [Events.MEDIACONTROL_HIDE]: () => void
    [Events.MEDIACONTROL_SHOW]: () => void
    [Events.PLAYBACK_PLAY]: () => void
    [Events.PLAYBACK_PLAY_INTENT]: () => void
    [Events.PLAYBACK_PAUSE]: () => void
    [Events.PLAYBACK_TIMEUPDATE]: (t: CurrentTime) => void
    [Events.PLAYBACK_LEVELS_AVAILABLE]: (levels: Level[]) => void
    [Events.PLAYBACK_LEVEL_SWITCH]: (level: LevelSwitch) => void
    [Events.CONTAINER_PROGRESS]: (progress: Progress) => void
  }

  export interface ClapprEventEmitter {
    on<E extends keyof ClapprListeners>(
      event: E,
      listener: ClapprListeners[E]
    ): void

    once<E extends keyof ClapprListeners>(
      event: E,
      listener: ClapprListeners[E]
    ): void

    off<E extends keyof ClapprListeners>(
      event: E,
      listener?: ClapprListeners[E]
    ): void
  }

  export interface Container extends ClapprEventEmitter {
    $el: ZeptoCollection
    setVolume: (value: number) => void
  }

  export interface Level {
    id: number
    label: string
  }

  export interface LevelSwitch {
    level: number
  }

  export interface Playback extends ClapprEventEmitter {
    levels: Level[]
    currentLevel: number
    seek: (time: number) => void
    isPlaying: () => boolean
  }

  export interface MediaControl extends ClapprEventEmitter {
    $el: ZeptoCollection
  }

  export interface Core extends ClapprEventEmitter {
    getCurrentContainer(): Container
    getCurrentPlayback(): Playback
    toggleFullscreen(): void
    mediaControl: MediaControl
  }

  export interface Player extends ClapprEventEmitter {
    core?: Core
    options: PlayerOptions

    new (options: PlayerOptions): Player

    configure(options: Partial<PlayerOptions>): void

    attachTo(node: Element): void
    destroy(): void

    play(): void
    pause(): void

    getPlaybackRate(): number
    getCurrentTime(): number
    getDuration(): number

    seekPercentage(percentage: number): void

    listenTo(
      target: Core | Container,
      event: Events,
      callback: () => void
    ): void

    stopListening(target: Core | Container, event: Events): void
  }

  declare const Player: Player

  export default {
    Clappr,
    Player,
  }
}
