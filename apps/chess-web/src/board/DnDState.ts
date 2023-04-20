import { makeObservable, observable, action, computed } from 'mobx'

import type { 
  Position, 
  ObsPieceRef, 
  Piece
} from '@artemis-prime/chess-core'

import type DnDPayload from './DnDPayload'

interface DnDStateInternal extends ObsPieceRef {
  payload: DnDPayload | null, 
  squareOver: Position | null
  setPayload: (p: DnDPayload | null) => void 
  setSquareOver: (p: Position | null) => void
  clear: () => void 
}
class DnDStateImpl implements DnDStateInternal {

  static currentInstance: DnDStateImpl | null = null 

  payload: DnDPayload | null = null
  squareOver: Position | null = null

  constructor() {
    makeObservable(this, {
      payload: observable,
      setPayload: action,
      clear: action,
      pieceValue: computed
    }) 
  }

  setPayload(p: DnDPayload | null): void {
    this.payload = p
  }

  clearPayload(): void {this.payload = null}

  setSquareOver(p: Position | null): void {
    this.squareOver = p
  }

  clear(): void {
    this.payload = null
    this.squareOver = null
  }

  get pieceValue(): Piece | null {
    return (this.payload) 
      ?
      this.payload.piece 
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
  type DnDStateInternal
}



