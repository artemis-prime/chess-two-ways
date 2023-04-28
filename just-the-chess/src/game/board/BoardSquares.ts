import Square from '../Square'

import { 
  type PieceType, 
  type PrimaryPieceType, 
  pieceFromCodeString,
  isPrimaryType 
} from '../../Piece'

import { 
  type File, 
  type PositionCode,
  positionToString, 
  RANKS, 
  FILES 
} from '../../Position'
import type { SquaresSnapshot } from '../../Snapshot'

import type Tracking from './Tracking'

const HOME_RANK = {
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
  if (pos.piece!.type === 'king') {
    tr[pos.piece!.color].king = pos
  }
  else {
    if (isPrimaryType(pos.piece!.type)) {
      tr[pos.piece!.color].setPrimaryTypePosition(pos.piece!.type as PrimaryPieceType, pos)
    }  
  }
}

type RankSquares = {
  [key in File]: Square
}

const rankSquaresFromArray = (sqs: Square[]): RankSquares => {
  
  if (sqs.length !== 8) {
    throw new Error('rankSquaresFromArray(): array of Squares must contain exactly 8 elements!')
  }
  return {
    a: sqs[0],
    b: sqs[1],
    c: sqs[2],
    d: sqs[3],
    e: sqs[4],
    f: sqs[5],
    g: sqs[6],
    h: sqs[7],
  }
}

const deepCopyRankSquares = (rs: RankSquares): RankSquares => {
  const squares = Object.values(rs)
  const rankArray: Square[] = []
  for (const square of squares) {
    rankArray.push(square.clone()) 
  }
  return rankSquaresFromArray(rankArray)
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

  static visitAsNewGame(sq: Square, tr: Tracking, assignState = true): void {
    if (sq.rank === 1) {
      sq.piece = { type: HOME_RANK[sq.file], color: 'white' }
      track(tr, sq)
    }
    else if (sq.rank === 2) {
      sq.piece = { type: 'pawn', color: 'white' }
    }
    else if (sq.rank === 8) {
      sq.piece = { type: HOME_RANK[sq.file], color: 'black' }
      track(tr, sq)
    }
    else if (sq.rank === 7) {
      sq.piece = { type: 'pawn', color: 'black' }
    }
    else {
      sq.piece = null
    }
    if (assignState) {
      sq.state = 'none'
    }
  }

    // Intentionally forgiving. If a key corresponding to a
    // square is found and its value successfully parsed, a piece is placed there. 
    // If not, the square is empty (no Errors are ever thrown)
  static visitWithSnapshot(sq: Square, snapshot: SquaresSnapshot, tr: Tracking): void {
    const keyToTry = positionToString(sq) as PositionCode
    if (snapshot[keyToTry]) {
        // If pieceFromCodeString is undefined, default to null
      sq.piece = pieceFromCodeString(snapshot[keyToTry]!) ?? null 
      if (sq.piece) {
        track(tr, sq)
      }
    }
    else {
      sq.piece = null
    }
    sq.state = 'none'
  }

  constructor (tr: Tracking, observePieces? : boolean) {
    for (const rank of RANKS) {
      const sqs: Square[] = []
      for (const file of FILES) {
        const sq = new Square(rank, file, null, 'none', observePieces)  
        BoardSquares.visitAsNewGame(sq, tr, false)
        sqs.push(sq)
      }
      this[rank] = rankSquaresFromArray(sqs)
    } 
  }

  reset(tr: Tracking) {
    for (const rank of RANKS) {
      for (const file of FILES) {
        BoardSquares.visitAsNewGame(this[rank][file], tr)
      }
    }
  }
 
  syncToSnapshot(snapshot: SquaresSnapshot, tr: Tracking): void {
    for (const rank of RANKS) {
      for (const file of FILES) {
        BoardSquares.visitWithSnapshot(this[rank][file], snapshot, tr)
      }
    }
  }

  syncTo(source: BoardSquares): void {
    for (const rank of RANKS) {
      this[rank] = deepCopyRankSquares(source[rank])
    }
  }
} 

export default BoardSquares
