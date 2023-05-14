import type ChessListener from '../ChessListener'
import type Action from '../Action'
import type { Side }  from '../Piece' 
import type Move from '../Move' 
import ActionRecord from '../ActionRecord'
import type GameStatus from '../GameStatus'
import type Check from '../Check'

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

  actionUndone(r: ActionRecord): void {
    this._listeners.forEach((l) => {
      l.actionUndone(r)
    })
  }

  actionRedone(r: ActionRecord): void {
    this._listeners.forEach((l) => {
      l.actionRedone(r)
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

  inCheck(c: Check): void {
    this._listeners.forEach((l) => {
      l.inCheck(c)
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