import type { Position, Piece } from '@artemis-prime/chess-core'

const DRAGGING_PIECE = 'DraggingPiece'
interface DraggingPiece {
  piece: Piece
  from: Position
}

export { type DraggingPiece, DRAGGING_PIECE }
