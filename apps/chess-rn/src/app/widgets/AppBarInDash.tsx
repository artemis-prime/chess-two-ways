import React from 'react'
import { 
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native'

import { styled } from '~/styles/stitches.config'
import type MenuFlingHandleProps from './MenuFlingHandleProps'
import MenuFlingHandle from './MenuFlingHandle'

const AppBarView = styled(View, {
  flexDirection: 'row', 
  justifyContent: 'flex-start', 
  alignItems: 'stretch',
  h: '$appBarHeight', 
  w: '100%', 
  backgroundColor: '$headerBG',
  borderBottomWidth: 0.5,
  borderBottomColor: 'gray',
})

const AppBarInDash: React.FC<{
  style?: StyleProp<ViewStyle>
} & MenuFlingHandleProps> = ({
  menuVisible,
  gesture,
  style
}) => {
  
  return (
    <AppBarView style={style}>
      <MenuFlingHandle {...{menuVisible, gesture}}/>
    </AppBarView>
  )
}

export default AppBarInDash
