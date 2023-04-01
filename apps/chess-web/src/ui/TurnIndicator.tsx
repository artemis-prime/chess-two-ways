// @ts-ignore
import React from 'react'
import { observer } from 'mobx-react'

import { useGame } from '~/board/GameProvider'

import '../styles/turnIndicator.scss'

const TurnIndicator: React.FC<{}> = observer(() => {

  const game = useGame()

  return (
    <p className='turn-indicator'>
      <span className='label'>Who's turn:</span> 
      <span className={`swatch ${game.currentTurn}`}/>
    </p>
  )
})

export default TurnIndicator
