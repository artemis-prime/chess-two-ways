import { Game } from '../Game'
import { 
  MoveType,
  Square,
  FILES
} from '../types'

import { 
  droppingOnOpponent
} from './util'

export default (
  game: Game,
  from: Square, 
  to: Square, 
): MoveType => {
  
  const deltaRank = to.rank - from.rank
  const deltaFile = FILES.indexOf(to.file) - FILES.indexOf(from.file)

  if (Math.abs(deltaRank) === 1 && Math.abs(deltaFile) === 1
    ||
    Math.abs(deltaFile) === 1 && Math.abs(deltaRank) === 0
    ||
    Math.abs(deltaFile) === 0 && Math.abs(deltaRank) === 1
  ) {
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
