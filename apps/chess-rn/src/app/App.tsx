import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { ThemeProvider, theme } from '~/styles/stitches.config'

import GameProvider from '~/services/GameProvider'
import UIServicesProvider from '~/services/UIServicesProvider'

import Layout from './Layout'

    // On Android, need a single GestureHandlerRootView
    // at the root of all gesture use.
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
