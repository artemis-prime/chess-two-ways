import type { 
  Action, 
  Board,
  Move, 
  Piece,
  Position
} from '..'
import { type ResolvableMove } from '../game/ActionResolver'

import {
  nextN,
  nextS,
  nextE,
  nextW,
  resolvableMovesAndCapture
} from '../util'

const resolve = (
  board: Board,
  move: Move,
  messageFn?: (s: String) => void
): Action | null => {
  
  if (board.isClearAlongRank(move.from, move.to) || board.isClearAlongFile(move.from, move.to) ) {
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

  return [...resolvableN, ...resolvableS, ...resolvableE, ...resolvableW]
}

export default {resolve, resolvableMoves}
