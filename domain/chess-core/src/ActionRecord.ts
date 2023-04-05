import type Piece from './Piece'
import type Move from './Move'
import type Action from './Action'
import type { PrimaryPieceType } from './Piece'

  // Describes a change of state.
  // Must contain enough info to undo and redo the state change
interface ActionRecord extends Move {
  action: Action
    // Both are needed to 'undo' or 'redo' a 'capture-promote' Action.
    // Required if action is 'capture'. Needed for 'undo' 
  captured?: Piece
    // Required if action is 'promote'. Needed for 'redo' 
  promotedTo?: PrimaryPieceType 
}

export { type ActionRecord as default }