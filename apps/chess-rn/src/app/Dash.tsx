import React, { Children, PropsWithChildren } from 'react'
import { 
  View,
  StyleProp,
  ViewStyle,
} from 'react-native'
import { observer } from 'mobx-react'

import { styled } from '~/style/stitches.config'

import { BGImage } from '~/primatives'

import UndoRedoWidget from './UndoRedoWidget'
import TurnIndicator from './TurnIndicator'
import InCheckIndicator from './InCheckIndicator'
import AppBarInDash from './AppBarInDash'
import { useUI } from '~/service'

const StyledBGImage = styled(BGImage, {

  flexGrow: 0,
  flexShrink: 1,
  backgroundColor: '#333',
  minHeight: 150,
  borderWidth: '$thicker',
  borderTopLeftRadius: '$lg',
  borderTopRightRadius: '$lg',
  borderBottomLeftRadius: '$sm',
  borderBottomRightRadius: '$sm',
  borderColor: '$pieceBlack',
})

const DashInner = styled(View, {
  p: '$3', 
  flexDirection: 'column', 
  justifyContent: 'flex-start', 
  alignItems: 'flex-start'
})

const Dash: React.FC<{
  style?: StyleProp<ViewStyle>
} & PropsWithChildren> = observer(({
  children,
  style
}) => {

  const ui = useUI()

  return (
    <StyledBGImage imageURI={'slate_bg'}  style={style}>
      <AppBarInDash >
        {children}
      </AppBarInDash>
      <DashInner pointerEvents={(ui.menuOpen ? 'none' : 'auto')}>
        <View style={{
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          alignSelf: 'stretch'
        }}>
          <TurnIndicator />
          <UndoRedoWidget />
        </View>
        <InCheckIndicator />
      </DashInner>
    </StyledBGImage>
  )
})

export default Dash
