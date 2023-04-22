import React, { useState } from 'react'
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
  style?: StyleProp<ViewStyle>
}> = ({
  style
}) => {
  
  const [checked, setChecked] = useState<boolean>(true)

  return (
    <AppBarView style={[style, {borderBottomColor: (checked) ? 'red' : 'gray'}]}>
      <MenuButton checked={checked} setChecked={setChecked} />
    </AppBarView>
  )
}

export default AppBarInDash
