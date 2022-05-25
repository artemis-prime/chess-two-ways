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
    Math.abs(deltaRank) === 1 && Math.abs(deltaFile) === 1
    ||
    Math.abs(deltaFile) === 1 && Math.abs(deltaRank) === 0
    ||
    Math.abs(deltaFile) === 0 && Math.abs(deltaRank) === 1
  ) 
}


const moveType = (
  game: Game,
  from: Square, 
  to: Square, 
): MoveType => {
  
  const fromPiece = game.pieceAt(from)
  const player = fromPiece!.color
  if (legalMove(game, from, to)) {
    const toPiece = game.pieceAt(to)
    if (droppingOnOpponent(fromPiece!, toPiece)) {
      return 'capture'
    }
    else if (!toPiece) {
      return 'move'
    }
  }
  if (player === 'white') {
    if (game.canCastle(from, true) && to.rank === 1 && to.file === 'g') {
      return 'castle'
    }
    else if (game.canCastle(from, false) && to.rank === 1 && to.file === 'c') {
      return 'castle'
    }
  }
  else {
    if (game.canCastle(from, true) && to.rank === 8 && to.file === 'g') {
      return 'castle'
    }
    else if (game.canCastle(from, false) && to.rank === 8 && to.file === 'c') {
      return 'castle'
    }
  }

  return 'invalid'
}

export default {
  canCapture: legalMove,
  moveType
}
