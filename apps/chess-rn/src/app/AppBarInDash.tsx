import React from 'react'
import { 
  View,
  StyleProp,
  ViewStyle,
  Text
} from 'react-native'

import { styled } from '~/style/stitches.config'

const AppBarView = styled(View, {

  flexDirection: 'row', 
  justifyContent: 'flex-start', 
  alignItems: 'center',

  h: '$appBarHeight', 
  w: '100%', 
  pl: '$3',
  backgroundColor: '$headerBG',
  borderBottomWidth: 0.5,
  borderBottomColor: 'gray',
})


const AppBarInDash: React.FC<{
  style?: StyleProp<ViewStyle>
}> = ({
  style
}) => {
  
  return (
    <AppBarView style={style}>
      <Text style={{
        color: 'white',
        fontSize: 22,
        textAlignVertical: 'center',
        fontWeight: "900",
      }}>{'\u2630'}</Text>
    </AppBarView>
  )
}

export default AppBarInDash
