import type { 
  Action,
  Board,
  Color,
  Side,
  Square,
  Console,
} from '..'

import { FILES } from '..'

  // from must be populated
const canBeCapturedAlongRank = (board: Board, from: Square, to: Square, asSide: Side): boolean => {
  if (from.rank === to.rank) {
    const delta = FILES.indexOf(to.file) - FILES.indexOf(from.file)
    if (delta < 0) {
        // zero based, but ok since indexed from FILES
      for (let fileIndex = FILES.indexOf(from.file) - 1; fileIndex > FILES.indexOf(to.file); fileIndex--) {
        if (board.squareCanBeCaptured({rank: from.rank, file: FILES[fileIndex]}, asSide)) {
          return true
        }
      }
    }
    else {
        // zero based, but ok since indexed from FILES
      for (let fileIndex = FILES.indexOf(from.file) + 1; fileIndex < FILES.indexOf(to.file); fileIndex++) {
        if (board.squareCanBeCaptured({rank: from.rank, file: FILES[fileIndex]}, asSide)) {
          return true
        }
      }
    }
  }
  return false
}

const legalMove = (
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
  board: Board, 
  from: Square, 
  to: Square,
  con?: Console
): boolean => {

  // No need to test the position of 'from', since the this._canCastle flag 
  // indicates a move has taken place, same w position of participating rook
  const color = board.colorAt(from) as Color
  const homeRank = (color === 'white') ? 1 : 8
  const kingside = (to.file === 'g')
  const queenside = (to.file === 'c')

  const correctSquares = (from.rank === to.rank) && (from.rank === homeRank) && (kingside || queenside)
  let eligable = false
  if (correctSquares) {
    const reasonDenied = [] as string[]
    eligable = board.eligableToCastle(color, kingside, reasonDenied)
    if (!eligable && con) {
      con.writeln(reasonDenied[0])
    }
  }

  return (
    eligable
    && 
    board.isClearAlongRank(from, {rank: homeRank, file: (kingside ? 'h' : 'b')})
    &&  
      // Cannot castle THROUGH check either!
    !canBeCapturedAlongRank(board, from, {rank: homeRank, file: (kingside ? 'h' : 'b')}, color)
  ) 
}

const resolve = (
  board: Board,
  from: Square, 
  to: Square, 
  con?: Console
): Action | null => {
  
  if (legalMove(from, to)) {
    const fromColor = board.colorAt(from)
    const toColor = board.colorAt(to)
    if (!toColor) {
      return 'move'
    }
    else if (fromColor && toColor && (fromColor !== toColor)) {
      return 'capture'
    }
  }
  else if (amCastling(board, from, to, con)) {
    return 'castle'
  }
  return null 
}

export default resolve
