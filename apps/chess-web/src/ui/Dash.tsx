  // @ts-ignore
import React, { useState } from 'react'
import { observer } from 'mobx-react'

import { useGame } from '~/board/GameProvider'

import { Box, Button, Flex } from '~/primitives'

import Messages from './Messages'
import TurnIndicator from './TurnIndicator'
import GameStatusIndicator from './GameStatusIndicator'
import UndoRedo from './UndoRedo'
import ShowMovesSwitch from './ShowMovesSwitch'
import ResetFromFileButton from './ResetFromFileButton'
import InCheckIndicator from './InCheckIndicator'

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
        {(game.gameStatus.status === 'playing' || game.gameStatus.status === 'new') ? (<>
            <TurnIndicator />
            <InCheckIndicator />
          </>) : (
            <GameStatusIndicator />
          )}
        </Flex>
        <Flex direction='column' justify='start' align='end' >
          <UndoRedo css={{marginBottom: '12px'}}/>
          <Flex direction='column' justify='start' align='end' css={{fontSize: '0.9rem', marginBottom: '24px'}}>
          {(game.gameStatus.status === 'playing' || game.gameStatus.status === 'new' ) ? (<>
            <Button css={buttonCSS} onClick={game.setDraw.bind(game)}>call a draw</Button>
            <Button css={buttonCSS} onClick={game.setConcession.bind(game)}>concede</Button>
            <Button css={buttonCSS} onClick={game.checkStalemate.bind(game)}>check stalemate</Button>
          </>) : (<>
            <Button css={buttonCSS} onClick={game.reset.bind(game)}>reset</Button>
            <ResetFromFileButton >from file...</ResetFromFileButton>
          </>)}
          </Flex>
        </Flex>
      </Flex>



      <Flex direction='row' justify='end' align='center'>
        <ShowMovesSwitch checked={showMoves} onChange={handleSetShowMoves} />
      </Flex>
      <hr />
      <Messages showMoves={showMoves}/>
    </div>
  )
})

export default Dash
