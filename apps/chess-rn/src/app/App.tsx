import React from 'react'

import { ThemeProvider, lightTheme } from '~/style/stitches.config'

import GameProvider from '~/service/GameProvider'
import PulsesProvider from '~/service/PulsesProvider'

import UI from './UI'

const App: React.FC = () => (
  <ThemeProvider theme={lightTheme}>
    <PulsesProvider>
      <GameProvider >
        <UI />
      </GameProvider>
    </PulsesProvider>
  </ThemeProvider>
)

export default App
