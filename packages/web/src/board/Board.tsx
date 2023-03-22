  // @ts-ignore
import React from 'react'
import { observer } from 'mobx-react'

import type { BoardSquare } from '@artemis-prime/chess-domain'

import { useBoard } from './GameProvider'
import SquareComponent from './Square'

const Board: React.FC<{}> = observer(() => {

  const gameBoard = useBoard()
  return (
    <div className='board'>
    {gameBoard.boardAsSquares.map((s: BoardSquare) => (
      <SquareComponent square={s} piece={s.piece} key={`key-${s.rank}-${s.file}`} />
    ))}
    </div>
  )
})

export default Board
