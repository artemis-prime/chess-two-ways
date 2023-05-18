import React, { useState, useEffect } from 'react'
import { autorun } from 'mobx'
import { observer } from 'mobx-react-lite'

import type { CSS } from '@stitches/react'
import { styled } from '~/styles/stitches.config'

import { useGame, useTransientMessage } from '~/services'
import { Flex, Row, Column, Switch, Box, Button } from '~/primatives'

import {
  GameStatusIndicator,
  InCheckIndicator,
  MovesTable,
  TurnIndicator,
  UndoRedoWidget,
} from '~/app/widgets'

import bg from 'assets/img/slate_bg_low_res.jpg'

const DashView = styled(Flex, {
  backgroundImage: `url(${bg})`, 
  backgroundSize: 'cover',
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: '500px',
  height: '100%',
  border: '4px $dashBorderColor solid',
  borderRadius: '5px',
  padding: '$1_5 $3',
  color: '$dashText',

  '& hr': {
    w: '100%',
    opacity: 0.5,
    my: '0.33rem',
  }
})

const Dash: React.FC<{
  css?: CSS
}> = observer(({
  css
}) => {

  const game = useGame()
  const tm = useTransientMessage()
  const [showMoves, setShowMoves] = useState<boolean>(true)

  return (
    <DashView className='dash' direction='column' css={css} >
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
      {!showMoves && <hr />}
      <MovesTable show={showMoves} />
      {tm.message && <Box css={{color: tm.message.type.includes('warning') ? '$alert8' : '$dashText'}}>{tm.message.content}</Box>}
    </DashView>
  )
})

export default Dash
