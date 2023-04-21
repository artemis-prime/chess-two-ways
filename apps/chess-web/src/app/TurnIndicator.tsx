// @ts-ignore
import React from 'react'
import { observer } from 'mobx-react'

import { useGame } from '~/service'

import '~/style/turnIndicator.scss'

const TurnIndicator: React.FC<{}> = observer(() => {

  const game = useGame()

  return (
    <p className='turn-indicator'>
      <span className={`swatch ${game.currentTurn}`}/>
      <span className='label'>'s turn</span> 
    </p>
  )
})

export default TurnIndicator
