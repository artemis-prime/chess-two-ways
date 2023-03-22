import type { PieceType } from '../Piece'
import type Square from '../Square'
import type Board from '../board/Board'

interface CanCaptureFunction {
  (board: Board, type: PieceType, from: Square, to: Square): boolean
}

export { type CanCaptureFunction as default }