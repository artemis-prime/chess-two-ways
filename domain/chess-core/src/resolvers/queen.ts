import type { 
  Action, 
  Board, 
  Position, 
  Piece, 
  Move 
} from '..'
import { type ResolvableMove } from '../game/ActionResolver'

import {
  nextN,
  nextS,
  nextE,
  nextW,
  nextNE,
  nextNW,
  nextSE,
  nextSW,
  resolvableMovesAndCapture
} from '../util'

const legalMove = (
  board: Board,
  from: Position, 
  to: Position, 
): boolean => {
  
  return (
    board.isClearAlongRank(from, to)
    ||
    board.isClearAlongFile(from, to)
    ||
    board.isClearAlongDiagonal(from, to)
  ) 
}

const resolve = (
  board: Board,
  move: Move,
  messageFn?: (s: String) => void
): Action | null => {
  
  if (legalMove(board, move.from, move.to)) {
    const fromColor = board.colorAt(move.from)
    const toColor = board.colorAt(move.to)
    if (!toColor) {
      return 'move'
    }
    else if (fromColor && toColor && (fromColor !== toColor)) {
      return 'capture'
    }
  }
  return null
}

const resolvableMoves = (
  board: Board,
  piece: Piece,
  from: Position,
  ignoreCastling?: boolean // only relevant for king
): ResolvableMove[] => {

  const resolvableNE = resolvableMovesAndCapture(
    board,
    piece,
    from,
    nextNE
  )

  const resolvableSE = resolvableMovesAndCapture(
    board,
    piece,
    from,
    nextSE
  )

  const resolvableNW = resolvableMovesAndCapture(
    board,
    piece,
    from,
    nextNW
  )

  const resolvableSW = resolvableMovesAndCapture(
    board,
    piece,
    from,
    nextSW
  )

  const resolvableN = resolvableMovesAndCapture(
    board,
    piece,
    from,
    nextN
  )

  const resolvableS = resolvableMovesAndCapture(
    board,
    piece,
    from,
    nextS
  )

  const resolvableE = resolvableMovesAndCapture(
    board,
    piece,
    from,
    nextE
  )

  const resolvableW = resolvableMovesAndCapture(
    board,
    piece,
    from,
    nextW
  )

  return [
    ...resolvableN, 
    ...resolvableS, 
    ...resolvableE, 
    ...resolvableW,
    ...resolvableNE, 
    ...resolvableSE,
    ...resolvableNW,
    ...resolvableSW
  ]
}

export default {resolve, resolvableMoves}
