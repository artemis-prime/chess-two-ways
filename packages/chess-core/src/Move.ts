import type Piece from './Piece'
import { piecesExistAndAreEqual } from './Piece'
import type Position from './Position'
import { positionsEqual } from './Position'

interface Move {
  readonly piece: Piece
  readonly from: Position
  readonly to: Position
}

const movesEqual = (m1: Move, m2: Move): boolean => (
  piecesExistAndAreEqual(m1.piece, m2.piece) &&
  positionsEqual(m1.from, m2.from) && 
  positionsEqual(m1.to, m2.to)
)

export { type Move as default, movesEqual }