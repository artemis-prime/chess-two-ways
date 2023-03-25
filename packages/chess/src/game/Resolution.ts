import type Action from '../Action'
import type Piece from '../Piece'
import { piecesEqual } from '../Piece'
import type Square from '../Square'
import { squaresEqual } from '../Square'

class Resolution {
  readonly piece: Piece
  readonly from: Square
  readonly to: Square
  readonly action: Action | null

  constructor(
    piece: Piece,
    from: Square,
    to: Square,
    action: Action | null
  ) {
    this.piece = piece
    this.from = from
    this.to = to,
    this.action = action
  }

  samePieceAndSquares(toTry: Omit<Resolution, 'action' | 'samePieceAndSquares'>): boolean {
    return squaresEqual(this.to, toTry.to) &&
    squaresEqual(this.from, toTry.from) &&
    piecesEqual(this.piece, toTry.piece) 
  }
  
}

export { Resolution as default }