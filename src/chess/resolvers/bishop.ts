import { Game } from '../Game'
import { 
  Action,
  Square
} from '..'

import { isClearAlongDiagonal } from '../util'


const resolve = (
  game: Game,
  from: Square, 
  to: Square, 
): Action | undefined => {
  
  if (isClearAlongDiagonal(game, from, to)) {
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
