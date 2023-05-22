import React from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import { observer } from 'mobx-react-lite'

import { styled, type CSS } from '~/styles/stitches.config'
import { useChess } from '~/services'
import { BGImage, Column, Row } from '~/primatives'

import {
  UndoRedoWidget,
  GameStatusIndicator,
  TurnIndicator,
  InCheckIndicator,
  AppBarInDash,
  type MenuFlingHandleProps
} from '~/app/widgets'

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

const Dash: React.FC<{
  disableInput: boolean,
  style?: StyleProp<ViewStyle>,
  css?: CSS
} & MenuFlingHandleProps> = observer(({
  disableInput,
  style,
  css,
  ...rest
}) => {
  const game = useChess()
  return (
    <StyledBGImage imageURI={'slate_bg_low_res'} css={css} style={style}>
      <AppBarInDash {...rest} />
      <Column pointerEvents={(disableInput ? 'none' : 'auto')} css={{py: '$single', px: '$singleAndHalf'}}>
        <Row justify='between' style={{ alignSelf: 'stretch' }}>
        {(game.playing) ?  <TurnIndicator /> : <GameStatusIndicator />}
          <UndoRedoWidget />
        </Row>
        {(game.playing) && <InCheckIndicator /> }
      </Column>
    </StyledBGImage>
  )
})

export default Dash
