import { Game } from './Game'

export type Color =
  'black' | 
  'white'
 
export type Player = Color

export type PieceType =
  'pawn' |
  'queen' |
  'bishop' |
  'rook' |
  'knight' | 
  'king'

export interface Piece {
  type: PieceType
  color: Color
} 

export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
export const RANKS: Rank[] = [1, 2, 3, 4, 5, 6, 7, 8]
export const RANKS_REVERSE: Rank[] = [8, 7, 6, 5, 4, 3, 2, 1]
export type File = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h'
export const FILES: File[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] 

export interface Square {
  rank: Rank
  file: File
  piece?: Piece | undefined
}

export type RankSquares = {
  [key in File]: Square
}

export type Board = {
  [key in Rank]: RankSquares
} 

export type MoveType =
  'move' |
  'capture' |
  'convert' | 
  'invalid'

export interface Resolver {
  moveType( game: Game, from: Square,  to: Square ): MoveType
  canCapture( game: Game, from: Square, to: Square): boolean
}
