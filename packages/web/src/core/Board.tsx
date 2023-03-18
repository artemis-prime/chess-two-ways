  // @ts-ignore
import React from 'react'
import { observer } from 'mobx-react'

import type { BoardSquare } from '@artemis-prime/chess-domain'

import { useGame } from './GameProvider'
import { default as SquareComponent } from './Square'

const Board: React.FC<{}> = observer(() => {

  const game = useGame()
  return (
    <div className='board'>
    {game.boardAsSquares().map((s: BoardSquare) => (
      <SquareComponent square={s} key={`key-${s.rank}-${s.file}`} />
    ))}
    </div>
  )
})

export default Board
