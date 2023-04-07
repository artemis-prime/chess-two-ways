import type ChessListener from '../ChessListener'
import type Position from '../Position'
import type Action from '../Action'
import type { Side }  from '../Piece' 
import type Move from '../Move' 
import type ActionRecord from '../ActionRecord'
import type GameStatus from '../GameStatus'

class Notifier implements ChessListener {

  private _listeners = new Map<string, ChessListener>()

  constructor() {}
  
  registerListener(l: ChessListener, uniqueId: string) {
    this._listeners.set(uniqueId, l)
  }

  actionResolved(move: Move, action: Action | null): void {
    this._listeners.forEach((l) => {
      l.actionResolved(move, action)
    })
  }

  actionTaken(r: ActionRecord): void {
    this._listeners.forEach((l) => {
      l.actionTaken(r)
    })
  }

  actionUndon(r: ActionRecord): void {
    this._listeners.forEach((l) => {
      l.actionUndon(r)
    })
  }

  actionRedon(r: ActionRecord): void {
    this._listeners.forEach((l) => {
      l.actionRedon(r)
    })
  }

  actionsRestored(recs: readonly ActionRecord[]): void {
    this._listeners.forEach((l) => {
      l.actionsRestored(recs)
    })
  }

  message(s: string, type?: string): void {
    this._listeners.forEach((l) => {
      l.message(s, type)
    })
  }

  inCheck(side: Side, kingSquare: Position, sideIsInCheckFrom: Position[]): void {
    this._listeners.forEach((l) => {
      l.inCheck(side, kingSquare, sideIsInCheckFrom)
    })
  }
 
  notInCheck(side: Side): void {
    this._listeners.forEach((l) => {
      l.notInCheck(side)
    })
  }

  gameStatusChanged(s: GameStatus): void {
    this._listeners.forEach((l) => {
      l.gameStatusChanged(s)
    })
  }

}

export { Notifier as default }