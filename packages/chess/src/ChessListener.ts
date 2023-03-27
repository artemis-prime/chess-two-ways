import type Square from './Square'
import type Action from './Action'
import type { Side }  from './Piece' 
import type Piece from './Piece' 


interface ChessListener {
  actionResolved(piece: Piece, from: Square, to: Square, action: Action | null, ): void
  actionTaken(piece: Piece, from: Square, to: Square, action: Action): void

  sideIsInCheck(side: Side, kingSquare: Square, sideIsInCheckFrom: Square[]): void
  sideIsNotInCheck(side: Side): void
}

export { type ChessListener as default }