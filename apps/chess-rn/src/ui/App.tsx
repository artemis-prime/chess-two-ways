import React, { PropsWithChildren, useEffect } from 'react'
import {
  SafeAreaView,
  StatusBar,
  Text,
  View,
} from 'react-native'

import { ThemeProvider, lightTheme, useTheme } from '~/conf/stitches.config'

import BGImage from '~/primatives/BGImage'
import Drawer from '~/primatives/Drawer'

import Board from '~/board/ChessBoard'
import GameProvider from '~/board/GameProvider'
import PulsesProvider from '~/board/PulseProvider'
import Dash from './Dash'
import Appbar from './Appbar'

import ui from '~/conf/conf'


const AppShell: React.FC<PropsWithChildren> = ({
  children
}) => (
  <ThemeProvider theme={lightTheme}>
  <PulsesProvider>
  <GameProvider >
    {children}
  </GameProvider>
  </PulsesProvider>
  </ThemeProvider>
)

const App: React.FC = () => {

  const theme = useTheme()

  useEffect(() => {
    //StatusBar.setHidden(true)
  }, [])
  
  return (
    <SafeAreaView style={{
      height: '100%',
      position: 'relative',
    }}>
      <BGImage imageURI={'chess_bg_1920'} style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        height: '100%',
        position: 'relative',
      }}>
        <StatusBar translucent={true} barStyle='light-content' backgroundColor={'transparent' /*theme.colors.headerBG */} />
        {/*
        <Appbar style={{height: ui.layout.appBarHeight}}  backgroundColor={theme.colors.headerBG}/>
        <Drawer>
          <Text style={{ color: 'white' }}>ipsem lorem headerBG headerBG ipsem lorem headerBG 
            headerBG ipsem lorem headerBG headerBG ipsem lorem headerBG headerBG 
          </Text>
        </Drawer>
    */}
        <View style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          height: '100%',
          paddingLeft: ui.layout.appGutter,
          paddingRight: ui.layout.appGutter,
          paddingTop: ui.layout.appGutter + StatusBar.currentHeight!,
          paddingBottom: 0,
          gap: ui.layout.appGutter,
          backgroundColor: 'rgba(0, 0, 0, 0.2)'
        }} >
          <Dash />
          <Board />
        </View>
      </BGImage>
    </SafeAreaView>
  )
}

const AppWithShell: React.FC = () => (
  <AppShell>
    <App />
  </AppShell>
)

export default AppWithShell
