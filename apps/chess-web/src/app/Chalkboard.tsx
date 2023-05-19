import React from 'react'
import { observer } from 'mobx-react-lite'

import { styled, type CSS } from '~/styles/stitches.config'

import { useGame, useTransientMessage } from '~/services'
import { Flex, Row, Column, Switch, Box } from '~/primatives'

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
  border: '4px $chalkboardBorderColor solid',
  borderRadius: '5px',
  padding: '$1_5 $3',
  color: '$chalkboardTextColor',

  '@allMobilePortrait': {
    maxWidth: 'initial',
    height: '22%',
    transition: '$chalkboardInPortrait',
    borderTopLeftRadius: '$lgr',
    borderTopRightRadius: '$lgr',
    borderBottomLeftRadius: '$none',
    borderBottomRightRadius: '$none',
    borderBottom: 'none',
  },

  variants: {
    extendedInPortrait: {
      true: {
        '@allMobilePortrait': {
          height: '100%',
          transition: '$chalkboardInPortrait',
        },
      }
    }
  }
})

const Hr = styled('hr', {
  w: '100%',
  opacity: 0.5,
  my: '0.33rem',

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
    <ChalkboardOuter className='chalkboard' direction='column' css={css} extendedInPortrait={showMoves} >
      <Row justify='between' align='start' css={{w: '100%'}}>
        <Column >
        {(game.playing) ? (<>
            {!showMoves && (<TurnIndicator css={{mb: '$1'}} />)}
            <InCheckIndicator css={{mb: '$1'}} />
          </>) : (
            <GameStatusIndicator />
          )}
        </Column>
        <Column >
          <Switch 
            css={{alignSelf: 'flex-end'}} 
            checked={showMoves} 
            onChange={setShowMoves} 
          >show moves</Switch>
        </Column>
      </Row>
      {!showMoves && <Hr />}
      <MovesTable show={showMoves} />
      {tm.message && <Box css={{color: tm.message.type.includes('warning') ? '$alert8' : '$chalkboardTextColor'}}>{tm.message.content}</Box>}
    </ChalkboardOuter>
  )
})

export default Chalkboard
