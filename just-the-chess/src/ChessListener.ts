import type Action from './Action'
import type ActionRecord from './ActionRecord'
import type Check from './Check'
import type GameStatus from './GameStatus'
import type Move from './Move' 
import type { Side }  from './Piece' 

interface ChessListener {

  actionResolved(move: Move, action: Action | null): void
  actionTaken(r: ActionRecord): void
  actionUndon(r: ActionRecord): void
  actionRedon(r: ActionRecord): void

  actionsRestored(recs: readonly ActionRecord[]): void

    // if user tries to take and action, there might be a message issued,
    // eg, "You can't castle because your king has moved!"
  message(s: string, type?: string): void 

  inCheck(c: Check): void
  notInCheck(side: Side): void

  gameStatusChanged(s: GameStatus): void
}

export { type ChessListener as default }