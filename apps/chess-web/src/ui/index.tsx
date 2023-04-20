import React from 'react'
import ReactDOM from 'react-dom/client'

import GameProvider from '~/board/GameProvider'
import UIStateProvider from '~/board/UIStateProvider'

import UI from './UI'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

  // Keep in mind!: 
  // https://stackoverflow.com/questions/48846289/why-is-my-react-component-is-rendering-twice
root.render(
  <React.StrictMode>
    <GameProvider >
      <UIStateProvider >
        <UI />
      </UIStateProvider>
    </GameProvider>
  </React.StrictMode>
)

