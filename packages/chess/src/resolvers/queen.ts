import type { Action, Board, Square, Console } from '..'

const legalMove = (
  board: Board,
  from: Square, 
  to: Square, 
): boolean => {
  
  return (
    board.isClearAlongRank(from, to)
    ||
    board.isClearAlongFile(from, to)
    ||
    board.isClearAlongDiagonal(from, to)
  ) 
}

const resolve = (
  board: Board,
  from: Square, 
  to: Square, 
  con?: Console
): Action | null => {
  
  if (legalMove(board, from, to)) {
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
