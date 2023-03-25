  // @ts-ignore
import React from 'react'
import { observer } from 'mobx-react'

import type { BoardSquare } from '@artemis-prime/chess-domain'

import { useBoard } from './GameProvider'
import { useVisualFeedback } from './VisualFeedback'
import SquareComponent from './Square'
import type { CSS } from '@stitches/react'
import { Box } from '~/primitives'

const Board: React.FC<{ css?: CSS }> = observer(({css}) => {

  const gameBoard = useBoard()
  const feedback = useVisualFeedback()
  const slowTick = feedback.slowTick ? 'slow-tick' : 'no-slow-tick'
  const fastTick = feedback.fastTick ? 'fast-tick' : 'no-fast-tick'

  return (
    <Box className={`board ${slowTick} ${fastTick}`} css={css}>
    {gameBoard.boardAsSquares.map((s: BoardSquare) => (
      <SquareComponent square={s} piece={s.piece} key={`key-${s.rank}-${s.file}`} />
    ))}
    </Box>
  )
})

export default Board
