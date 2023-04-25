import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { ThemeProvider, theme } from '~/style/stitches.config'

import GameProvider from '~/service/GameProvider'
import UIServicesProvider from '~/service/UIServicesProvider'

import Layout from './Layout'

    // On Android, deed GestureHandlerRootView.
    // https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/events
const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <UIServicesProvider>
      <GameProvider >
        <GestureHandlerRootView >
          <Layout />
        </GestureHandlerRootView >
      </GameProvider>
    </UIServicesProvider>
  </ThemeProvider>
)

export default App
