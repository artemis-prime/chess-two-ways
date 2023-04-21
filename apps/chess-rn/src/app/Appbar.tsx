import React, { useRef } from 'react'
import { 
  Animated,
  View,
  Text,
  StyleProp,
  ViewStyle,
  ColorValue
} from 'react-native'

import { styled } from '~/style/stitches.config'
import ui from '~/style/conf'

const AppbarView = styled(View, {

  display: 'flex',
  backgroundColor: '$headerBG',
  paddingLeft: ui.layout.padding,
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  position: 'absolute',
  transition: 'left ease 200ms',
  left: 0,
  top: 0,
  right: 0,
  zIndex: 99
})

const Appbar: React.FC<{
  backgroundColor: ColorValue
  style?: StyleProp<ViewStyle>
}> = ({
  backgroundColor,
  style
}) => {

  const slideAnimRef = useRef(new Animated.Value(-300))

  return (
    <AppbarView style={[style, {backgroundColor}]}>
      <Text style={{
        color: 'white',
        fontSize: 22,
        fontWeight: "900"
      }}>{'\u2630'}</Text>
    </AppbarView>
  )
}


export default Appbar
