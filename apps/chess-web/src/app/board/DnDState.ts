import { makeObservable, observable, action } from 'mobx'

import type { Piece, Position } from '@artemis-prime/chess-core'

import type DnDPayload from './DnDPayload'

interface DnDStateInternal  {

  piece: Piece | null
  from: Position | null
  squareOver: Position | null
  setPayload: (p: DnDPayload | null) => void 
  setSquareOver: (p: Position | null) => void
  clear: () => void 
}

class DnDStateImpl implements DnDStateInternal {

  static currentInstance: DnDStateImpl | null = null 

  piece: Piece | null = null
  from: Position | null = null
  squareOver: Position | null = null

  constructor() {
    makeObservable(this, {
      piece: observable,
      from : observable,
      setPayload: action,
      clear: action,
    }) 
  }

  setPayload(p: DnDPayload | null): void {
    this.from = p ? p.from : null
    this.piece = p ? p.piece : null
  }

  setSquareOver(p: Position | null): void {
    this.squareOver = p
  }

  clear(): void {
    this.piece = null
    this.from = null
    this.squareOver = null
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



