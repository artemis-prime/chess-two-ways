import React from 'react'
import { observer } from 'mobx-react'

import { useGame } from '~/services'

import '~/styles/gameStatusIndicator.scss'

const GameStatusIndicator: React.FC<{}> = observer(() => {

  const game = useGame()

  return game.gameStatus.victor ? (
    <p className='game-status-indicator'>
      {game.gameStatus.victor !== 'none' ? (<>
        <span className='won'><span className={`swatch ${game.gameStatus.victor}`}/>won!</span>
        <span className='status'>(by {game.gameStatus.state === 'checkmate' ? 'checkmate' : 'concession'})</span> 
      </>) : (<>
        <span className='draw'>It's a draw!{game.gameStatus.state === 'stalemate' ? ' (stalemate)' : '(agreement)'}</span> 
        <span className='state'><span className='white'/>=<span className='black'/>{game.gameStatus.state === 'stalemate' ? ', $' : ''}</span> 
      </>)}
    </p>
  ) : null
})

export default GameStatusIndicator
