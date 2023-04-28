import Square from '../Square'

import { 
  type PieceType, 
  type PrimaryPieceType, 
  pieceFromString,
  isPrimaryType 
} from '../../Piece'

import { 
  type File, 
  positionToString, 
  RANKS, 
  FILES 
} from '../../Position'
import { type BoardSnapshot, type PositionCode } from '../../Snapshot'

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
      const primaryType = pos.piece!.type as PrimaryPieceType
      const positions = tr[pos.piece!.color].primaries.get(primaryType)
      if (!positions) {
        tr[pos.piece!.color].primaries.set(primaryType, [pos])
      }
      else {
        positions.push(pos)  
      }
    }  
  }
}

type RankSquares = {
  [key in File]: Square
}

const rankSquaresFromArray = (sqs: Square[]): RankSquares => ({
  a: sqs[0],
  b: sqs[1],
  c: sqs[2],
  d: sqs[3],
  e: sqs[4],
  f: sqs[5],
  g: sqs[6],
  h: sqs[7],
})

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

  static visitForReset(sq: Square, tr: Tracking): void {
    if (sq.rank === 1) {
      sq.piece = { type: HOME_RANK[sq.file], color: 'white' }
      sq.state = 'none'
      track(tr, sq)
    }
    else if (sq.rank === 2) {
      sq.piece = { type: 'pawn', color: 'white' }
      sq.state = 'none'
    }
    else if (sq.rank === 8) {
      sq.piece = { type: HOME_RANK[sq.file], color: 'black' }
      sq.state = 'none'
      track(tr, sq)
    }
    else if (sq.rank === 7) {
      sq.piece = { type: 'pawn', color: 'black' }
      sq.state = 'none'
    }
    else {
      sq.piece = null
      sq.state = 'none'
    }
  }

  constructor (tr: Tracking, observePieces? : boolean) {
    for (const rank of RANKS) {
      const sqs: Square[] = []
      for (const file of FILES) {
        const sq = new Square(rank, file, null, 'none', observePieces)  
        BoardSquares.visitForReset(sq, tr)
        sqs.push(sq)
      }
      this[rank] = rankSquaresFromArray(sqs)
    } 
  }

  reset(tr: Tracking) {
    for (const rank of RANKS) {
      for (const file of FILES) {
        BoardSquares.visitForReset(this[rank][file], tr)
      }
    }
  }
 
    // Intentionally forgiving. If meaningful keys are found, 
    // their values are parsed. If they can be parsed, pieces are created.
    // If not, no Errors are thrown and square is just empty.
  syncToSnapshot(snapshot: BoardSnapshot, tr: Tracking): void {

    const visit = (sq: Square): void => {
      const keyToTry = positionToString(sq) as PositionCode
      if (snapshot[keyToTry]) {
        sq.piece = pieceFromString(snapshot[keyToTry]!) ?? null // in case undefined
        sq.state = 'none'
        if (sq.piece) {
          track(tr, sq)
        }
      }
      else {
        sq.piece = null
        sq.state = 'none'
      }
    }

    for (const rank of RANKS) {
      for (const file of FILES) {
        visit(this[rank][file])
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
