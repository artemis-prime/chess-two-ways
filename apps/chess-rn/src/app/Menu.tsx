import React from 'react'
import { View, ViewStyle, StyleProp } from 'react-native'


const Menu: React.FC<{
  style?: StyleProp<ViewStyle>
}> = ({
  style 
}) => (
  <View style={[style, {
    position: 'absolute',
    backgroundColor: 'gray'
  }]} />
)

export default Menu
