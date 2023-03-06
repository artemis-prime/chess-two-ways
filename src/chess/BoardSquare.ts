import Square from './Square'
import Piece from './Piece'

interface BoardSquare extends Square {
  piece?: Piece // if a piece is currently in the square
}

export default BoardSquare