import React from 'react'
import { 
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native'

import { styled, type CSS } from '~/style'
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
  css?: CSS
} & MenuFlingHandleProps> = ({
  menuVisible,
  gesture,
  style,
  css
}) => {
  
  return (
    <AppBarView style={style} css={css}>
      <MenuFlingHandle {...{menuVisible, gesture}}/>
    </AppBarView>
  )
}

export default AppBarInDash
