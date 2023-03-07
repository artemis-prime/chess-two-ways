import Game from '../Game'
import { 
  Action,
  Square,
  FILES,
  Color
} from '..'

import { isClearAlongRank } from '../util'

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

const amCastling = (
  game: Game, 
  from: Square, 
  to: Square
): boolean => {

  // No need to test the position of 'from', since the this._canCastle flag 
  // indicates a move has taken place, same w position of participating rook
  const color = game.colorAt(from) as Color
  const homeRank = (color === 'white') ? 1 : 8
  const kingside = (to.file === 'g')
  const queenside = (to.file === 'c')


  return (
    (from.rank === to.rank) && (from.rank === homeRank) && (kingside || queenside)
    &&
    !game.kingOrRookHasMoved(color, kingside)
    && 
    isClearAlongRank(game, from, {rank: homeRank, file: (kingside ? 'h' : 'b')})
    && 
    !game.canBeCapturedAlongRank(from, {rank: homeRank, file: (kingside ? 'h' : 'b')})
  ) 
}

const resolve = (
  game: Game,
  from: Square, 
  to: Square, 
): Action | undefined => {
  
  const fromColor = game.colorAt(from)
  if (legalMove(game, from, to)) {
    const toColor = game.colorAt(to)
    if (!toColor) {
      return 'move'
    }
    else if (fromColor && toColor && (fromColor !== toColor)) {
      return 'capture'
    }
  }
  else if (amCastling(game, from, to)) {
    return 'castle'
  }
  return undefined 
}

export default resolve
