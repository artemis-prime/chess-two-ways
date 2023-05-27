import { computedFn } from 'mobx-utils'
import { type Side } from '@artemis-prime/chess-core'

import { type CSS } from '~/style'
import Rows, { type MoveRow } from './Rows'
import { type Pulses } from '~/services'

class Helper {

  private _state: Rows 
  private _pulses: Pulses

  constructor(r: Rows, p: Pulses) {
    this._state = r
    this._pulses = p
  }

  pulsingOpacity = computedFn((enabled: boolean): CSS => (
    (enabled) ? { opacity: this._pulses.slow ? .8 : .7} : {}
  )) 

  pulsingFontSize = computedFn((on: string, off: string, enabled: boolean): CSS => (
    (enabled) ? { fontSize: this._pulses.slow ? on : off} : {}
  )) 

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

  sizingString = computedFn((): string => {
    if (this._state.rows.length < 10) {
      return '7)'
    } 
    else if (this._state.rows.length < 100) {
      return '77)'
    }
    else {
      return '777)'
    }
  })

}

export default Helper
