import React from 'react'

import { ThemeProvider, theme } from '~/style/stitches.config'

import GameProvider from '~/service/GameProvider'
import PulsesProvider from '~/service/PulsesProvider'

import UI from './UI'

const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <PulsesProvider>
      <GameProvider >
        <UI />
      </GameProvider>
    </PulsesProvider>
  </ThemeProvider>
)

export default App
