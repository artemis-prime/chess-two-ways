import type Square from './Square'
import type Action from './Action'
import type { Side }  from './Piece' 


interface ChessListener {
  actionResolved(action: Action | null, from: Square, to: Square): void
  actionTaken(action: Action, from: Square, to: Square)

  sideIsInCheck(side: Side, kingSquare: Square, sideIsInCheckFrom: Square[]): void
  notInCheck(side: Side): void
}

export { type ChessListener as default }