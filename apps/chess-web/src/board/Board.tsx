  // @ts-ignore
import React from 'react'
import { observer } from 'mobx-react'

import type { Square } from '@artemis-prime/chess-core'

import { useBoard } from './GameProvider'
import { useVisualFeedback } from './VisualFeedback'
import SquareComponent from './Square'
import type { CSS } from '@stitches/react'
import { Box } from '~/primitives'

const Board: React.FC<{ css?: CSS }> = observer(({css}) => {

  const gameBoard = useBoard()
  const feedback = useVisualFeedback()
    // Allows various forms of feedpack to provide pulsing / flashing 
  const slowTick = feedback.slowTick ? 'slow-tick' : 'no-slow-tick'
  const fastTick = feedback.fastTick ? 'fast-tick' : 'no-fast-tick'

  return (
    <Box className={`board ${slowTick} ${fastTick}`} css={css}>
    {gameBoard.boardAsSquares.map((sq: Square) => (
      <SquareComponent position={sq} piece={sq.piece} key={`key-${sq.rank}-${sq.file}`} />
    ))}
    </Box>
  )
})

export default Board
