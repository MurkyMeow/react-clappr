import Clappr from 'clappr'
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

const source =
  'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8'

const playerWrap = document.getElementById('player_wrap') as HTMLElement

const player = new Clappr.Player({
  source,
  width: '100%',
  height: '100%',
  chromeless: true,
  hideMediaControl: false,
})

player.attachTo(playerWrap)

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <React.StrictMode>
    <App player={player} />
  </React.StrictMode>
)
