import { makeObservable, observable, action, computed } from 'mobx'

import { 
  type Action, 
  type Position, 
  type Piece, 
  type Resolution
} from '@artemis-prime/chess-core'

import DnDPayload from './DnDPayload'
import Point from './Point'

  // For use by UI code to reflect state
interface DnDState {
  offset: Point | null 
  get resolvedDrag(): Resolution | null 
}

  // For use inside the DnD system
interface DnDStateInternal extends DnDState {
  payload: DnDPayload | null, 
  squareOver: Position | null
  resolvedAction: Action | null
  setPayload: (piece: Piece, from: Position) => void 
  clearPayload: () => void
  setOffset: (pt: Point) => void
  setSquareOver: (p: Position | null) => void
  setResolvedAction: (a: Action | null) => void
  clear: () => void 
}

class DnDStateImpl implements DnDStateInternal {

  static currentInstance: DnDStateImpl | null = null 

  payload: DnDPayload | null = null
  offset: Point | null = null
  squareOver: Position | null = null
  resolvedAction: Action | null = null

  constructor() {
    makeObservable(this, {
      payload: observable,
      offset: observable,
      squareOver: observable,
      resolvedAction: observable,
      setPayload: action,
      clearPayload: action,
      setOffset: action,
      setSquareOver: action,
      setResolvedAction: action,
      clear: action,
      resolvedDrag: computed
    }) 
  }

  setPayload(piece: Piece, from: Position): void {
    this.payload = {
      piece, 
      from 
    }
  }

  clearPayload(): void {this.payload = null}

  setOffset(pt: Point): void {
    this.offset = pt
  }

  setSquareOver(p: Position | null): void {
    this.squareOver = p
  }
  
  setResolvedAction(a: Action | null) {
    this.resolvedAction = a
  }

  clear(): void {
    this.payload = null
    this.offset = null
    this.squareOver = null
    this.resolvedAction = null
  }

  get resolvedDrag(): Resolution | null {
    return (this.payload && this.squareOver) 
      ? 
      {
        move: {
          ...this.payload,
          to: this.squareOver
        },
        action: this.resolvedAction 
      } 
      : 
      null
  }
}

const getDnDStateSingleton = (): DnDStateInternal => {
  if (!DnDStateImpl.currentInstance) {
    DnDStateImpl.currentInstance = new DnDStateImpl() 
  }
  return DnDStateImpl.currentInstance as DnDStateInternal
}

export {
  getDnDStateSingleton,
  type DnDState,  
  type DnDStateInternal
}
