import React from 'react'
import {
  SafeAreaView,
  StatusBar,
  View,
} from 'react-native'
import { observer } from 'mobx-react'

import { styled, useTheme } from '~/style/stitches.config'
import { useUI } from '~/service'
import { BGImage } from '~/primatives'

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
  gap: 11, // bug? Doesn't seem to recognize size token values.
  backgroundColor: 'rgba(0, 0, 0, 0.2)',

  variants: {
    menuOpen: {
      true: {
        mt: 0,
      },
      false: {
        mt: StatusBar.currentHeight!,
      }
    }
  }
})

const BGImageView = styled(BGImage, {

  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  height: '100%',

  variants: {
    menuOpen: {
      true: {
        left: '60%',
        top: 120,
        borderTopLeftRadius: '$md',
        borderWidth: 1,
        borderColor: '$gray11'
      },
      false: {
        top: 0,
        left: 0
      }
    }
  }
})

const UI: React.FC = observer(() => {

  const theme = useTheme()
  const ui = useUI()

  return (
    <SafeAreaView style={{ height: '100%' }}>
      <View style={{width: '100%', height: '100%', backgroundColor: theme.colors.headerBG}} >
        <BGImageView imageURI={'chess_bg_1920'} menuOpen={ui.menuOpen}>
          <StatusBar translucent={true} barStyle='light-content' backgroundColor={'transparent'} />
          <MainContainer menuOpen={ui.menuOpen} >
            <Dash />
            <Board />
          </MainContainer>
        </BGImageView>
      </View>
    </SafeAreaView>
  )
})

export default UI
