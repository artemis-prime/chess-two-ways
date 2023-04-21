import React from 'react'
import ReactDOM from 'react-dom/client'

import GameProvider from '~/service/GameProvider'
import UIServicesProvider from '~/service/UIServicesProvider'

import UI from './UI'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

  // Keep in mind!: 
  // https://stackoverflow.com/questions/48846289/why-is-my-react-component-is-rendering-twice
root.render(
  <React.StrictMode>
    <GameProvider >
      <UIServicesProvider >
        <UI />
      </UIServicesProvider>
    </GameProvider>
  </React.StrictMode>
)

