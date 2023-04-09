import React from 'react'
import {
  SafeAreaView,
  StatusBar,
  Text,
  View,
} from 'react-native'

import { ThemeProvider, lightTheme } from './stitches.config'

import BGImage from '~/primatives/BGImage'
import Board from './board/Board'

const imagePath = require('~assets/chess-bg-1920.jpg')

const App: React.FC = () => (
  <ThemeProvider theme={lightTheme}>
    <BGImage imagePath={imagePath}>
      <SafeAreaView >
        <StatusBar
          translucent={true}
          barStyle='dark-content'
          backgroundColor='transparent'
        />
        <View style={{
          padding: 12, 
          paddingTop: 56, 
          backgroundColor: 'transparent'
        }}>
          <Board />
        </View>
      </SafeAreaView>
    </BGImage>
  </ThemeProvider>
)

export default App
