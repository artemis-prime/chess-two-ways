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
  backgroundColor: '$menuBGColor',
  borderBottomWidth: 0.5,
  borderBottomColor: 'gray',
})

const AppBarInChalkboard: React.FC<{
  css?: CSS
} & MenuFlingHandleProps> = ({
  menuVisible,
  gesture,
  css
}) => {
  
  return (
    <AppBarView css={css}>
      <MenuFlingHandle {...{menuVisible, gesture}}/>
    </AppBarView>
  )
}

export default AppBarInChalkboard
