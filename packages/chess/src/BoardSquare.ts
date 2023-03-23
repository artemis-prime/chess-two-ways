import type Square from './Square'
import { squareToString } from './Square'
import type Piece from './Piece'
import { pieceToString } from './Piece'
interface BoardSquare extends Square {
  piece: Piece | undefined // if a piece is currently in the square
}

  // used in internal syncing
const copyBoardSquare = (toCopy: BoardSquare) => ({
  rank: toCopy.rank,
  file: toCopy.file,
  piece: {...toCopy.piece}
})

const boardSquareToString = (sq: BoardSquare, specifyColor?: boolean) => {
  const formatForPiece = (specifyColor) ? 'cT' : 'T'
  return pieceToString(sq.piece, formatForPiece) + squareToString(sq)
}


export { type BoardSquare as default, copyBoardSquare, boardSquareToString }  
