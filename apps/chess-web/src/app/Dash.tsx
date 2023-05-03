import React, { useState } from 'react'
import { observer } from 'mobx-react'

import type { CSS } from '@stitches/react'
import { styled } from '~/styles/stitches.config'

import { useGame } from '~/services'
import { Button, Flex, Switch } from '~/primitives'

import {
  BoardDirectionWidget,
  GameStatusIndicator,
  InCheckIndicator,
  Messages,
  PersistToFileButton,
  RestoreFromFileButton,
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
  //marginRight: '6%',
  border: '4px $dashBorder solid',
  borderRadius: '5px',
  padding: '16px 24px',
  color: '$dashText'
})

const Dash: React.FC<{
  css?: CSS
}> = observer((
  css
) => {

  const game = useGame()
  const [showMoves, setShowMoves] = useState<boolean>(false)

  const handleSetShowMoves = (checked: boolean) => {
    setShowMoves(checked)
  }

  const buttonCSS = {
    whiteSpace: 'nowrap',
    fontSize: 'inherit'  
  }

  return (
    <DashView className='dash' direction='column' css={css} >
      <Flex direction='row' justify='between' align='start'>
        <Flex direction='column' justify='start' align='start'>
        {(game.playing) ? (<>
            <TurnIndicator css={{mb: '$2'}} />
            <InCheckIndicator css={{mb: '$2'}} />
          </>) : (
            <GameStatusIndicator />
          )}
        </Flex>
        <UndoRedoWidget buttonSize='large' />
      </Flex>
      <hr />
      <Flex direction='column' justify='start' align='end' css={{mt: '$4'}} >
        <BoardDirectionWidget css={{mb: '$4'}}/>
        <Flex direction='column' justify='start' align='end' css={{fontSize: '$normal', mb: '$5'}}>
        {(game.playing) && (<>
          <Button css={buttonCSS} onClick={game.callADraw}>call a draw</Button>
          <Button css={buttonCSS} onClick={game.concede}>concede</Button>
          <Button css={buttonCSS} onClick={game.checkStalemate}>check stalemate</Button>
        </>)}
          <Button css={buttonCSS} onClick={game.reset}>reset</Button>
          <br />
          <PersistToFileButton >save game...</PersistToFileButton>
          <RestoreFromFileButton >restore game...</RestoreFromFileButton>
        </Flex>
      </Flex>
      <Flex direction='row' justify='end' align='center'>
        <Switch checked={showMoves} onChange={handleSetShowMoves} >show moves</Switch>
      </Flex>
      <hr />
      <Messages showMoves={showMoves}/>
    </DashView>
  )
})

export default Dash
