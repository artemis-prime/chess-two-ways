import type Board from '../board/Board'
import type { Action, Square } from '..'

import { FILES } from '..'

const legalMove = (
  from: Square, 
  to: Square, 
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
  from: Square, 
  to: Square, 
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
