import type Game from '~c/Game'
import type { Action, Square } from '~c'

import { FILES } from '~c/RankAndFile'

const pawnOnHomeRow = (game: Game, sq: Square): boolean => {
  const piece = game.pieceAt(sq)
  return (
    sq.rank === 2 && !!piece && piece.type === 'pawn' && piece.color === 'white'
    ||
    sq.rank === 7 && !!piece && piece.type === 'pawn' && piece.color === 'black'
  )
}

const canCapture = (
  game: Game, 
  from: Square,  
  to: Square 
): boolean => {
  const fromPiece = game.pieceAt(from)
  return (
    // moving diagonally
    Math.abs(FILES.indexOf(to.file) - FILES.indexOf(from.file)) === 1
    &&
      // correct vector
    (
      fromPiece!.color === 'black' && (to.rank - from.rank === -1)
      ||
      fromPiece!.color === 'white' && (to.rank - from.rank === 1)
    )
  ) 
}

const resolve = (
  game: Game, 
  from: Square,  
  to: Square 
): Action | undefined => {
  
  const fromPiece = game.pieceAt(from)
  const toPiece = game.pieceAt(to)

  // initial two row advance?
  if (
    !toPiece
    &&
    pawnOnHomeRow(game, from)
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
      return 'promote'
    }
    return 'move'
  }

    // regular capture? 
  if (canCapture(game, from, to)) {
    if ((fromPiece!.color === 'black' && to.rank  === 1) || (fromPiece!.color === 'white' && to.rank  === 8)) {
      return 'promote'
    }
    return 'capture'
  }

  return undefined
}

export default resolve
