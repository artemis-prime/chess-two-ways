import type Piece from './Piece'
import type Square from './Square'
import type Action from './Action'
import type { PromotedPieceType } from './Piece'

  // (Note: must contain enough info to undo or redo the move)
interface ActionRecord {
  piece: Piece,
  from: Square,
  to: Square
  action: Action
    // Both are needed to 'undo' or 'redo' a 'capture-promote' Action.
    // Required if action is 'capture'. Needed for 'undo' 
  captured?: Piece
    // Required if action is 'promote'. Needed for 'redo' 
  promotedTo?: PromotedPieceType 
}

export { type ActionRecord as default }
