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

import { styled } from '~/style/stitches.config'

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
      <Figure style={{fontSize: 30, top: -2, left: -1}}>
      {'\u21F1'}
      </Figure>
    ) : (<>
      <Figure style={{fontSize: 23}}>
        {'\u2630'}
      </Figure>
      <Figure style={{fontSize: 18, top: 2, left: 2}}>
        {'\u21F2'}
      </Figure>
    </>)}
    </View>
  </GestureDetector>
)

export default MenuFlingHandle
