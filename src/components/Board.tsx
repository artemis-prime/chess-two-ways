import React from 'react'
import { observer } from 'mobx-react'

import { Square }   from '../domain/types'
import { useGameService } from '../domain/GameServiceProvider'
import { default as SquareComponent } from './Square'

const Board: React.FC<{}> = observer(() => {

  const game = useGameService()
  return (
    <main>
      {game.boardAsSquares().map((s: Square) => (<SquareComponent square={s} key={`key-${s.row}-${s.col}`}/>))}
    </main>
  )
})

export default Board
