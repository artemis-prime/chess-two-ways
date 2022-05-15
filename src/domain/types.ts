export enum Colors {
  black = 'black', 
  white = 'white',
 }

export enum PieceTypes {
  pawn = 'pawn',
  queen = 'queen',
}

export interface Piece {
  type: PieceTypes
  color: Colors
} 

export interface Content {
  piece: Piece | undefined
} 

export interface Square extends Content {
  row: number
  col: number
}

export enum MoveTypes {
  move = 'move',
  take = 'take',
  invalid = 'invalid'
}
