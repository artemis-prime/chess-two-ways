import type Game from '../Game'
import type { Action, Square } from '..'

import { 
  isClearAlongRank, 
  isClearAlongFile,
  isClearAlongDiagonal
} from '../util'

const legalMove = (
  game: Game,
  from: Square, 
  to: Square, 
): boolean => {
  
  return (
    isClearAlongRank(game, from, to)
    ||
    isClearAlongFile(game, from, to)
    ||
    isClearAlongDiagonal(game, from, to)
  ) 
}

const resolve = (
  game: Game,
  from: Square, 
  to: Square, 
): Action | undefined => {
  
  if (legalMove(game, from, to)) {
    const fromColor = game.colorAt(from)
    const toColor = game.colorAt(to)
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
