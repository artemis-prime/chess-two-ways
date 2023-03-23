import type Action from '../Action'
import type Piece from '../Piece'
import { piecesEqual } from '../Piece'
import type Square from '../Square'
import { squaresEqual } from '../Square'

interface Resolution {
  piece: Piece,
  from: Square,
  to: Square,
  resolvedAction: Action | undefined
}

const resolutionsEqual = (r1: Resolution, r2: Resolution): boolean => (
  squaresEqual(r1.to, r2.to) &&
  squaresEqual(r1.from, r2.from) &&
  piecesEqual(r1.piece, r2.piece) 
  // no need to compare resolvedAction
)

export { type Resolution as default, resolutionsEqual }