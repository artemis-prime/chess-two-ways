import type { PieceType, PrimaryPieceType } from '../Piece'
import { PRIMARY_PIECES, pieceToString, pieceFromString } from '../Piece'
import Square from '../Square'
import type Tracking from './Tracking'
import type Squares from './Squares'
import { type File, positionToString, copyPosition, RANKS, FILES } from '../Position'

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

const freshBoard = (tr: Tracking, observePieces? : boolean): Squares => {

  const result: any = {}
  for (const rank of RANKS) {
    const rankArray: any = {}
      // White pieces
    if (rank === 1) {
      for (const file of FILES) {
        rankArray[file] = new Square(
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
        rankArray[file] = new Square(
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
        rankArray[file] = new Square(
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
        rankArray[file] = new Square(
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
        rankArray[file] = new Square( 
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

const resetBoard = (sqs: Squares, tr: Tracking): void => {

  for (const rank of RANKS) {
    const rankArray = sqs[rank]
      // White pieces
    if (rank === 1) {
      for (const file of FILES) {
        rankArray[file].piece = 
          {
            type: PIECES_BY_FILE[file],
            color: 'white'
          }
        track(tr, rankArray[file])
      }
    }
      // White pawns
    else if (rank === 2) {
      for (const file of FILES) {
        rankArray[file].piece = 
          {
            type: 'pawn',
            color: 'white'
          }
      }
    }
      // Black pawns
    else if (rank === 7) {
      for (const file of FILES) {
        rankArray[file].piece = 
          {
            type: 'pawn',
            color: 'black'
          }
      }
    }
      // Black pieces
    else if (rank === 8) {
      for (const file of FILES) {
        rankArray[file].piece = 
          {
            type: PIECES_BY_FILE[file],
            color: 'black'
          }
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
  // Intentionally forgiving.  If meaningful keys are found, 
  // their values are parsed.  If they can be parsed, pieces are created.
const syncBoardToGameObject = (
  sqs: Squares, 
  g: any, 
  tr: Tracking
): void => {

  const populateSquare = (sq: Square, g: any): void => {
    const keyToTry = positionToString(sq)
    if (g[keyToTry]) {
      sq.piece = pieceFromString(g[keyToTry]) ?? null // in case undefined
    }
    else {
      sq.piece = null
    }
  }

  for (const rank of RANKS) {
    const rankArray = sqs[rank]
    for (const file of FILES) {
      populateSquare(rankArray[file], g)
      if (rankArray[file].piece) {
        track(tr, rankArray[file])
      }
    }
  }
}

export { freshBoard, resetBoard, syncBoardToGameObject} 
