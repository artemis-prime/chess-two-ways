import React, { PropsWithChildren, useState } from 'react'
import { 
  View,
  StyleProp,
  ViewStyle
} from 'react-native'

import { styled } from '~/stitches.config'

import BGImage from '~/primatives/BGImage'
import TurnIndicator from './TurnIndicator'

const StyledView = styled(BGImage, {

  flexGrow: 1,
  flexShrink: 1,
  backgroundColor: '#333',
  minHeight: 200,
  borderWidth: 4,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  borderColor: '$dashBorder',
})


const Dash: React.FC<{
  style?: StyleProp<ViewStyle>
}> = ({
  style
}) => {


  return (
    <StyledView imageURI={'slate_bg'}  style={style}>

      <TurnIndicator style={{ height: 20}}/>
    </StyledView>
  )
}

export default Dash
