import { makeObservable, observable, action, computed } from 'mobx'

import type { Action, Position, Resolution } from '@artemis-prime/chess-core'

import type DnDPayload from './DnDPayload'

  // For use by UI code to reflect state
interface DnDState {
  get resolvedDrag(): Resolution | null 
}

  // For use inside the DnD system
interface DnDStateInternal extends DnDState {
  payload: DnDPayload | null, 
  squareOver: Position | null
  resolvedAction: Action | null
  setPayload: (p: DnDPayload | null) => void 
  setSquareOver: (p: Position | null) => void
  setResolvedAction: (a: Action | null) => void
  clear: () => void 
}

class DnDStateImpl implements DnDStateInternal {

  static currentInstance: DnDStateImpl | null = null 

  payload: DnDPayload | null = null
  squareOver: Position | null = null
  resolvedAction: Action | null = null

  constructor() {
    makeObservable(this, {
      payload: observable,
      squareOver: observable,
      resolvedAction: observable,
      setPayload: action,
      clearPayload: action,
      setSquareOver: action,
      setResolvedAction: action,
      clear: action,
      resolvedDrag: computed
    }) 
  }

  setPayload(p: DnDPayload | null): void {
    this.payload = p
  }

  clearPayload(): void {this.payload = null}

  setSquareOver(p: Position | null): void {
    this.squareOver = p
  }
  
  setResolvedAction(a: Action | null) {
    this.resolvedAction = a
  }

  clear(): void {
    this.payload = null
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


