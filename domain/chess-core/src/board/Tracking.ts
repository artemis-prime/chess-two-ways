import { makeObservable, observable } from 'mobx'

import type { PrimaryPieceType, Side } from '../Piece'
import type Position from '../Position'
import type GameStatus from '../GameStatus'

const DEFAULT_GAME_STATUS: GameStatus = {
  state: 'new',
  victor: undefined
}

class Tracking_Side {

  king: Position
  primaries = new Map<PrimaryPieceType, Position[]>([
    ['queen', []],
    ['rook', []],
    ['bishop', []],
    ['knight', []],
  ])
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
    }
    this.inCheckFrom = []
  }

  reset(side: Side): void {
    this.king = { rank: (side === 'white') ? 1 : 8, file: 'e' }
    this.primaries = new Map<PrimaryPieceType, Position[]>([
      ['queen', []],
      ['rook', []],
      ['bishop', []],
      ['knight', []],
    ])
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
      // always syncing from observable to non-observable
    this.inCheckFrom = source.inCheckFrom.slice() 
    this.king = source.king
    this.castling.hasCastled = source.castling.hasCastled 
    this.castling.kingHasMoved = source.castling.kingHasMoved 
    this.castling.rookHasMoved = {...source.castling.rookHasMoved}
  }
}

class Tracking {

  white: Tracking_Side
  black: Tracking_Side

    // Need to initialize for babel : https://github.com/mobxjs/mobx/issues/2486
  gameStatus: GameStatus = DEFAULT_GAME_STATUS

  constructor(observeMe?: boolean) {
    this.white = new Tracking_Side('white', observeMe)
    this.black = new Tracking_Side('black', observeMe)
    if (observeMe) {
      makeObservable(this, {
        gameStatus: observable.shallow,
      })
    }
  }

  reset() {
    this.white.reset('white')
    this.black.reset('black')
    this.gameStatus = DEFAULT_GAME_STATUS
  }

  syncTo (source: Tracking) {
    this.white.syncTo(source.white)
    this.black.syncTo(source.black)
      // https://mobx.js.org/observable-state.html#converting-observables-back-to-vanilla-javascript-collections
      // always syncing from observable to non-observable
    this.gameStatus = {...source.gameStatus}
  }
}

export default Tracking
