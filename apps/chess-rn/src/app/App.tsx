import React from 'react'

import { ThemeProvider, theme } from '~/style/stitches.config'

import GameProvider from '~/service/GameProvider'
import UIServicesProvider from '~/service/UIServicesProvider'

import UI from './UI'

const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <UIServicesProvider>
      <GameProvider >
        <UI />
      </GameProvider>
    </UIServicesProvider>
  </ThemeProvider>
)

export default App
