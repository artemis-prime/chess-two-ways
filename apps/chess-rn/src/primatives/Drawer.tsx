import React, { PropsWithChildren } from 'react'
import { 
  View,
  Text,
} from 'react-native'

import { styled } from '~/style/stitches.config'

const StyledView = styled(View, {
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  width: '86%',
  padding: 24,
  paddingTop: 56,
  backgroundColor: '$headerBG',
  color: 'white',
  zIndex: 100
})

const Drawer: React.FC<{

} & PropsWithChildren> = ({
  children

}) => {
  return <StyledView>
    {children}
  </StyledView>
}

export default Drawer
