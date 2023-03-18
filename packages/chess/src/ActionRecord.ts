import type Piece from './Piece'
import type Square from './Square'
import type Action from './Action'

  // (Note: must contain enough info to undo or redo the move)
interface ActionRecord {
  piece: Piece,
  from: Square,
  to: Square
  action: Action
    // needed to "redo" a "promote" Action.  The piece promoted to (eg, a second queen)
    // needed to "undo" a "capture" Action.  The piece captured
  secondPiece?: Piece 
}

export { type ActionRecord as default }
