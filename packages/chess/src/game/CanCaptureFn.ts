import type { PieceType } from '../Piece'
import type Position from '../Position'
import type Board from '../Board'

interface CanCaptureFn {
  (board: Board, type: PieceType, from: Position, to: Position): boolean
}

export { type CanCaptureFn as default }