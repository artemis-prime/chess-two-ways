  // @ts-ignore
import React from 'react'
import { observer } from 'mobx-react'
import { DragOverlay } from '@dnd-kit/core'
import { snapCenterToCursor } from '@dnd-kit/modifiers'

import type { Position, Piece } from '@artemis-prime/chess-core'

import { useGame } from './GameProvider'
import DraggingPiece from './DraggingPiece'
import { useBoardOrientation } from './UIState'
import SquareComponent from './Square'
import { ChessDnDShell } from './ChessDnD'
import type { CSS } from '@stitches/react'
import { Box } from '~/primitives'

const Board: React.FC<{ css?: CSS }> = observer(({css}) => {

  const game = useGame()
  const { whiteOnBottom } = useBoardOrientation()

  return (
    <ChessDnDShell>
      <Box className={'board'} css={css}>
      {game.getBoardAsArray(whiteOnBottom).map((sq: {pos: Position, piece: Piece | null}) => (
        <SquareComponent position={sq.pos} piece={sq.piece} key={`key-${sq.pos.rank}-${sq.pos.file}`} />
      ))}
      </Box>
      <DragOverlay modifiers={[snapCenterToCursor]}>
        <DraggingPiece size={70}  /> 
      </DragOverlay>
    </ChessDnDShell>
  )
})

export default Board
