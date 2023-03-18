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

export type PromotedPieceType =
  'queen' |
  'bishop' |
  'rook' |
  'knight'  

interface Piece {
  type: PieceType
  color: Color
} 

export type Side = Color

export { type Piece as default }

