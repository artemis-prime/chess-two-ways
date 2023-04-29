import React from 'react'

import GameProvider from '~/services/GameProvider'
import UIServicesProvider from '~/services/UIServicesProvider'

import Layout from './Layout'

const App: React.FC = () => (
  <GameProvider >
    <UIServicesProvider >
      <Layout />
    </UIServicesProvider>
  </GameProvider>
)

export default App
