import type Game from './Game'
import type Square from './Square'
import type { Side } from './Piece'

import type { Rank } from './RankAndFile'
import { FILES, RANKS } from './RankAndFile'

const castleIsKingside = (to: Square): boolean => (to.file === 'g')

const isClearAlongRank = (
  game: Game,
  from: Square, 
  to: Square, 
): boolean => {
  if (from.rank === to.rank) {
    const delta = FILES.indexOf(to.file) - FILES.indexOf(from.file)
    if (delta < 0) {
        // zero based!
      for (let fileIndex = FILES.indexOf(from.file) - 1; fileIndex > FILES.indexOf(to.file); fileIndex--) {
        if (!!game.pieceAt({
          rank: to.rank, 
          file: FILES[fileIndex]
        })) {
          return false
        }
      }
    }
    else {
        // zero based!
      for (let fileIndex = FILES.indexOf(from.file) + 1; fileIndex < FILES.indexOf(to.file); fileIndex++) {
        if (!!game.pieceAt({
          rank: to.rank, 
          file: FILES[fileIndex]
        })) {
          return false
        }
      }
    }
    return true
  }
  return false
}

const isClearAlongFile = (
  game: Game,
  from: Square, 
  to: Square, 
): boolean => {
  if (FILES.indexOf(from.file) === FILES.indexOf(to.file)) {
    const delta = to.rank - from.rank
    if (delta < 0) {
        // one-based
      for (let rank = from.rank - 1; rank > to.rank; rank--) {
        if (!!game.pieceAt({
          rank: rank as Rank, 
          file: from.file
        })) {
          return false
        }
      }
    }
    else {
        // one-based
      for (let rank = from.rank + 1; rank < to.rank; rank++) {
        if (!!game.pieceAt({
          rank: rank as Rank, 
          file: from.file
        })) {
          return false
        }
      }
    }
    return true
  }
  return false
}

const isClearAlongDiagonal = (
  game: Game,
  from: Square, 
  to: Square, 
): boolean => {

  const deltaRank = to.rank - from.rank
  const deltaFile = FILES.indexOf(to.file) - FILES.indexOf(from.file)

  if (Math.abs(deltaRank) !== Math.abs(deltaFile)) {
    return false
  }

    // --> NE
  if (deltaFile > 0 && deltaRank > 0 ) {
    for (let rank = from.rank + 1, fileIndex = FILES.indexOf(from.file) + 1; rank < to.rank && fileIndex < FILES.indexOf(to.file); rank++, fileIndex++) {
      if (!!game.pieceAt({
        rank: rank as Rank, 
        file: FILES[fileIndex] // zero-based
      })) {
        return false
      }
    }
  }
    // --> SE
  else if (deltaFile > 0 && deltaRank < 0) {
    for (let rank = from.rank - 1, fileIndex = FILES.indexOf(from.file) + 1; rank > to.rank && fileIndex < FILES.indexOf(to.file); rank--, fileIndex++) {
      if (!!game.pieceAt({
        rank: rank as Rank, 
        file: FILES[fileIndex] // zero-based
      })) {
        return false
      }
    }
  }
    // --> SW
  else if (deltaFile < 0 && deltaRank < 0) {
    for (let rank = from.rank - 1, fileIndex = FILES.indexOf(from.file) - 1; rank > to.rank && fileIndex > FILES.indexOf(to.file);  rank--, fileIndex--) {
      if (!!game.pieceAt({
        rank: rank as Rank, 
        file: FILES[fileIndex] // zero-based
      })) {
        return false
      }
    }
  }
    // --> NW
    else if (deltaFile < 0 && deltaRank > 0) {
      for (let rank = from.rank + 1, fileIndex = FILES.indexOf(from.file) - 1; rank < to.rank && fileIndex > FILES.indexOf(to.file); rank++, fileIndex--) {
        if (!!game.pieceAt({
          rank: rank as Rank, 
          file: FILES[fileIndex] // zero-based
        })) {
          return false
        }
      }
    }
      
  return true
}

  // If a piece from sideToCapture moved to squareToCapture,
  // what Squares could it be captured from?
  // Useful for checking the ability to castle (can't castle into or through check),
  // or to test for check. 
const canBeCapturedFrom = (
  game: Game, 
  squareToCapture: Square, 
  sideToCapture: Side
): Square[] => {
  const result: Square[] = []
  for (const rank of RANKS) {
    for (const file of FILES) {
      const captureFrom = {rank, file}
      const color = game.colorAt({rank, file})
      if (color && color !== sideToCapture && game.resolveAction(captureFrom, squareToCapture) === 'capture') {
        result.push(captureFrom)
      }
    }
  }
  return result
}

const canBeCaptured = (game: Game, squareToCapture: Square, sideToCapture: Side): boolean  => {
  return canBeCapturedFrom(game, squareToCapture, sideToCapture).length > 0
}

  // from must be populated
const canBeCapturedAlongRank = (game: Game, from: Square, to: Square): boolean => {
  const fromColor = game.colorAt(from)
  if (!fromColor) {
    throw new Error('From must contain a piece!')
  }
  if (from.rank === to.rank) {
    const delta = FILES.indexOf(to.file) - FILES.indexOf(from.file)
    if (delta < 0) {
        // zero based, but ok since indexed from FILES
      for (let fileIndex = FILES.indexOf(from.file) - 1; fileIndex > FILES.indexOf(to.file); fileIndex--) {
        if (canBeCaptured(game, {rank: from.rank, file: FILES[fileIndex] }, fromColor!)) {
          return true
        }
      }
    }
    else {
        // zero based, but ok since indexed from FILES
      for (let fileIndex = FILES.indexOf(from.file) + 1; fileIndex < FILES.indexOf(to.file); fileIndex++) {
        if (canBeCaptured(game, {rank: from.rank, file: FILES[fileIndex] }, fromColor!)) {
          return true
        }
      }
    }
  }
  return false
}

export {
  castleIsKingside,
  isClearAlongRank, 
  isClearAlongFile,
  isClearAlongDiagonal,
  canBeCapturedFrom,
  canBeCaptured,
  canBeCapturedAlongRank
}