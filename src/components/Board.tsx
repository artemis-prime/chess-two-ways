import React from 'react'
import { observer } from 'mobx-react'

import { Square }   from '../domain/types'
import { useGame } from '../domain/GameProvider'
import { default as SquareComponent } from './Square'

const Board: React.FC<{}> = observer(() => {

  const game = useGame()
  return (
    <main>
      {game.boardAsSquares().map((s: Square) => (<SquareComponent square={s} key={`key-${s.rank}-${s.file}`}/>))}
    </main>
  )
})

export default Board
