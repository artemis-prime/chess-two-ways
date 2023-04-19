import React from 'react'
import {
  SafeAreaView,
  StatusBar,
} from 'react-native'

import { ThemeProvider, lightTheme } from '~/conf/stitches.config'

import BGImage from '~/primatives/BGImage'
import Board from '~/board/ChessBoard'
import GameProvider from '~/board/GameProvider'
import Dash from './Dash'
import Appbar from './Appbar'

import ui from '~/conf/conf'
import PulsesProvider from '~/board/PulseProvider'

const App: React.FC = () => (
  <ThemeProvider theme={lightTheme}>
  <GameProvider >
  <PulsesProvider>
  <BGImage imageURI={'chess_bg_1920'}>
    <SafeAreaView style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      gap: ui.layout.appGutter,
      height: '100%',
      paddingLeft: ui.layout.appGutter,
      paddingRight: ui.layout.appGutter,
      paddingTop: StatusBar.currentHeight,
      paddingBottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.25)'
    }}>
      <StatusBar
        translucent={true}
        barStyle='dark-content'
        backgroundColor='transparent'
      />
      <Appbar />
      <Dash />
      <Board style={{ marginTop: ui.layout.appGutter }}/>
    </SafeAreaView>
  </BGImage>
  </PulsesProvider>
  </GameProvider>
  </ThemeProvider>
)

export default App
