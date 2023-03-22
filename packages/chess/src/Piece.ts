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

//  https://stackoverflow.com/questions/44480644/string-union-to-string-array
const _PRIMARY_PIECES = [
  'queen',
  'rook',
  'bishop',
  'knight'
] as const 
type PrimaryPiecesArrayType = typeof _PRIMARY_PIECES
export type PrimaryPieceType = PrimaryPiecesArrayType[number]

  // more convenient to coerce here
export const PRIMARY_PIECES = _PRIMARY_PIECES as readonly string[]


  // pawns can only be promoted to these.
  // (Also, only the locations of these pieces get cached for testing inCheck) 
/* please leave
export type PrimaryPieceType = 
  'queen' |
  'rook' |
  'bishop' |
  'knight'  
*/

interface Piece {
  readonly type: PieceType
  readonly color: Color
} 

export type Side = Color

export { type Piece as default }
