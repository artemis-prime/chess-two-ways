import type { File, Rank } from '../Position'
import type { PieceTypeCode, ColorCode } from '../Piece'

type PositionCode = `${File}${Rank}`
type PieceCode = `${ColorCode}${PieceTypeCode}`

  // Only squares with pieces get a key.
  // (if absent, the corresponding square is empty)
type BoardSnapshot = {
  [key in PositionCode]?: PieceCode  
}

interface GameSnapshot {

  artemisPrimeChessGame: any
  board: BoardSnapshot
  actions: string[]
  //stateIndex: number
  currentTurn: ColorCode
}

export {
  type GameSnapshot,
  type BoardSnapshot,
  type PositionCode,
  type PieceCode
} 