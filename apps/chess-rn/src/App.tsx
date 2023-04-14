import React from 'react'
import {
  SafeAreaView,
  StatusBar,
  View,
} from 'react-native'

import { ThemeProvider, lightTheme } from './stitches.config'

import BGImage from '~/primatives/BGImage'
import Board from './board/ChessBoard'
import GameProvider from './board/GameProvider'
import Dash from './ui/Dash'

const App: React.FC = () => (
  <ThemeProvider theme={lightTheme}>
  <GameProvider >
  <BGImage imageURI={'chess_bg_1920'}>
    <SafeAreaView style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 10,
      height: '100%',
      paddingLeft: 10,
      paddingRight: 10,
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
