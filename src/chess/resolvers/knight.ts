import Game from '../Game'
import { 
  Action,
  Square,
  FILES
} from '..'

const legalMove = (
  game: Game,
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
  game: Game,
  from: Square, 
  to: Square, 
): Action | undefined=> {
  
  const fromColor = game.colorAt(from)
  if (legalMove(game, from, to)) {
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
