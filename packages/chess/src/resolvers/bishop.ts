import type Board from '../board/Board'
import type { Action, Square } from '..'

const resolve = (
  board: Board,
  from: Square, 
  to: Square, 
): Action | null => {
  
  if (board.isClearAlongDiagonal(from, to)) {
    const fromColor = board.colorAt(from)
    const toColor = board.colorAt(to)
    if (!toColor) {
      return 'move'
    }
    else if (fromColor && toColor && (fromColor !== toColor)) {
      return 'capture'
    }
  }
  return null
}


export default resolve
