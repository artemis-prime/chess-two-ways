import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'

import type { SharedValue } from 'react-native-reanimated'

import { styled, type CSS, deborder } from '~/style'
import { useChess } from '~/services'
import { BGImage, Checkbox, Column, Row } from '~/primatives'

import {
  GameStatusIndicator,
  TurnAndInCheckIndicator,
  AppBarInChalkboard,
  MovesTable,
  type MenuControlProps
} from '~/app/widgets'

const StyledBGImage = styled(BGImage, {

  flexGrow: 0,
  flexShrink: 1,
  backgroundColor: '#333',
  //minHeight: 150,
  borderWidth: '$thicker',
  borderTopLeftRadius: '$lg',
  borderTopRightRadius: '$lg',
  borderBottomLeftRadius: '$sm',
  borderBottomRightRadius: '$sm',
  borderColor: '$chalkboardBorderColor',
})

const Chalkboard: React.FC<
  {
    open: boolean
    setOpen: (b: boolean) => void
    disableInput?: boolean
    animBaseForButton?: SharedValue<number>
    css?: CSS
  } 
  & MenuControlProps
> = observer(({
  open,
  setOpen,
  disableInput = false,
  animBaseForButton,
  css,
  ...rest
}) => {

  const game = useChess()

  return (
    <StyledBGImage imageURI={'slate_bg_low_res'} css={css}>
      <AppBarInChalkboard animBaseForButton={animBaseForButton} {...rest} />
      <Column 
        align='stretch' 
        pointerEvents={(disableInput ? 'none' : 'auto')} 
        css={{py: '$1',  pl: '$1_5', pr: '$_5', ...deborder('red', 'chalkboard')}}
      >
        <Row justify='between' align='center' css={{...deborder('yellow', 'chalkboard')}}>
          {(game.playing) ?  <TurnAndInCheckIndicator  inCheckOnly={open}/> : <GameStatusIndicator />}
          <Checkbox checked={open} setChecked={setOpen} >show moves</Checkbox>
        </Row>
        <MovesTable show={open} css={{mt: open ? 0 : '$1', flexGrow: 1}}/>
      </Column>
    </StyledBGImage>
  )
})

export default Chalkboard
