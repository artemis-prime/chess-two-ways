export type Color =
  'black' | 
  'white'

export type PieceType =
  'pawn' |
  'queen' |
  'bishop' |
  'rook' |
  'knight' | 
  'king'


interface Piece {
  type: PieceType
  color: Color
} 

export type Side = Color

export default Piece
