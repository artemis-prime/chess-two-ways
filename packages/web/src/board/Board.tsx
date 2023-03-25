  // @ts-ignore
import React from 'react'
import { observer } from 'mobx-react'

import type { BoardSquare } from '@artemis-prime/chess-domain'

import { useBoard } from './GameProvider'
import SquareComponent from './Square'
import type { CSS } from '@stitches/react'
import { Box } from '~/primitives'

const Board: React.FC<{ css?: CSS }> = observer(({css}) => {

  const gameBoard = useBoard()
  return (
    <Box className='board' css={css}>
    {gameBoard.boardAsSquares.map((s: BoardSquare) => (
      <SquareComponent square={s} piece={s.piece} key={`key-${s.rank}-${s.file}`} />
    ))}
    </Box>
  )
})

export default Board
