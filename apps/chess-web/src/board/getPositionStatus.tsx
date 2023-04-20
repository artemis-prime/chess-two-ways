import { useMemo } from 'react'

import { 
  type PositionStatus, 
  getMoveActionStatus, 
  getCheckStatus,
  type Resolution,
  type Check,
  type Position 
} from '@artemis-prime/chess-core'

const getMemoizedMoveActionStatus = (
  p: Position,
  res: Resolution | null
): PositionStatus => {

  return useMemo(() => {
    return getMoveActionStatus(p, res)
  }, [
    p.file, 
    p.rank, 
    res?.action, 
    res?.move?.from.file,
    res?.move?.from.rank,
    res?.move?.to.file,
    res?.move?.to.rank,
    res?.move?.piece.type,
    res?.move?.piece.color,
  ])
}

const getMemoizedCheckStatus = (
  p: Position,
  c: Check | null
): PositionStatus => {

  return useMemo(() => {
    return getCheckStatus(p, c)
  }, [
    p.file, 
    p.rank, 
    c?.side, 
    c?.from,
    c?.kingPosition,
  ])
}

export { getMemoizedMoveActionStatus, getMemoizedCheckStatus}