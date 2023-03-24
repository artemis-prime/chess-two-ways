import type { PieceType, PrimaryPieceType } from '../Piece'
import { PRIMARY_PIECES } from '../Piece'
import BoardSquare from '../BoardSquare'
import type { Tracking } from './Tracking'
import type Squares from './Squares'
import { type File, copySquare, RANKS, FILES } from '../Square'

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

  // call for all BoardSquare that contains a piece
const track = (tr: Tracking, sq: BoardSquare): void => {
  const sqCopy = copySquare(sq)
  if (sq.piece!.type === 'king') {
    tr[sq.piece!.color].king = sqCopy
  }
  else {
    if (PRIMARY_PIECES.includes(sq.piece!.type)) {
      const type = sq.piece!.type as PrimaryPieceType
      const squares = tr[sq.piece!.color].primaries.get(type)
      if (!squares) {
        tr[sq.piece!.color].primaries.set(type, [sqCopy])
      }
      else {
        squares.push(sqCopy)  
      }
    }  
  }
}

const freshBoard = (tr: Tracking, observePieces? : boolean): Squares => {

  const result: any = {}
  for (const rank of RANKS) {
    const rankArray: any = {}
      // White pieces
    if (rank === 1) {
      for (const file of FILES) {
        rankArray[file] = new BoardSquare(
          rank,
          file,
          {
            type: PIECES_BY_FILE[file],
            color: 'white'
          },
          observePieces
        )
        track(tr, rankArray[file])
      }
    }
      // White pawns
    else if (rank === 2) {
      for (const file of FILES) {
        rankArray[file] = new BoardSquare(
          rank,
          file,
          {
            type: 'pawn',
            color: 'white'
          },
          observePieces
        )
      }
    }
      // Black pawns
    else if (rank === 7) {
      for (const file of FILES) {
        rankArray[file] = new BoardSquare(
          rank,
          file,
          {
            type: 'pawn',
            color: 'black'
          },
          observePieces
        )
      }
    }
      // Black pieces
    else if (rank === 8) {
      for (const file of FILES) {
        rankArray[file] = new BoardSquare(
          rank,
          file,
          {
            type: PIECES_BY_FILE[file],
            color: 'black'
          },
          observePieces
        )
        track(tr, rankArray[file])
      }
    }
    else {
      for (const file of FILES) {
        rankArray[file] = new BoardSquare( 
          rank,
          file,
          null,
          observePieces
        )  
      }
    }
    result[rank] = rankArray
  } 
  return result as Squares
}

export default freshBoard
