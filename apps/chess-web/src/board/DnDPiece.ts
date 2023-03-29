import type { Position, Piece } from '@artemis-prime/chess-core'

const DND_ITEM_NAME = 'DnDPiece'
interface DnDPiece {
  piece: Piece
  from: Position
}

export { type DnDPiece, DND_ITEM_NAME }
