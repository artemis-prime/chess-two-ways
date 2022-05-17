import { GameService } from "./GameService"

export enum Colors {
  black = 'black', 
  white = 'white',
 }

export enum PieceTypes {
  pawn = 'pawn',
  queen = 'queen',
  bishop = 'bishop'
}

export interface Piece {
  type: PieceTypes
  color: Colors
} 

export interface Occupant {
  piece: Piece | undefined
} 

export interface Square extends Occupant {
  row: number
  col: number
}

export enum MoveTypes {
  move = 'move',
  take = 'take',
  convert = 'convert',
  invalid = 'invalid'
}

export interface MoveResolver {
  (
    game: GameService,
    fromRow: number, 
    fromCol: number,
    toRow: number, 
    toCol: number,
  ): MoveTypes
}
