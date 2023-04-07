import type Position from './Position'
import type Action from './Action'
import type { Side }  from './Piece' 
import type Move from './Move' 
import type ActionRecord from './ActionRecord'
import type GameStatus from './GameStatus'

interface ChessListener {

  actionResolved(move: Move, action: Action | null): void
  actionTaken(r: ActionRecord): void
  actionUndon(r: ActionRecord): void
  actionRedon(r: ActionRecord): void

  actionsRestored(recs: readonly ActionRecord[]): void

    // if user tries to take and action, there might be a message issued,
    // eg, "You can't castle because your king has move"
  message(s: string, type?: string): void 

  inCheck(side: Side, kingSquare: Position, sideIsInCheckFrom: Position[]): void
  notInCheck(side: Side): void

  gameStatusChanged(s: GameStatus): void
}

export { type ChessListener as default }