import React from 'react'
import ReactDOM from 'react-dom/client'

import GameProvider from '~/board/GameProvider'
import UIStateProvider from '~/board/UIState'
import PulsesProvider from '~/board/PulseProvider'

import UI from './UI'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
  <React.StrictMode>
    <GameProvider >
    <PulsesProvider>

      <UIStateProvider >
        <UI />
      </UIStateProvider>
      </PulsesProvider>
    </GameProvider>
  </React.StrictMode>
)

