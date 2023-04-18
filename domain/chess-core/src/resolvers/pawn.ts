import type { 
  Action, 
  Board, 
  Piece, 
  Position, 
  Side, 
  Rank,
  Move, 
} from '..'

import { type ResolvableMove } from '../game/ActionResolver' 
import { FILES  } from '../Position'
import { isOpponent } from '../Piece'

const pawnOnHomeRow = (pos: Position, color: Side): boolean => (
  pos.rank === 2 && color === 'white'
  ||
  pos.rank === 7 && color === 'black'
)

const isMovingOneFileOver = (move: Move) => (
  Math.abs(FILES.indexOf(move.to.file) - FILES.indexOf(move.from.file)) === 1
)

const isGettingPromoted = (to: Position, color: Side): boolean => (
  (color === 'black' && to.rank  === 1) 
  || 
  (color === 'white' && to.rank  === 8)
)

const correctDistanceAndDirection = (
  move: Move,
  distanceToCheck: 1 | 2 = 1
) => {
  const distance = (move.piece.color === 'white') ? distanceToCheck : -distanceToCheck
  return (move.to.rank - move.from.rank) === distance
}

const isCapturing = (
  move: Move,
  toPiece: Piece | null 
): boolean => (

  isOpponent(toPiece, move.piece.color)
  &&
    // moving diagonally
  isMovingOneFileOver(move)
  &&
  correctDistanceAndDirection(move)    
) 

const isInitialTwoRankMove = (
  board: Board, 
  move: Move,
  toPiece: Piece | null
) : boolean => (

  !toPiece
  &&
  (move.from.file === move.to.file) 
  &&
  pawnOnHomeRow(move.from, move.piece.color)
  && 
  correctDistanceAndDirection(move, 2)    
  &&
  !board.pieceAt({
    file: move.from.file,
    rank: ((move.piece.color === 'white') ? move.from.rank + 1 : move.from.rank - 1) as Rank
  })
) 

const isOneRankMove = (
  move: Move,
  toPiece: Piece | null
) => (
  !toPiece
  &&
  (move.from.file === move.to.file) 
  &&
  correctDistanceAndDirection(move)    
)

const resolve = (
  board: Board, 
  move: Move,
  messageFn?: (s: String) => void
): Action | null => {
  
  const toPiece = board.pieceAt(move.to)

  if (isOneRankMove(move, toPiece)) {
    return isGettingPromoted(move.to, move.piece.color) ? 'promote' : 'move'
  }
  else if (isInitialTwoRankMove(board, move, toPiece)) {
    return 'move'
  }
  else if (isCapturing(move, toPiece)) {
    return isGettingPromoted(move.to, move.piece.color) ? 'capturePromote' : 'capture'
  }
  return null
}

const resolvableMoves = (
  board: Board,
  piece: Piece,
  from: Position,
  ignoreCastling?: boolean // only relevant for king
): ResolvableMove[] => {
  
  const resolvable = [] as ResolvableMove[]

  const onFileAtEdge = (direction: 'E' | 'W'): boolean => (
    from.file === (direction === 'E' ? 'a' : 'h')
  )

  const attackableSquares = (): Position[] => {
    const result = [] as Position[] 
      // No need to check edge since that would force a promotion and 
      // this pawn's code would never get called.
    const forwardRank = from.rank + ((piece.color === 'white') ? 1 : -1) as Rank
    if (!onFileAtEdge('E')) {
      result.push({file: FILES[FILES.indexOf(from.file) - 1], rank: forwardRank})
    }
    if (!onFileAtEdge('W')) {
      result.push({file: FILES[FILES.indexOf(from.file) + 1], rank: forwardRank})
    }
    return result
  }

  const squareInFront = {
    file: from.file,
    rank: from.rank + ((piece.color === 'white') ? 1 : -1) as Rank
  }

  if (!board.pieceAt(squareInFront)) {
    resolvable.push({
      move: {
        piece,
        from,
        to: squareInFront
      },
      action: isGettingPromoted(squareInFront, piece.color) ? 'promote' : 'move'
    })
    if (pawnOnHomeRow(from, piece.color)) {
      const squareTwoInFront = {
        file: from.file,
        rank: from.rank + ((piece.color === 'white') ? 2 : -2) as Rank
      }
      if (!board.pieceAt(squareTwoInFront)) {
        resolvable.push({
          move: {
            piece,
            from,
            to: squareTwoInFront
          },
          action: 'move'
        })
      }
    }
  }
  attackableSquares().forEach((pos) => {
    if (isOpponent(board.pieceAt(pos), piece.color)) {
      resolvable.push({
        move: {
          piece,
          from,
          to: pos
        },
        action:  isGettingPromoted(squareInFront, piece.color) ? 'capturePromote' : 'capture'
      })
    }
  })
  return resolvable
}

export default {resolve, resolvableMoves}
