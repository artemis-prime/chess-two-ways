import React  from 'react'
import { 
  Text,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native'

import {
  FlingGesture,
  GestureDetector
} from 'react-native-gesture-handler'

import { styled } from '~/styles/stitches.config'

const UNICODE = {
  BURGER_MENU: '\u2630',
  ARROW_TO_CORNER_DOWN_RIGHT: '\u21F2',
  ARROW_TO_CORNER_UP_LEFT:'\u21F1'
}

const Figure = styled(Text, {
  color: 'white',
  fontWeight: "900",
})

const MenuFlingHandle: React.FC<{
  menuVisible: boolean
  gesture: FlingGesture
  style?: StyleProp<ViewStyle> 
}> = ({
  menuVisible,
  gesture,
  style
}) => (
  <GestureDetector gesture={gesture}>
    <View style={[style, {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingLeft: 8,
      opacity: 0.8
    }]} collapsable={false} >
    { menuVisible ? (
      <Figure style={{fontSize: 30, top: -2, left: -1}}>{UNICODE.ARROW_TO_CORNER_UP_LEFT}</Figure>
    ) : (<>
      <Figure style={{fontSize: 23}}>{UNICODE.BURGER_MENU}</Figure>
      <Figure style={{fontSize: 18, top: 2, left: 2}}>{UNICODE.ARROW_TO_CORNER_DOWN_RIGHT}</Figure>
    </>)}
    </View>
  </GestureDetector>
)

export default MenuFlingHandle
