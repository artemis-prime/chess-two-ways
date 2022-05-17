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

export default (
  game: Game,
  from: Square, 
  to: Square, 
): MoveType => {
  
  const fromPiece = game.pieceAt(from)
  const toPiece = game.pieceAt(to)

  if (
    droppingOnOpponent(fromPiece!, toPiece)
    &&
    (isClearAlongRank(game, from, to)
    ||
    isClearAlongFile(game, from, to)
    ||
    isClearAlongDiagonal(game, from, to))
  ) {
    return 'capture'
  }
  else if (
    !toPiece 
    && 
    (isClearAlongRank(game, from, to)
    ||
    isClearAlongFile(game, from, to)
    ||
    isClearAlongDiagonal(game, from, to))
  ) {
    return 'move'
  }
  return 'invalid'
}
