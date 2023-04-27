import Square from '../Square'

import { 
  type PieceType, 
  type PrimaryPieceType, 
  PRIMARY_PIECES, 
  pieceFromString 
} from '../../Piece'

import { 
  type File, 
  positionToString, 
  copyPosition, 
  RANKS, 
  FILES 
} from '../../Position'
import { type BoardSnapshot, type PositionCode } from '../../Snapshot'

import type Tracking from './Tracking'

const PIECETYPE_BY_FILE = {
  'a': 'rook',
  'b': 'knight',
  'c': 'bishop',
  'd': 'queen',
  'e': 'king',
  'f': 'bishop',
  'g': 'knight',
  'h': 'rook',
} as {
  [key in File]: PieceType
}

  // call for all Square that contains a piece
const track = (tr: Tracking, pos: Square): void => {
  const sqCopy = copyPosition(pos)
  if (pos.piece!.type === 'king') {
    tr[pos.piece!.color].king = sqCopy
  }
  else {
    if (PRIMARY_PIECES.includes(pos.piece!.type)) {
      const type = pos.piece!.type as PrimaryPieceType
      const positions = tr[pos.piece!.color].primaries.get(type)
      if (!positions) {
        tr[pos.piece!.color].primaries.set(type, [sqCopy])
      }
      else {
        positions.push(sqCopy)  
      }
    }  
  }
}

type RankSquares = Partial<{
  [key in File]: Square
}>


  // https://stackoverflow.com/questions/59656190/define-key-type-for-object-in-for-in
const deepCopyRankSquares = (rs: RankSquares): RankSquares => {
  const result: RankSquares = {}
  for (const key of FILES) {
    result[key] = Square.copy(rs[key] as Square) 
  }
  return result as RankSquares
}

class BoardSquares {

  1: RankSquares
  2: RankSquares
  3: RankSquares
  4: RankSquares
  5: RankSquares
  6: RankSquares
  7: RankSquares
  8: RankSquares

  constructor (tr: Tracking, observePieces? : boolean) {

    for (const rank of RANKS) {
      if (rank === 1) {
        for (const file of FILES) {
          this[rank][file] = new Square(rank, file, { type: PIECETYPE_BY_FILE[file], color: 'white' }, 'none', observePieces)
          track(tr, this[rank][file]!)
        }
      }
      else if (rank === 2) {
        for (const file of FILES) {
          this[rank][file] = new Square(rank, file, { type: 'pawn', color: 'white' }, 'none', observePieces)
        }
      }
      else if (rank === 7) {
        for (const file of FILES) {
          this[rank][file] = new Square(rank, file, { type: 'pawn', color: 'black' }, 'none', observePieces)
        }
      }
      else if (rank === 8) {
        for (const file of FILES) {
          this[rank][file] = new Square(rank, file, { type: PIECETYPE_BY_FILE[file], color: 'black' }, 'none', observePieces)
          track(tr, this[rank][file]!)
        }
      }
      else {
        for (const file of FILES) {
          this[rank][file] = new Square(rank, file, null, 'none', observePieces)  
        }
      }
    } 
  }

  reset(tr: Tracking) {

    for (const rank of RANKS) {
      if (rank === 1) {
        for (const file of FILES) {
          this[rank][file]!.piece = { type: PIECETYPE_BY_FILE[file], color: 'white' }
          this[rank][file]!.state = 'none'
          track(tr, this[rank][file]!)
        }
      }
      else if (rank === 2) {
        for (const file of FILES) {
          this[rank][file]!.piece = { type: 'pawn', color: 'white' }
          this[rank][file]!.state = 'none'
        }
      }
      else if (rank === 7) {
        for (const file of FILES) {
          this[rank][file]!.piece = { type: 'pawn', color: 'black' }
          this[rank][file]!.state = 'none'
        }
      }
      else if (rank === 8) {
        for (const file of FILES) {
          this[rank][file]!.piece = { type: PIECETYPE_BY_FILE[file], color: 'black' }
          this[rank][file]!.state = 'none'
          track(tr, this[rank][file]!)
        }
      }
      else {
        for (const file of FILES) {
          this[rank][file]!.piece = null
          this[rank][file]!.state = 'none'
        }
      }
    } 
  }
  
    // Intentionally forgiving. If meaningful keys are found, 
    // their values are parsed. If they can be parsed, pieces are created.
    // if not, square is empty (no Error's are thrown)
  syncToSnapshot(snapshot: BoardSnapshot, tr: Tracking): void {

    const assignToSquare = (sq: Square): void => {
      const keyToTry = positionToString(sq) as PositionCode
      if (snapshot[keyToTry]) {
        sq.piece = pieceFromString(snapshot[keyToTry]!) ?? null // in case undefined
        sq.state = 'none'
      }
      else {
        sq.piece = null
        sq.state = 'none'
      }
    }

    for (const rank of RANKS) {
      for (const file of FILES) {
        assignToSquare(this[rank][file]!)
        if (this[rank][file]!.piece) {
          track(tr, this[rank][file]!)
        }
      }
    }
  }

  syncTo(source: BoardSquares): void {
    for (const key of RANKS) {
      this[key] = deepCopyRankSquares(source[key])
    }
  }
} 

export default BoardSquares
