  // @ts-ignore
import React, { useState } from 'react'
import { observer } from 'mobx-react'

import { useGame } from '~/service'

import { Button, Flex, Switch } from '~/primitives'

import Messages from './Messages'
import TurnIndicator from './TurnIndicator'
import GameStatusIndicator from './GameStatusIndicator'
import UndoRedo from './UndoRedoWidget'
import PersistToFileButton from './PersistToFileButton'
import RestoreFromFileButton from './RestoreFromFileButton'
import InCheckIndicator from './InCheckIndicator'
import BoardDirectionWidget from './BoardDirectionWidget'

const Dash: React.FC<{}> = observer(() => {

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
    <div className='dash'>
      <Flex direction='row' justify='between' align='start'>
        <Flex direction='column' justify='start' align='start'>
        {(game.playing) ? (<>
            <TurnIndicator />
            <InCheckIndicator />
          </>) : (
            <GameStatusIndicator />
          )}
        </Flex>
        <Flex direction='column' justify='start' align='end' >
          <UndoRedo />
          <BoardDirectionWidget css={{marginBottom: '18px'}}/>
          <Flex direction='column' justify='start' align='end' css={{fontSize: '0.9rem', marginBottom: '24px'}}>
          {(game.playing) && (<>
            <Button css={buttonCSS} onClick={game.callADraw.bind(game)}>call a draw</Button>
            <Button css={buttonCSS} onClick={game.concede.bind(game)}>concede</Button>
            <Button css={buttonCSS} onClick={game.checkStalemate.bind(game)}>check stalemate</Button>
          </>)}
            <Button css={buttonCSS} onClick={game.reset.bind(game)}>reset</Button>
            <PersistToFileButton >save game...</PersistToFileButton>
            <RestoreFromFileButton >restore game...</RestoreFromFileButton>
          </Flex>
        </Flex>
      </Flex>
      <Flex direction='row' justify='end' align='center'>
        <Switch checked={showMoves} onChange={handleSetShowMoves} >show moves</Switch>
      </Flex>
      <hr />
      <Messages showMoves={showMoves}/>
    </div>
  )
})

export default Dash
