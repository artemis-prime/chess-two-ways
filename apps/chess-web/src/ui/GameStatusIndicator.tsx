// @ts-ignore
import React from 'react'
import { observer } from 'mobx-react'

import { useGame } from '~/board/GameProvider'

import '../styles/gameStatusIndicator.scss'

const GameStatusIndicator: React.FC<{}> = observer(() => {

  const game = useGame()

  return game.gameStatus.victor ? (
    <p className='game-status-indicator'>
      {game.gameStatus.victor !== 'none' ? (<>
        <span className='won'><span className={`swatch ${game.gameStatus.victor}`}/>won!</span>
        <span className='status'>(by {game.gameStatus.status})</span> 
      </>) : (<>
        <span className='draw'>It's a draw!</span> 
        <span className='status'>{game.gameStatus.status === 'stalemate' ? '(by stalemate)' : '(by agreement)'}</span> 
      </>)}
    </p>
  ) : null
})

export default GameStatusIndicator
