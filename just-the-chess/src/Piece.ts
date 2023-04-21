type Color =
  'black' | 
  'white'

type ColorCode = 'w' | 'b'

const COLOR_FROM_CODE = {
  w: 'white',
  b: 'black'
} as {
  [key in ColorCode] : Color
}

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

const PIECETYPE_FROM_LETTER = {
  P: 'pawn',
  Q: 'queen',
  B: 'bishop',
  R: 'rook',
  N: 'knight',
  K: 'king'
}

type PieceTypeCode = keyof typeof PIECETYPE_FROM_LETTER 

interface Piece {
  readonly type: PieceType
  readonly color: Color
} 

  // opponent of side, and if supplied
  // equal to type or one of the types
const isOpponent = (p: Piece | null, side: Side, type?: PieceType | PieceType[]): boolean => {
  const oppositeSide = (!!p && (p!.color !== side))
  if (!type) {
    return oppositeSide 
  }
  else if (Array.isArray(type)) {
    return oppositeSide && (type! as PieceType[]).includes(p!.type)
  }
  return oppositeSide && (p!.type === type!)  
}

type Side = Color

  // equal if both null,
  // otherwise, not equal if only one is,
  // otherwise, according to fields
const piecesEqual = (p1: Piece | null, p2: Piece | null): boolean => (
  (!p1 && !p2) ? true : (p1?.type === p2?.type) && (p1?.color === p2?.color)
)

type PieceFormat = 'T' | 'Type' | 'cT' | 'c-Type' | 'color Type'

const pieceToString = (p: Piece, format?: PieceFormat): string => {
  const form: PieceFormat = format ?? 'cT'
  switch (form) {
    case 'T': return PIECE_TYPE_NAMES[p.type].short
    case 'Type': return PIECE_TYPE_NAMES[p.type].long
    case 'cT': return p.color.charAt(0) + PIECE_TYPE_NAMES[p.type].short
    case 'c-Type': return `${p.color.charAt(0)}-${PIECE_TYPE_NAMES[p.type].long}`
    case 'color Type': return `${p.color} ${PIECE_TYPE_NAMES[p.type].long}`
  }
}

const pieceFromString = (s: string): Piece | undefined => {
  if (s.length === 2) {
    const c = s.slice(0, 1)
    const t = s.slice(1, 2)

    if (!(c === 'w' || c === 'b') || !Object.keys(PIECETYPE_FROM_LETTER).includes(t)) {
      return undefined
    }
    return {
      color: (c === 'w') ? 'white' : 'black',
      type: PIECETYPE_FROM_LETTER[t]
    }
  }
  return undefined
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
  type PieceTypeCode,
  type ColorCode,
  PRIMARY_PIECES,
  COLOR_FROM_CODE,
  PIECE_TYPE_NAMES,
  PIECETYPE_FROM_LETTER,
  piecesEqual,
  pieceToString,
  isOpponent,
  opponent,
  pieceFromString 
}
