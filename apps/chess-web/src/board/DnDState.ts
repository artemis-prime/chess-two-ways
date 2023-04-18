import { makeObservable, observable, action } from 'mobx'

import type { Action, Position } from '../core'

import type DnDPayload from './DnDPayload'

  // For use by UI code to reflect state
interface DnDState {
  payload: DnDPayload | null, 
  squareOver: Position | null
  resolvedAction: Action | null
}

  // For use inside the DnD system
interface DnDStateInternal extends DnDState {
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



