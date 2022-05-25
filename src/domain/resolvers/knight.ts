import { Game } from '../Game'
import { 
  MoveType,
  Square,
  FILES
} from '../types'

import { 
  droppingOnOpponent
} from './util'


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

 const moveType = (
  game: Game,
  from: Square, 
  to: Square, 
): MoveType => {
  
  if (legalMove(game, from, to)) {

    const fromPiece = game.pieceAt(from)
    const toPiece = game.pieceAt(to)
    if (droppingOnOpponent(fromPiece!, toPiece)) {
      return 'capture'
    }
    else if (!toPiece) {
      return 'move'
    }
  }

  return 'invalid'
}

export default {
  canCapture: legalMove,
  moveType
}
