import type Game from '../Game'
import type { Action, Square } from '..'

import { FILES } from '..'

const pawnOnHomeRow = (game: Game, sq: Square): boolean => {
  const color = game.colorAt(sq)
  return (
    sq.rank === 2 && color === 'white'
    ||
    sq.rank === 7 && color === 'black'
  )
}

const isCapturing = (
  game: Game, 
  from: Square,  
  to: Square 
): boolean => {
  const fromPiece = game.pieceAt(from)
  const toPiece = game.pieceAt(to)
  return (
    !!toPiece && toPiece!.color !== fromPiece!.color
    &&
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

  const isGettingPromoted = (fromPiece!.color === 'black' && to.rank  === 1) || (fromPiece!.color === 'white' && to.rank  === 8)

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
    if (isGettingPromoted) {
      return 'promote'
    }
    return 'move'
  }

  if (isCapturing(game, from, to)) {
    if (isGettingPromoted) {
      return 'capture-promote'  
    }
    return 'capture'
  }

  return undefined
}

export default resolve
