import { makeObservable, observable } from 'mobx'

import type Piece from '../../Piece'
import { 
  type PieceType, 
  type PrimaryPieceType, 
  PRIMARY_PIECES, 
  pieceFromString 
} from '../../Piece'
import type Position from '../../Position'
import { 
  type File, 
  type Rank, 
  positionToString, 
  copyPosition, 
  RANKS, 
  FILES 
} from '../../Position'
import { type BoardSnapshot } from '../../Snapshot'

import type Tracking from './Tracking'

const PIECES_BY_FILE = {
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

class Square implements Position {

  readonly rank: Rank
  readonly file: File
  piece: Piece | null 

  constructor(rank: Rank, file: File, piece: Piece | null, observePiece?: boolean) {
    this.rank = rank
    this.file = file
    this.piece = piece
    
    if (observePiece) {
      makeObservable(this, { piece: observable.shallow})
    }
  }

  static copy(s: Square): Square {
    return new Square(
      s.rank,
      s.file,
      s.piece ? {...s.piece} : null
    )
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

  constructor (tr: Tracking, observeOccupant? : boolean) {

    for (const rank of RANKS) {
      const rankSquares: any = {}
        // White pieces
      if (rank === 1) {
        for (const file of FILES) {
          rankSquares[file] = new Square(rank, file, { type: PIECES_BY_FILE[file], color: 'white' }, observeOccupant)
          track(tr, rankSquares[file])
        }
      }
      else if (rank === 2) {
        for (const file of FILES) {
          rankSquares[file] = new Square(rank, file, { type: 'pawn', color: 'white' }, observeOccupant)
        }
      }
      else if (rank === 7) {
        for (const file of FILES) {
          rankSquares[file] = new Square(rank, file, { type: 'pawn', color: 'black' }, observeOccupant)
        }
      }
      else if (rank === 8) {
        for (const file of FILES) {
          rankSquares[file] = new Square(rank, file, { type: PIECES_BY_FILE[file], color: 'black' }, observeOccupant)
          track(tr, rankSquares[file])
        }
      }
      else {
        for (const file of FILES) {
          rankSquares[file] = new Square(rank, file, null, observeOccupant)  
        }
      }
      this[rank] = rankSquares as RankSquares
    } 
  }

  reset(tr: Tracking) {

    for (const rank of RANKS) {
      const rankArray = this[rank]
      if (rank === 1) {
        for (const file of FILES) {
          rankArray[file].piece = { type: PIECES_BY_FILE[file], color: 'white' }
          track(tr, rankArray[file])
        }
      }
      else if (rank === 2) {
        for (const file of FILES) {
          rankArray[file].piece = { type: 'pawn', color: 'white' }
        }
      }
      else if (rank === 7) {
        for (const file of FILES) {
          rankArray[file].piece = { type: 'pawn', color: 'black' }
        }
      }
      else if (rank === 8) {
        for (const file of FILES) {
          rankArray[file].piece = { type: PIECES_BY_FILE[file], color: 'black' }
          track(tr, rankArray[file])
        }
      }
      else {
        for (const file of FILES) {
          rankArray[file].piece = null
        }
      }
    } 
  }
  
    // Intentionally forgiving. If meaningful keys are found, 
    // their values are parsed. If they can be parsed, pieces are created.
    // if not, square is empty (no Error's are thrown)
  syncToSnapshot(snapshot: BoardSnapshot, tr: Tracking): void {

    const pieceForSquare = (sq: Square): void => {
      const keyToTry = positionToString(sq)
      if (snapshot[keyToTry]) {
        sq.piece = pieceFromString(snapshot[keyToTry]) ?? null // in case undefined
      }
      else {
        sq.piece = null
      }
    }

    for (const rank of RANKS) {
      const rankArray = this[rank]
      for (const file of FILES) {
        pieceForSquare(rankArray[file])
        if (rankArray[file].piece) {
          track(tr, rankArray[file])
        }
      }
    }
  }


  syncTo = (source: Squares): void => {
    for (const key in source) {
      this[key] = deepCopyRankSquares(source[key])
    }
  }
} 

export default Squares
