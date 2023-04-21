import type Position from '../Position'
import { positionsEqual } from '../Position'
import type PositionState from '../PositionState'
import type Resolution from '../Resolution'
import type Check from '../Check'

// Convienence for game implementations / ui's.
const getResolutionStateForPosition = (
  p: Position,
  res: Resolution | null
): PositionState => {

  if (res && positionsEqual(res.move.from, p)) {
    return 'origin'
  }
  if (res) {
    if (positionsEqual(res.move.to, p)) {
      if (res.action) {
        return res.action
      }
      else {
        return 'invalid'
      }
    }
    else if (res.action === 'castle') {
      const { move: { from, to }} = res
      if (to.file === 'g') {
        if (positionsEqual(p, {rank: from.rank, file: 'h'})) {
          return 'castleRookFrom'
        }
        else if (positionsEqual(p, {rank: from.rank, file: 'f'})) {
          return 'castleRookTo'
        }
      }
      else if (to.file === 'c') {
        if (positionsEqual(p, {rank: from.rank, file: 'a'})) {
          return 'castleRookFrom'
        }
        else if (positionsEqual(p, {rank: from.rank, file: 'd'})) {
          return 'castleRookTo'
        }
      }
    }
  }
  return 'none'
}


const getCheckStateForPosition = (
  p: Position,
  check: Check | null
): PositionState => {
  if (check) {
    if (positionsEqual(check.kingPosition, p)) {
      return 'kingInCheck'
    }
    else if (check.from.find((from) => (positionsEqual(p, from)))) {
      return 'inCheckFrom'
    }
  }
  return 'none'
}

export { getResolutionStateForPosition, getCheckStateForPosition }