import React, { PropsWithChildren } from 'react'
import { 
  View,
  StyleProp,
  ViewStyle,
} from 'react-native'

import { styled } from '~/style/stitches.config'
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
  menuHandleProps: MenuFlingHandleProps
  style?: StyleProp<ViewStyle>
} > = ({
  menuHandleProps,
  style
}) => {
  
  return (
    <AppBarView style={style}>
      <MenuFlingHandle {...menuHandleProps}/>
    </AppBarView>
  )
}

export default AppBarInDash
