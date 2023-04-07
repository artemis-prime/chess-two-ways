import type { File, Rank } from '../Position'
import type { PieceTypeCode, ColorCode } from '../Piece'

type PositionCode = `${File}${Rank}`
type PieceCode = `${ColorCode}${PieceTypeCode}`

  // Only squares with pieces get a key.
  // (if absent, the corresponding square is empty)
type BoardData = {
  [key in PositionCode]?: PieceCode  
}

interface GameData {

  artemisPrimeChessGame: any
  board: BoardData
  actions: string[]
  //stateIndex: number
  currentTurn: ColorCode
}

export {
  type GameData as default,
  type BoardData,
  type PositionCode,
  type PieceCode
} 