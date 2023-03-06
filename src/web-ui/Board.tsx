import React from 'react'

import { observer } from 'mobx-react'

import { BoardSquare }   from '../chess'
import { useGame } from './GameProvider'
import { default as SquareComponent } from './Square'

const Board: React.FC<{}> = observer(() => {

  const game = useGame()
  return (
    <main>
    {game.boardAsSquares().map((s: BoardSquare) => (
      <SquareComponent square={s} key={`key-${s.rank}-${s.file}`} />
    ))}
    </main>
  )
})

export default Board
