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

const imagePath = require('~assets/chess-bg-1920.jpg')

const App: React.FC = () => (
  <ThemeProvider theme={lightTheme}>
  <GameProvider >
  <BGImage imagePath={imagePath}>
    <SafeAreaView style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '100%',
      padding: 15,
      paddingTop: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.25)'
    }}>
      <StatusBar
        translucent={true}
        barStyle='dark-content'
        backgroundColor='transparent'
      />
      <Board />
    </SafeAreaView>
  </BGImage>
  </GameProvider>
  </ThemeProvider>
)

export default App
/*
      <View style={{
        padding: 12, 
        paddingTop: 56, 
        backgroundColor: 'transparent'
      }}>
      </View>
*/