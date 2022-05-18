import { Game } from '../Game'
import { 
  MoveType,
  Square
} from '../types'

import { 
  droppingOnOpponent,
  isClearAlongRank, 
  isClearAlongFile,
  isClearAlongDiagonal
} from './util'



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
