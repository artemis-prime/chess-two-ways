import { makeObservable, observable, action, makeAutoObservable } from 'mobx'

import type { PrimaryPieceType, Side } from '../../Piece'
import type Position from '../../Position'
import type GameStatus from '../../GameStatus'
import type CastlingTracking from '../../CastlingTracking'
import type { TrackingSnapshot, TrackingSnapshotForSide, PositionCode } from '../../Snapshot'
import { positionFromString, positionToString } from '../../Position'

const DEFAULT_GAME_STATUS: GameStatus = {
  state: 'new',
  victor: undefined
}

class CastlingTrackingInternal implements CastlingTracking {

  hasCastled: boolean = false
  kingMoveCount: number = 0
  rookMoveCounts = {
    kingside: 0,
    queenside: 0
  }

  constructor(_observable?: boolean) {
    if (_observable) {
      makeObservable(this, {
        hasCastled: observable,
        kingMoveCount: observable,
        reset: action,
        restoreFromSnapshot: action 
      })
      makeObservable(this.rookMoveCounts, {
        kingside: observable,
        queenside: observable
      })
    }
  }

  reset() {
    this.hasCastled = false
    this.kingMoveCount = 0
    this.rookMoveCounts = {
      kingside: 0,
      queenside: 0
    }
  }

  restoreFromSnapshot(snapshot: CastlingTracking): void {
    this.hasCastled = snapshot.hasCastled
    this.kingMoveCount = snapshot.kingMoveCount
    this.rookMoveCounts.kingside = snapshot.rookMoveCounts.kingside
    this.rookMoveCounts.queenside = snapshot.rookMoveCounts.queenside
  }

  takeSnapshot(): CastlingTracking {
    return ({
      ...this,
      rookMoveCounts: {
        ...this.rookMoveCounts
      }
    }) 
  }
}

class Tracking_Side {

  king: Position

  private primaries = new Map<PrimaryPieceType, Position[]>([
    ['queen', []],
    ['rook', []],
    ['bishop', []],
    ['knight', []],
  ])

  inCheckFrom: Position[] = []
  castling: CastlingTrackingInternal

  constructor(side: Side, _observable?: boolean ) {
    this.king = { rank: (side === 'white') ? 1 : 8, file: 'e' }
    if (_observable) {
      makeObservable(this, {
        inCheckFrom: observable,
        reset: action,
        restoreFromSnapshot: action
      })
    }
    this.castling = new CastlingTrackingInternal(_observable)
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
    this.castling.reset()
  }

  takeSnapshot(): TrackingSnapshotForSide {
    return {
      inCheckFrom: this.inCheckFrom.map((pos) => (positionToString(pos))),
      castling: this.castling.takeSnapshot()
    }
  }

  restoreFromSnapshot(snapshot: TrackingSnapshotForSide): void {

    this.inCheckFrom.length = 0
    snapshot.inCheckFrom.forEach((el) => {
        // we know the source of the strings, so safe
      this.inCheckFrom.push(positionFromString(el)!)
    })
    this.castling.restoreFromSnapshot(snapshot.castling)
  }


    // Note, the source object may have observable components, but
    // this object won't.  We will always only sync from observable to non-observable
    // https://mobx.js.org/observable-state.html#converting-observables-back-to-vanilla-javascript-collections
  syncTo (source: Tracking_Side) {
    const sourceMapAsArray = Array.from(source.primaries)
    const deepArrayCopy = sourceMapAsArray.map(([key, value]) => (
      [key, [...value]]
    ))
    this.primaries = new Map<PrimaryPieceType, Position[]>(deepArrayCopy as typeof sourceMapAsArray)
    this.inCheckFrom = source.inCheckFrom.slice() 
    this.king = source.king
    this.castling.hasCastled = source.castling.hasCastled 
    this.castling.kingMoveCount = source.castling.kingMoveCount 
    this.castling.rookMoveCounts = {...source.castling.rookMoveCounts}
  }

  getPrimaryTypePositions(t: PrimaryPieceType): Position[] {
    return this.primaries.get(t)!
  }

  setPrimaryTypePosition(t: PrimaryPieceType, pos: Position): void {
    const positions = this.primaries.get(t)!
    positions.push(pos)  
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

  takeSnapshot(): TrackingSnapshot {
    return {
      white: this.white.takeSnapshot(),  
      black: this.black.takeSnapshot(),  
    }
  }

  restoreFromSnapshot(snapshot: TrackingSnapshot): void {
    this.white.restoreFromSnapshot(snapshot.white)
    this.black.restoreFromSnapshot(snapshot.black)
  }
}

export default Tracking
