import { Game } from './Game'

import Square from './Square'

import { Rank, FILES } from './RankAndFile'

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



export {
  isClearAlongRank, 
  isClearAlongFile,
  isClearAlongDiagonal
}