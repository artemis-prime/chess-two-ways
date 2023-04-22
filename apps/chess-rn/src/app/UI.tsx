import React, { useEffect } from 'react'
import {
  SafeAreaView,
  StatusBar,
  View,
} from 'react-native'

import BGImage from '~/primatives/BGImage'
//import Drawer from '~/primatives/Drawer'

import Board from './Board'
import Dash from './Dash'
//import Appbar from './Appbar'

import ui from '~/style/conf'

const UI: React.FC = () => {

  //const theme = useTheme()

  useEffect(() => {
    //StatusBar.setHidden(true)
  }, [])
  
  return (
    <SafeAreaView style={{
      height: '100%',
    }}>
      <BGImage imageURI={'chess_bg_1920'} style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        height: '100%',
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

export default UI
