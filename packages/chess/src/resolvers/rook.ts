import type Board from '../board/Board'
import type { Action, Square } from '..'


const resolve = (
  board: Board,
  from: Square, 
  to: Square, 
): Action | undefined => {
  
  if (board.isClearAlongRank(from, to) || board.isClearAlongFile(from, to) ) {
    const fromColor = board.colorAt(from)
    const toColor = board.colorAt(to)
    if (!toColor) {
      return 'move'
    }
    else if (fromColor && toColor && (fromColor !== toColor)) {
      return 'capture'
    }
  }
  return undefined
}

export default resolve
