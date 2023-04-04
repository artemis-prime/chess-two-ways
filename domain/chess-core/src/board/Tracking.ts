import { makeObservable, observable } from 'mobx'
import type { PrimaryPieceType, Side } from '../Piece'
import type Position from '../Position'

class Tracking_Side {

  king: Position
  primaries = new Map<PrimaryPieceType, Position[]>()
  inCheckFrom: Position[] = []
  castling = {
    hasCastled: false,
    kingHasMoved: false,
    rookHasMoved: {
      kingside: false,
      queenside: false
    }
  }

  constructor(side: Side, inCheckObservable?: boolean ) {
    this.king = { rank: (side === 'white') ? 1 : 8, file: 'e' }
    if (inCheckObservable) {
      makeObservable(this, {
        inCheckFrom: observable,
      })
      this.inCheckFrom = []
    }
    else {
      this.inCheckFrom = []
    }
  }

  reset(side: Side): void {
    this.king = { rank: (side === 'white') ? 1 : 8, file: 'e' }
    this.primaries.clear()
    this.inCheckFrom.length = 0
    this.castling.hasCastled = false
    this.castling.kingHasMoved = false
    this.castling.rookHasMoved = {
      kingside: false,
      queenside: false
    }
  }

  syncTo (source: Tracking_Side) {
    const sourceMapAsArray = Array.from(source.primaries)
    const deepArrayCopy = sourceMapAsArray.map(([key, value]) => (
      [key, [...value]]
    ))
    this.primaries = new Map<PrimaryPieceType, Position[]>(deepArrayCopy as typeof sourceMapAsArray)
      // https://mobx.js.org/observable-state.html#converting-observables-back-to-vanilla-javascript-collections
    this.inCheckFrom = source.inCheckFrom.slice() // always copying to non-observable
    this.king = source.king
    this.castling.hasCastled = source.castling.hasCastled 
    this.castling.kingHasMoved = source.castling.kingHasMoved 
    this.castling.rookHasMoved = {...source.castling.rookHasMoved}
  }
}

class Tracking {

  white: Tracking_Side
  black: Tracking_Side

  constructor(inCheckObservable?: boolean) {
    this.white = new Tracking_Side('white', inCheckObservable)
    this.black = new Tracking_Side('black', inCheckObservable)
  }

  reset() {
    this.white.reset('white')
    this.black.reset('black')
  }

  syncTo (source: Tracking) {
    this.white.syncTo(source.white)
    this.black.syncTo(source.black)
  }
}

export default Tracking
