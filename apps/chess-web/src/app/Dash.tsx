import React, { useState } from 'react'
import { observer } from 'mobx-react'

import type { CSS } from '@stitches/react'
import { styled } from '~/styles/stitches.config'

import { useGame } from '~/services'
import { Flex, Row, Column, Switch } from '~/primatives'

import {
  GameStatusIndicator,
  InCheckIndicator,
  Messages,
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
  border: '4px $dashBorder solid',
  borderRadius: '5px',
  padding: '16px 24px',
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
  const [showMoves, setShowMoves] = useState<boolean>(true)

  const handleSetShowMoves = (checked: boolean) => {
    setShowMoves(checked)
  }

  return (
    <DashView className='dash' direction='column' css={css} >
      <Row justify='between' align='start' css={{w: '100%'}}>
        <Column >
        {(game.playing) ? (<>
            <TurnIndicator css={{mb: '$1'}} />
            <InCheckIndicator css={{mb: '$1'}} />
          </>) : (
            <GameStatusIndicator />
          )}
        </Column>
        <UndoRedoWidget buttonSize='large' />
      </Row>
      <hr />
      <Switch 
        css={{alignSelf: 'flex-end', my: '$half'}} 
        checked={showMoves} 
        onChange={handleSetShowMoves} 
      >show moves</Switch>
      <hr />
      <MovesTable />
    </DashView>
  )
})
//       <Messages showMoves={showMoves}/>

export default Dash
