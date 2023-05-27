import { computedFn } from 'mobx-utils'
import { type Side } from '@artemis-prime/chess-core'

import { type CSS } from '~/style'
import { type MoveRow, type HilightState } from './Rows'

class HilightHelper {

  private _state: HilightState

  constructor(h: HilightState) {
    this._state = h
  }

  sideHilight = computedFn((moveRow: number, side: Side): CSS => {

    if (this._state.hilightedMoveRow !== null) {
      if (this._state.hilightedMoveRow === moveRow && this._state.hilightedSide === side) {
        return {
          p: '0.15em',
          border: '0.1em dashed $alert8',
          borderRadius: '3px'
        }
      }
    }
    return {p: '0.25em'}
  })

  sideColor = computedFn((r: MoveRow, index: number, side: Side): CSS => {

    if (this.disableSide(index, side)) {
      return { color: '$chalkboardTextColorDisabled'}
    }
    const half = r[side]
    return { color: half ? 
      ((half.rec.annotatedResult || half.rec.action.includes('capture')) ? '$alert8' : '$chalkboardTextColor')  
      : 
      '$chalkboardTextColor'
    }
  })

  disableSide = computedFn((moveRow: number, side: Side): boolean => {

    if (this._state.hilightedMoveRow !== null) {
      if (moveRow > this._state.hilightedMoveRow) {
        return true
      }
      else if (moveRow === this._state.hilightedMoveRow) {
        if (side === 'black' && this._state.hilightedSide === 'white') {
          return true 
        }
      }
    }
    return false
  })

  disableRow = computedFn((moveRow: number): boolean => {

    if (this._state.hilightedMoveRow !== null) {
      if (moveRow > this._state.hilightedMoveRow) {
        return true
      }
    }
    return false
  })
}

export default HilightHelper
