import type Position from './Position'
import { type Rank, type File, FILES } from './Position'
import { isOpponent  } from './Piece'
import type Board from './Board'
import type Piece from './Piece'
import { type ResolvableMove } from './game/ActionResolver'
import PIECETYPE_TO_UNICODE from './pieceTypeToUnicode'

const hasN = (pos: Position, distance: 1 | 2 = 1) => (pos.rank <= ((distance === 1) ? 7 : 6))
const hasS = (pos: Position, distance: 1 | 2 = 1) => (pos.rank >= ((distance === 1) ? 2 : 3))
const hasE = (pos: Position, distance: 1 | 2 = 1) => (FILES.indexOf(pos.file) <= ((distance === 1) ? 6 : 5))
const hasW = (pos: Position, distance: 1 | 2 = 1) => (FILES.indexOf(pos.file) >= ((distance === 1) ? 1 : 2))

  // Call above checks first
const getNRank = (pos: Position, distance: 1 | 2 = 1): Rank => (pos.rank + distance as Rank)
const getSRank = (pos: Position, distance: 1 | 2 = 1): Rank => (pos.rank - distance as Rank)
const getEFile = (pos: Position, distance: 1 | 2 = 1): File => (FILES[FILES.indexOf(pos.file) + distance])
const getWFile = (pos: Position, distance: 1 | 2 = 1): File => (FILES[FILES.indexOf(pos.file) - distance])

const nextNE = (pos: Position): Position | null => {
  if (!hasN(pos) || !hasE(pos)) return null
  return {
    file: getEFile(pos),
    rank: getNRank(pos)
  }
}

const nextSE = (pos: Position): Position | null => {
  if (!hasS(pos) || !hasE(pos)) return null
  return {
    file: getEFile(pos),
    rank: getSRank(pos)
  }
}

const nextNW = (pos: Position): Position | null => {
  if (!hasN(pos) || !hasW(pos)) return null
  return {
    file: getWFile(pos),
    rank: getNRank(pos)
  }
}

const nextSW = (pos: Position): Position | null => {
  if (!hasS(pos) || !hasW(pos)) return null
  return {
    file: getWFile(pos),
    rank: getSRank(pos)
  }
}

const nextN = (pos: Position): Position | null => {
  if (!hasN(pos)) return null
  return {
    file: pos.file,
    rank: getNRank(pos)
  }
}

const nextS = (pos: Position): Position | null => {
  if (!hasS(pos)) return null
  return {
    file: pos.file,
    rank: getSRank(pos)
  }
}

const nextE = (pos: Position): Position | null => {
  if (!hasE(pos)) return null
  return {
    file: getEFile(pos),
    rank: pos.rank
  }
}

const nextW = (pos: Position): Position | null => {
  if (!hasW(pos)) return null
  return {
    file: getWFile(pos),
    rank: pos.rank
  }
}

  // Returns resolvable moves along Rank or File
  // or diagonally. (use with nextNW() etc)
const resolvableMovesAndCapture = (
  board: Board,
  piece: Piece,
  from: Position,
  getNext: (pos: Position) => Position | null
): ResolvableMove[] => {

  const resolvable = [] as ResolvableMove[]
  let pos = getNext(from)
  while (pos) {
    const pieceEncountered = board.pieceAt(pos)
    if (!pieceEncountered) {
      resolvable.push({
        move: {
          piece,
          from,
          to: pos
        },
        action: 'move'
      }) 
      pos = getNext(pos)
    }
    else {
      if (isOpponent(pieceEncountered, piece.color)) {
        resolvable.push({
          move: {
            piece,
            from,
            to: pos
          },
          action: 'capture'
        }) 
      }
      pos = null
    }
  }
  return resolvable
} 


export {
  hasN,
  hasS,
  hasE,
  hasW,
  getNRank,
  getSRank,
  getEFile,
  getWFile,
  nextN,
  nextS,
  nextE,
  nextW,
  nextNE,
  nextNW,
  nextSE,
  nextSW,
  resolvableMovesAndCapture,
  PIECETYPE_TO_UNICODE
}