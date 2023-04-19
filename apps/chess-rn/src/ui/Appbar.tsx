import React from 'react'
import { 
  View,
  Text,
} from 'react-native'

import { styled } from '~/conf/stitches.config'
import ui from '~/conf/conf'

const AppbarView = styled(View, {

  backgroundColor: '$headerBG',
  height: 56,
  width: '100%',
  borderWidth: 0.5,
  borderRadius: 4,
  paddingLeft: ui.layout.padding,
  borderColor: '$gray11',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
})

const Appbar: React.FC = () => {

  return (
    <AppbarView >
      <Text style={{
        color: 'white',
        fontSize: 28,
        fontWeight: "900"
      }}>{'\u2630'}</Text>
    </AppbarView>
  )
}


export default Appbar
