import type { Action, Board, Position, Piece, Move } from '..'
import { type ResolvableMove } from '../game/ActionResolver'

import { isOpponent } from '../Piece'
import { FILES } from '../Position'

import {
  hasN,
  hasS,
  hasE,
  hasW,
  getNRank,
  getSRank,
  getEFile,
  getWFile,
} from '../util'

const legalMove = (
  from: Position, 
  to: Position, 
): boolean => {

  const deltaRank = to.rank - from.rank
  const deltaFile = FILES.indexOf(to.file) - FILES.indexOf(from.file)
  return (
    Math.abs(deltaRank) === 2 && Math.abs(deltaFile) === 1    
    ||
    Math.abs(deltaFile) === 2 && Math.abs(deltaRank) === 1
  ) 
 }

 const resolve = (
  board: Board,
  move: Move,
  messageFn?: (s: String) => void
): Action | null => {
  
  const fromColor = board.colorAt(move.from)
  if (legalMove(move.from, move.to)) {
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
): ResolvableMove[] => {

  const positions = [] as Position[]

  if (hasN(from, 2)) {
    const longSide = {
      rank: getNRank(from, 2),
      file: from.file
    }
    if (hasE(longSide)) {
      positions.push({
        file: getEFile(longSide),
        rank: longSide.rank
      })
    }
    if (hasW(longSide)) {
      positions.push({
        file: getWFile(longSide),
        rank: longSide.rank
      })
    }
  }
  if (hasS(from, 2)) {
    const longSide = {
      rank: getSRank(from, 2),
      file: from.file
    }
    if (hasE(longSide)) {
      positions.push({
        file: getEFile(longSide),
        rank: longSide.rank
      })
    }
    if (hasW(longSide)) {
      positions.push({
        file: getWFile(longSide),
        rank: longSide.rank
      })
    }
  }
  if (hasE(from, 2)) {
    const longSide = {
      rank: from.rank,
      file: getEFile(from, 2)
    }
    if (hasN(longSide)) {
      positions.push({
        file: longSide.file,
        rank: getNRank(from),
      })
    }
    if (hasS(longSide)) {
      positions.push({
        file: longSide.file,
        rank: getSRank(from),
      })
    }
  }
  if (hasW(from, 2)) {
    const longSide = {
      rank: from.rank,
      file: getWFile(from, 2)
    }
    if (hasN(longSide)) {
      positions.push({
        file: longSide.file,
        rank: getNRank(from),
      })
    }
    if (hasS(longSide)) {
      positions.push({
        file: longSide.file,
        rank: getSRank(from),
      })
    }
  }

  const resolvable = [] as ResolvableMove[]
  positions.forEach((pos) => {
    const toPiece = board.pieceAt(pos)
    if (!toPiece) {
      resolvable.push({
        move: {
          piece,
          from,
          to: pos
        },
        action: 'move'
      })
    }
    else if (isOpponent(toPiece, piece.color)) {
      resolvable.push({
        move: {
          piece,
          from,
          to: pos
        },
        action: 'capture'
      })
    }
  })

  return resolvable
}

export default {resolve, resolvableMoves}
