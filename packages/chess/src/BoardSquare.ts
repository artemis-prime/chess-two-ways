import type Square from './Square'
import type Piece from './Piece'

interface BoardSquare extends Square {
  piece?: Piece // if a piece is currently in the square
}

export { type BoardSquare as default }  
