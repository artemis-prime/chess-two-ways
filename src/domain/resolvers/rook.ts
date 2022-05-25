import { Game } from '../Game'
import { 
  MoveType,
  Square
} from '../types'

import { 
  droppingOnOpponent,
  isClearAlongRank,
  isClearAlongFile
} from './util'

const moveType = (
  game: Game,
  from: Square, 
  to: Square, 
): MoveType => {
  
  if (isClearAlongRank(game, from, to) || isClearAlongFile(game, from, to) ) {
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

const canCapture = (
  game: Game,
  from: Square, 
  to: Square, 
): boolean => (
  isClearAlongRank(game, from, to) || isClearAlongFile(game, from, to)
)

export default {
  canCapture,
  moveType
}
