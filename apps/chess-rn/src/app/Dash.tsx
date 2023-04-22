import React from 'react'
import { 
  View,
  StyleProp,
  ViewStyle,
} from 'react-native'

import { styled, useTheme } from '~/style/stitches.config'
import { useGame } from '~/service'

import BGImage from '~/primatives/BGImage'

import UndoRedoWidget from './UndoRedoWidget'
import TurnIndicator from './TurnIndicator'
import InCheckIndicator from './InCheckIndicator'
import AppBarInDash from './AppBarInDash'

//import toRestore from '../gameDataForCastle'

const StyledBGImage = styled(BGImage, {

  flexGrow: 0,
  flexShrink: 1,
  backgroundColor: '#333',
  minHeight: 150,
  borderWidth: '$thicker',
  borderRadius: '$md',
  borderColor: '$dashBorder',
})

const DashInner = styled(View, {
  p: '$3', 
  flexDirection: 'column', 
  justifyContent: 'flex-start', 
  alignItems: 'flex-start'
})

const Dash: React.FC<{
  style?: StyleProp<ViewStyle>
}> = ({
  style
}) => {

  return (
    <StyledBGImage imageURI={'slate_bg'}  style={style}>
      <AppBarInDash />
      <DashInner>
        <View style={{
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          alignSelf: 'stretch'
        }}>
          <TurnIndicator />
          <UndoRedoWidget />
        </View>
        <InCheckIndicator />
      </DashInner>
    </StyledBGImage>
  )
}

export default Dash
