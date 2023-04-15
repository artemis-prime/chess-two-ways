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

import ui from '~/conf/conf'

const App: React.FC = () => (
  <ThemeProvider theme={lightTheme}>
  <GameProvider >
  <BGImage imageURI={'chess_bg_1920'}>
    <SafeAreaView style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: ui.layout.appGutter,
      height: '100%',
      paddingLeft: ui.layout.appGutter,
      paddingRight: ui.layout.appGutter,
      paddingTop: 60,
      paddingBottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.25)'
    }}>
      <StatusBar
        translucent={true}
        barStyle='dark-content'
        backgroundColor='transparent'
      />
      <Board />
      <Dash />
    </SafeAreaView>
  </BGImage>
  </GameProvider>
  </ThemeProvider>
)

export default App
