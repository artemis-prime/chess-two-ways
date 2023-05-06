import React from 'react'
import { 
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native'

import { styled } from '~/styles/stitches.config'
import { BGImage } from '~/primatives'

import {
  UndoRedoWidget,
  TurnIndicator,
  InCheckIndicator,
  AppBarInDash,
  type MenuFlingHandleProps
} from '~/app/widgets'
import { useGame } from '~/services'


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
  disableInput: boolean,
  style?: StyleProp<ViewStyle>
} & MenuFlingHandleProps> = ({
  disableInput,
  style,
  ...rest
}) => {

  const game = useGame()

  return (
    <StyledBGImage imageURI={'slate_bg_low_res'}  style={style}>
      <AppBarInDash {...rest} />
      <DashInner pointerEvents={(disableInput ? 'none' : 'auto')}>
        <View style={{
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          alignSelf: 'stretch'
        }}>
        {(game.playing) ?  <TurnIndicator /> : <Text>Game status</Text>}
          <UndoRedoWidget />
        </View>
        {(game.playing) && <InCheckIndicator /> }
      </DashInner>
    </StyledBGImage>
  )
}

export default Dash
