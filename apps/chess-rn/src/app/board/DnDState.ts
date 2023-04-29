import { 
  makeObservable, 
  observable, 
  action 
} from 'mobx'

import { 
  type Position, 
  type Piece, 
  type ObsPieceRef
} from '@artemis-prime/chess-core'

import type Point from './Point'

interface DragState extends ObsPieceRef {
  offset: Point | null 
}

  // For use inside the DnD system
interface DnDStateInternal extends DragState {

  piece: Piece | null
  from: Position | null
  squareOver: Position | null

  setPiece: (piece: Piece) => void 
  setFrom: (from: Position) => void 
  setOffset: (pt: Point) => void
  setSquareOver: (p: Position | null) => void

  clear: () => void 
}

class DnDStateImpl implements DnDStateInternal {

  static currentInstance: DnDStateImpl | null = null 

  piece: Piece | null = null
  from: Position | null = null
  offset: Point | null = null
  squareOver: Position | null = null

  constructor() {
    makeObservable(this, {
      piece: observable,
      from: observable,
      offset: observable,
      setPiece: action,
      setFrom: action,
      setOffset: action,
      clear: action,
    }) 
  }

  setPiece(piece: Piece) {
    this.piece = piece
  } 
  setFrom(from: Position) {
    this.from = from
  } 

  setOffset(pt: Point): void {
    this.offset = pt
  }

  setSquareOver(p: Position | null): void {
    this.squareOver = p
  }
  

  clear(): void {
    this.piece = null
    this.from = null
    this.offset = null
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
  type DragState,  
  type DnDStateInternal
}
