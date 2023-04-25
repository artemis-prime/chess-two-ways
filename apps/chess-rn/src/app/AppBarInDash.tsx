import React, { PropsWithChildren } from 'react'
import { 
  View,
  StyleProp,
  ViewStyle,
} from 'react-native'

import { styled } from '~/style/stitches.config'

const AppBarView = styled(View, {
  flexDirection: 'row', 
  justifyContent: 'flex-start', 
  alignItems: 'stretch',
  h: '$appBarHeight', 
  w: '100%', 
  //pt: '$1',
  //pl: '$3',
  backgroundColor: '$headerBG',
  borderBottomWidth: 0.5,
  borderBottomColor: 'gray',
})

const AppBarInDash: React.FC<{
  style?: StyleProp<ViewStyle>
} & PropsWithChildren> = ({
  children,
  style
}) => {
  
  return (
    <AppBarView style={style}>
      {children}
    </AppBarView>
  )
}

export default AppBarInDash
