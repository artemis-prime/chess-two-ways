  // @ts-ignore
import React from 'react'
import { observer } from 'mobx-react'

import type { Position, Piece } from '@artemis-prime/chess-core'

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
    {gameBoard.boardAsArray.map((sq: {pos: Position, piece: Piece | null}) => (
      <SquareComponent position={sq.pos} piece={sq.piece} key={`key-${sq.pos.rank}-${sq.pos.file}`} />
    ))}
    </Box>
  )
})

export default Board
