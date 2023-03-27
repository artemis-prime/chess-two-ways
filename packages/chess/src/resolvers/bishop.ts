import type { Action, Board, Position } from '..'

const resolve = (
  board: Board,
  from: Position, 
  to: Position, 
  messageFn?: (s: String) => void
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
