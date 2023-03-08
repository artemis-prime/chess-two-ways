import { File, RANKS, FILES} from './RankAndFile'
import { PieceType } from './Piece'
import Board from './Board'

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

const newBoard = (): Board => {

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
      // Black pawns
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
  return result as Board
}

export default newBoard
