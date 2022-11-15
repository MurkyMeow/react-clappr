import { Player } from 'clappr'
import { useClappr } from 'hooks/useClappr'
import { useResetStyles } from 'hooks/useResetStyles'
import ReactDOM from 'react-dom'
import { MediaControl } from 'ui/MediaControl'

export interface AppProps {
  player: Player
}

export default function App(props: AppProps) {
  const { player } = props

  const isMobile = false

  const clappr = useClappr({ player })

  useResetStyles(clappr.container)

  const playerContainer = clappr.container?.$el.get(0)

  return playerContainer
    ? ReactDOM.createPortal(
        <MediaControl clappr={clappr} isMobile={isMobile} />,
        playerContainer
      )
    : null
}
