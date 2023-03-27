type Color =
  'black' | 
  'white'

type PieceType =
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
type _PrimaryPiecesArrayType = typeof _PRIMARY_PIECES
type PrimaryPieceType = _PrimaryPiecesArrayType[number]

  // more convenient to coerce here
const PRIMARY_PIECES = _PRIMARY_PIECES as readonly string[]

  // see above
  // pawns can only be promoted to these.
  // (Also, only the locations of these pieces get cached for testing sideIsInCheck) 
/**  please leave
type PrimaryPieceType = 
  'queen' |
  'rook' |
  'bishop' |
  'knight'  
*/

const PIECE_TYPE_NAMES = {
  pawn: {
    short: 'P',
    long: 'Pawn'
  },
  queen: {
    short: 'Q',
    long: 'Queen'
  },
  bishop: {
    short: 'B',
    long: 'Bishop'
  },
  rook: {
    short: 'R',
    long: 'Rook'
  },
  knight: {
    short: 'N',
    long: 'Knight'
  },
  king: {
    short: 'K',
    long: 'King'
  },
}

interface Piece {
  readonly type: PieceType
  readonly color: Color
} 

type Side = Color

const piecesExistAndAreEqual = (p1: Piece, p2: Piece) => (
  !!p1 && !!p2 && (p1.type === p2.type) && (p1.color === p2.color)
)

type PieceFormat = 'T' | 'Type' | 'cT' | 'c-Type' | 'color Type'

const pieceToString = (p: Piece, format?: PieceFormat): string => {
  const form: PieceFormat = format ?? 'cT'
  switch (form) {
    case 'T': return PIECE_TYPE_NAMES[p.type].short
    case 'Type': return PIECE_TYPE_NAMES[p.type].long
    case 'cT': return (p.color === 'white' ? 'w' : 'b') + PIECE_TYPE_NAMES[p.type].short
    case 'c-Type': return (p.color === 'white' ? 'w-' : 'b-') + PIECE_TYPE_NAMES[p.type].long
    case 'color Type': return `${p.color} ${PIECE_TYPE_NAMES[p.type].long}`
  }
}

const opponent = (side: Side): Side => (
  (side === 'white') ? 'black' : 'white'
)

export { 
  type Piece as default, 
  type Color,
  type PieceType,
  type PrimaryPieceType,
  type Side,
  type PieceFormat,
  PRIMARY_PIECES,
  piecesExistAndAreEqual,
  pieceToString,
  PIECE_TYPE_NAMES,
  opponent 
}
