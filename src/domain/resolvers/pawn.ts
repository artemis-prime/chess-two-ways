import { Game } from '../Game'
import { 
  MoveType,
  Square,
  FILES
} from '../types'

import { pawnOnHomeRow, droppingOnOpponent } from './util'

export default (
  game: Game, 
  from: Square,  
  to: Square 
): MoveType => {
  
  const fromPiece = game.pieceAt(from)
  const toPiece = game.pieceAt(to)

  // initial two row advance?
  if (
    !toPiece
    &&
    pawnOnHomeRow(from)
    &&
    (from.file === to.file) 
    && 
    Math.abs(to.rank - from.rank) === 2
  ) {
    return 'move'
  }

  // regular advance? 
  if (
    !toPiece
    &&
    (from.file === to.file) 
    && 
      // ensure correct direction
    (
      (fromPiece!.color === 'black' && (to.rank - from.rank === -1))
      ||
      (fromPiece!.color === 'white' && (to.rank - from.rank === 1))
    )
  ) {
    if ((fromPiece!.color === 'black' && to.rank === 1) || (fromPiece!.color === 'white' && to.rank === 8)) {
      return 'convert'
    }
    return 'move'
  }

  // regular take? 
  if (
    droppingOnOpponent(fromPiece!, toPiece)
    &&
      // moving diagonally
    Math.abs(FILES.indexOf(to.file) - FILES.indexOf(from.file)) === 1
    &&
    (
      fromPiece!.color === 'black' && (to.rank - from.rank === -1)
      ||
      fromPiece!.color === 'white' && (to.rank - from.rank === 1)
    )
  ) {
    if ((fromPiece!.color === 'black' && to.rank  === 1) || (fromPiece!.color === 'white' && to.rank  === 8)) {
      return 'convert'
    }
    return 'capture'
  }

  return 'invalid'
}
