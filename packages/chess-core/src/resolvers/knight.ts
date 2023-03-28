import type { Action, Board, Position } from '..'

import { FILES } from '..'

const legalMove = (
  from: Position, 
  to: Position, 
): boolean => {

  const deltaRank = to.rank - from.rank
  const deltaFile = FILES.indexOf(to.file) - FILES.indexOf(from.file)
  return (
    Math.abs(deltaRank) === 2 && Math.abs(deltaFile) === 1    
    ||
    Math.abs(deltaFile) === 2 && Math.abs(deltaRank) === 1
  ) 
 }

 const resolve = (
  board: Board,
  from: Position, 
  to: Position, 
  messageFn?: (s: String) => void
): Action | null => {
  
  const fromColor = board.colorAt(from)
  if (legalMove(from, to)) {
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
