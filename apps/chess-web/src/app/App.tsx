import React from 'react'

import GameProvider from '~/services/GameProvider'
import UIServicesProvider from '~/services/UIServicesProvider'
import SnapshotPersistenceProvider from '~/services/SnapshotPersistenceProvider'

import Layout from './Layout'

const App: React.FC = () => (
  <GameProvider >
    <UIServicesProvider >
      <SnapshotPersistenceProvider>
        <Layout />
      </SnapshotPersistenceProvider>
    </UIServicesProvider>
  </GameProvider>
)

export default App
