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

import { styled } from '~/style/stitches.config'
 
const MainContainer = styled(View, {

  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',

  h: '100%',
  pl: '$2',
  pr: '$2',
  pt: '$2',
  pb: 0,
  mt: StatusBar.currentHeight!,
  gap: 14, // bug?
  backgroundColor: 'rgba(0, 0, 0, 0.2)'
})

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
        <Drawer>
          <Text style={{ color: 'white' }}>ipsem lorem headerBG headerBG ipsem lorem headerBG 
            headerBG ipsem lorem headerBG headerBG ipsem lorem headerBG headerBG 
          </Text>
        </Drawer>
    */}
        <MainContainer>
          <Dash />
          <Board />
        </MainContainer>
      </BGImage>
    </SafeAreaView>
  )
}

export default UI
