import type { Action, Board, Square, Console } from '..'

const resolve = (
  board: Board,
  from: Square, 
  to: Square, 
  con?: Console
): Action | null => {
  
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
  return null
}

export default resolve
