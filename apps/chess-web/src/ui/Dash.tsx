  // @ts-ignore
import React from 'react'
import { observer } from 'mobx-react'

import { useGame } from '~/board/GameProvider'

import { Button, Flex } from '~/primitives'

import Messages from './Messages'

const Dash: React.FC<{}> = observer(() => {

  const game = useGame()

  return (
    <div className='dash'>
      <p className='turn-widget'>Who's turn: <span className={`turn-indicator ${game.currentTurn}`}>&nbsp;&nbsp;&nbsp;&nbsp;</span></p>
      <Flex direction='row' justify='start' align='center'>
        <Button 
          size='medium'  
          disabled={!game.canUndo}
          onClick={game.undo.bind(game)}
        >Undo</Button>
        &nbsp;{!(game.canUndo || game.canRedo) ? (<span style={{paddingRight: '2px'}} />) : 'I'}&nbsp;
        <Button 
          size='medium'  
          disabled={!game.canRedo}
          onClick={game.redo.bind(game)}
        >Redo</Button>
      </Flex>
      <Messages />
    </div>
  )
})

export default Dash
