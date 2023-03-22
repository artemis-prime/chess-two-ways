import type BoardSquare from '../BoardSquare'
import type Square from '../Square'
import type Board from '../board/Board'

interface CanCaptureFunction {
  (board: Board, from: BoardSquare, to: Square): boolean
}

export { type CanCaptureFunction as default }