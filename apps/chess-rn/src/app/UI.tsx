import React from 'react'
import {
  SafeAreaView,
  StatusBar,
  View,
} from 'react-native'

import { styled } from '~/style/stitches.config'
import { BGImage } from '~/primatives'
//import Drawer from '~/primatives/Drawer'

import Board from './Board'
import Dash from './Dash'
 
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
  gap: 11, // bug? Doesn't seem to recognize size token values.
  backgroundColor: 'rgba(0, 0, 0, 0.2)'
})

const UI: React.FC = () => {

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
        <StatusBar translucent={true} barStyle='light-content' backgroundColor={'transparent'} />
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
