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
import { type BoardSnapshot } from '../../Snapshot'

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

type RankSquares = {
  [key in File]: Square
}

const deepCopyRankSquares = (rs: RankSquares): RankSquares => {
  const result = {}
  for (const key in rs) {
    result[key] = rs[key] ? Square.copy(rs[key]) : null // just for shits and giggles. 
  }
  return result as RankSquares
}

class Squares {

  constructor (tr: Tracking, observePieces? : boolean) {

    for (const rank of RANKS) {
      this[rank] = {}
        // White pieces
      if (rank === 1) {
        for (const file of FILES) {
          this[rank][file] = new Square(rank, file, { type: PIECETYPE_BY_FILE[file], color: 'white' }, 'none', observePieces)
          track(tr, this[rank][file])
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
          track(tr, this[rank][file])
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
          this[rank][file].piece = { type: PIECETYPE_BY_FILE[file], color: 'white' }
          this[rank][file].status = 'none'
          track(tr, this[rank][file])
        }
      }
      else if (rank === 2) {
        for (const file of FILES) {
          this[rank][file].piece = { type: 'pawn', color: 'white' }
          this[rank][file].status = 'none'
        }
      }
      else if (rank === 7) {
        for (const file of FILES) {
          this[rank][file].piece = { type: 'pawn', color: 'black' }
          this[rank][file].status = 'none'
        }
      }
      else if (rank === 8) {
        for (const file of FILES) {
          this[rank][file].piece = { type: PIECETYPE_BY_FILE[file], color: 'black' }
          this[rank][file].status = 'none'
          track(tr, this[rank][file])
        }
      }
      else {
        for (const file of FILES) {
          this[rank][file].piece = null
          this[rank][file].status = 'none'
        }
      }
    } 
  }
  
    // Intentionally forgiving. If meaningful keys are found, 
    // their values are parsed. If they can be parsed, pieces are created.
    // if not, square is empty (no Error's are thrown)
  syncToSnapshot(snapshot: BoardSnapshot, tr: Tracking): void {

    const assignToSquare = (sq: Square): void => {
      const keyToTry = positionToString(sq)
      if (snapshot[keyToTry]) {
        sq.piece = pieceFromString(snapshot[keyToTry]) ?? null // in case undefined
        sq.status = 'none'
      }
      else {
        sq.piece = null
        sq.status = 'none'
      }
    }

    for (const rank of RANKS) {
      for (const file of FILES) {
        assignToSquare(this[rank][file])
        if (this[rank][file].piece) {
          track(tr, this[rank][file])
        }
      }
    }
  }

  syncTo(source: Squares): void {
    for (const key in source) {
      this[key] = deepCopyRankSquares(source[key])
    }
  }
} 

export default Squares
