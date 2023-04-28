import type { PositionCode } from './Position'
import type { PieceTypeCode, ColorCode } from './Piece'
import type CastlingTracking from './CastlingTracking'


type PieceCode = `${ColorCode}${PieceTypeCode}`

  // Only squares with pieces get a key.
  // (if absent, the corresponding square is empty)
type SquaresSnapshot = {
  [key in PositionCode]?: PieceCode 
}

interface TrackingSnapshotForSide {
  inCheckFrom: PositionCode[]
  castling: CastlingTracking
}

interface TrackingSnapshot {
  white: TrackingSnapshotForSide
  black: TrackingSnapshotForSide
}

interface BoardSnapshot {
  squares: SquaresSnapshot
  tracking: TrackingSnapshot
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
  type PieceCode,
  type SquaresSnapshot,
  type TrackingSnapshotForSide,
  type TrackingSnapshot
} 