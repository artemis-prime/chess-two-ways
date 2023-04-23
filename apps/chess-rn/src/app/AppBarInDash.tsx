import React from 'react'
import { 
  View,
  StyleProp,
  ViewStyle,
} from 'react-native'

import { styled } from '~/style/stitches.config'

import MenuButton from './MenuButton'

const AppBarView = styled(View, {
  flexDirection: 'row', 
  justifyContent: 'flex-start', 
  alignItems: 'center',
  h: '$appBarHeight', 
  w: '100%', 
  //pl: '$3',
  backgroundColor: '$headerBG',
  borderBottomWidth: 0.5,
  borderBottomColor: 'gray',
})

const AppBarInDash: React.FC<{
  setMenuOpen: (b: boolean) => void
  style?: StyleProp<ViewStyle>
}> = ({
  setMenuOpen,
  style
}) => {
  
  return (
    <AppBarView style={style}>
      <MenuButton setMenuOpen={setMenuOpen}/>
    </AppBarView>
  )
}

export default AppBarInDash
