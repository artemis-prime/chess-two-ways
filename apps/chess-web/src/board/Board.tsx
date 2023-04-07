  // @ts-ignore
import React from 'react'
import { observer } from 'mobx-react'

import type { Position, Piece } from '@artemis-prime/chess-core'

import { useGame } from './GameProvider'
import { useUIState } from './UIState'
import SquareComponent from './Square'
import type { CSS } from '@stitches/react'
import { Box } from '~/primitives'

const Board: React.FC<{ css?: CSS }> = observer(({css}) => {

  const game = useGame()
  const {slowTick, fastTick, whiteOnBottom} = useUIState()

  return (
    <Box className={`board ${slowTick ? 'slow-tick' : 'no-slow-tick'} ${fastTick ? 'fast-tick' : 'no-fast-tick'}`} css={css}>
    {game.getBoardAsArray(whiteOnBottom).map((sq: {pos: Position, piece: Piece | null}) => (
      <SquareComponent position={sq.pos} piece={sq.piece} key={`key-${sq.pos.rank}-${sq.pos.file}`} />
    ))}
    </Box>
  )
})

export default Board
