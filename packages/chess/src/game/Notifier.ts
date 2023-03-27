import type ChessListener from '../ChessListener'
import type Position from '../Position'
import type Action from '../Action'
import type { Side }  from '../Piece' 
import type Move from '../Move' 
import type ActionRecord from '../ActionRecord'

class Notifier implements ChessListener {

  private _listeners: ChessListener[] = []

  constructor() {}
  
  addChessListener(l: ChessListener) {
    this._listeners.push(l)
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
}

export { Notifier as default }