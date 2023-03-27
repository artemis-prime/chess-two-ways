import type { Action, Board, Position } from '..'

import { FILES } from '..'

const pawnOnHomeRow = (board: Board, pos: Position): boolean => {
  const color = board.colorAt(pos)
  return (
    pos.rank === 2 && color === 'white'
    ||
    pos.rank === 7 && color === 'black'
  )
}

const isCapturing = (
  board: Board, 
  from: Position,  
  to: Position 
): boolean => {
  const fromPiece = board.pieceAt(from)
  const toPiece = board.pieceAt(to)
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
  board: Board, 
  from: Position,  
  to: Position,
  messageFn?: (s: String) => void
): Action | null => {
  
  const fromPiece = board.pieceAt(from)
  const toPiece = board.pieceAt(to)

  // initial two row advance?
  if (
    !toPiece
    &&
    pawnOnHomeRow(board, from)
    &&
    (from.file === to.file) 
    && 
    Math.abs(to.rank - from.rank) === 2
  ) {
    return 'move'
  }

  const isGettingPromoted = 
    (fromPiece!.color === 'black' && to.rank  === 1) 
    || 
    (fromPiece!.color === 'white' && to.rank  === 8)

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

  if (isCapturing(board, from, to)) {
    if (isGettingPromoted) {
      return 'capture-promote'  
    }
    return 'capture'
  }

  return null
}

export default resolve
