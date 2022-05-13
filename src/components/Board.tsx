import React from 'react'
import { observer } from 'mobx-react'

import Square  from './Square'
import { useGameService } from '../domain/GameServiceProvider'


const Board: React.FC<{}> = observer(() => {

  const game = useGameService()
  const squares: React.ReactNode[] = []
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      squares.push(<Square state={game.getState(row, col)} row={row} col={col} key={`key-${row}-${col}`}/>) 
    }
  }

  return (
    <main>
    {squares}
    </main>
  )
})

export default Board
