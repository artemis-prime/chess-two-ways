  // @ts-ignore
import React from 'react'

import GameProvider from '~/service/GameProvider'
import UIServicesProvider from '~/service/UIServicesProvider'

import UI from './UI'

const App: React.FC = () => (
  <GameProvider >
    <UIServicesProvider >
      <UI />
    </UIServicesProvider>
  </GameProvider>
)

export default App
