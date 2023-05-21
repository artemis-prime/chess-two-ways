import React from 'react'
import { observer } from 'mobx-react-lite'

import { styled, type CSS } from '~/style'

import { useGame, useTransientMessage } from '~/services'
import { Box, Checkbox, Flex, Row } from '~/primatives'

import {
  GameStatusIndicator,
  InCheckIndicator,
  MovesTable,
  TurnIndicator,
} from '~/app/widgets'

import bg from 'assets/img/slate_bg_low_res.jpg'

const ChalkboardOuter = styled(Flex, {

  backgroundColor: '#444',
  backgroundImage: `url(${bg})`, 
  backgroundSize: 'cover',
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: '500px',
  height: '100%',
  border: '2px $chalkboardBorderColor solid',
  borderRadius: '5px',
  p: '$1_5 $1',
  gap: '$1',

  fontSize: 'inherit',
  lineHeight: 1,

  color: '$chalkboardTextColor',

  '@allMobilePortrait': {
    maxWidth: 'initial',
    height: '22%',
    transition: '$chalkboardInPortraitOpenTransition',
    borderTopLeftRadius: '$lgr',
    borderTopRightRadius: '$lgr',
    borderBottomLeftRadius: '$none',
    borderBottomRightRadius: '$none',
    borderBottom: 'none',
  },
  '@deskPortrait': {
    maxWidth: 'initial',
    flexGrow: 1,
    borderTopLeftRadius: '$lgr',
    borderTopRightRadius: '$lgr',
    borderBottomLeftRadius: '$none',
    borderBottomRightRadius: '$none',
    borderBottom: 'none',
    fontSize: '1.1em',
    p: '$3 $3',
  },

  variants: {
    showMoves: {
      true: {
        '@allMobilePortrait': {
          height: '100%',
          transition: '$chalkboardInPortraitOpenTransition',
        },
        '@deskPortrait': {
          height: '100%',
          transition: '$chalkboardInPortraitOpenTransition',
        }
      }
    }
  }
})

const Hr = styled('hr', {
  w: '100%',
  opacity: 0.5,
  my: '0.125em',

  '@allMobilePortrait': {
    display: 'none'
  }
})

const Chalkboard: React.FC<{
  showMoves: boolean
  setShowMoves: (b: boolean) => void
  css?: CSS
}> = observer(({
  showMoves,
  setShowMoves,
  css
}) => {

  const game = useGame()
  const tm = useTransientMessage()

  return (
    <ChalkboardOuter direction='column' align='stretch' css={css} showMoves={showMoves} >
      <Row justify={(!game.playing || game.check || !showMoves) ? 'between' : 'end'} align='center' css={{}}>
      {(game.playing && !showMoves) && (<TurnIndicator css={{}} />)}
      {(game.playing && showMoves) && (<InCheckIndicator css={{}} />)}
        {(!game.playing) && (<GameStatusIndicator />)}
        <Checkbox checked={showMoves} setChecked={setShowMoves} >show moves</Checkbox>
      </Row>
      {(game.playing && !showMoves) && (
      <Row justify='start' align='center' css={{}}>
        <InCheckIndicator css={{}} />
      </Row>
      )}
      {!showMoves && <Hr />}
      <MovesTable show={showMoves} />
      {tm.message && <Box css={{color: tm.message.type.includes('warning') ? '$alert8' : '$chalkboardTextColor'}}>{tm.message.content}</Box>}
    </ChalkboardOuter>
  )
})

export default Chalkboard
