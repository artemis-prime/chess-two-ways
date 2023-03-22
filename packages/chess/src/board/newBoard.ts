import type { File } from '../RankAndFile'
import { RANKS, FILES} from '../RankAndFile'
import type { PieceType, PrimaryPieceType } from '../Piece'
import { PRIMARY_PIECES } from '../Piece'
import type BoardSquare from '../BoardSquare'
import type { Tracking } from './Tracking'
import type Squares from './Squares'

const pieceFromInitialFile = (file: File):  PieceType | undefined => {
  let type: PieceType | undefined = undefined
  if (file === 'a' || file === 'h') {
    type = 'rook'
  }
  else if (file === 'c' || file === 'f') {
    type = 'bishop'
  }
  else if (file === 'b' || file === 'g') {
    type = 'knight'
  }
  else if (file === 'd') {
    type = 'queen'
  }
  else if (file = 'e') {
    type = 'king'
  }
  return type
}

  // call for all BoardSquare that contains a piece
const track = (tr: Tracking, sq: BoardSquare): void => {
  if (sq.piece!.type === 'king') {
    tr[sq.piece!.color].king = sq
  }
  else {
    if (PRIMARY_PIECES.includes(sq.piece!.type)) {
      const type = sq.piece!.type as PrimaryPieceType
      const squares = tr[sq.piece!.color].primaries.get(type)
      if (!squares) {
        tr[sq.piece!.color].primaries.set(type, [sq])
      }
      else {
        squares.push(sq)  
      }
    }  
  }
}

const newBoard = (tr: Tracking): Squares => {

  const result: any = {}
  for (const rank of RANKS) {
    const rankArray: any = {}
      // White pieces
    if (rank === 1) {
      for (const file of FILES) {
        rankArray[file] = { 
          rank,
          file
        }
        const type = pieceFromInitialFile(file)  
        if (type) {
          rankArray[file].piece = {
            type,
            color: 'white'
          } 
          track(tr, rankArray[file])
        }
      }
    }
      // White pawns
    else if (rank === 2) {
      for (const file of FILES) {
        rankArray[file] = {
          piece: {
            type: 'pawn',
            color: 'white'
          },
          rank,
          file
        }
      }
    }
      // Black pawns
    else if (rank === 7) {
      for (const file of FILES) {
        rankArray[file] = {
          piece: {
            type: 'pawn',
            color: 'black'
          },
          rank,
          file
        }
      }
    }
      // Black pieces
    else if (rank === 8) {
      for (const file of FILES) {
        rankArray[file] = { 
          rank,
          file
        }  
        const type = pieceFromInitialFile(file)  
        if (type) {
          rankArray[file].piece = {
            type,
            color: 'black'
          } 
          track(tr, rankArray[file])
        }
      }
    }
    else {
      for (const file of FILES) {
        rankArray[file] = { 
          rank,
          file
        }  
      }
    }
    result[rank] = rankArray
  } 
  return result as Squares
}

export default newBoard
