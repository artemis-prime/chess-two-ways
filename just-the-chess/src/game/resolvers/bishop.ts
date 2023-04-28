import type { 
  Action, 
  Piece, 
  Position, 
  Move, 
  Resolution,
} from '../..'

import type Board from '../Board'

import {
  nextNE,
  nextNW,
  nextSE,
  nextSW,
  resolvableMovesAndCapture
} from '../util'


const resolve = (
  board: Board,
  move: Move,
  messageFn?: (s: string) => void
): Action | null => {
  
  if (board.isClearAlongDiagonal(move.from, move.to)) {
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
): Resolution[] => {

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

  return [...resolvableNE, ...resolvableSE, ...resolvableNW, ...resolvableSW]
}

export default {resolve, resolvableMoves} 
