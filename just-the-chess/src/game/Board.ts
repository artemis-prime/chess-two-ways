import {
  action,
  computed,
  makeObservable, 
} from 'mobx'

import type ActionRecord from '../ActionRecord'
import type Check from '../Check'
import type GameStatus from '../GameStatus'
import { 
  type default as Piece, 
  type Color, 
  type PrimaryPieceType, 
  type Side, 
  opponent,
  isOpponent,
} from '../Piece'

import type Position from '../Position'
import { 
  RANKS,
  RANKS_REVERSED,
  FILES,
  type Rank,
} from '../Position'

import Square from './Square'
import type SquareDesc from '../SquareDesc'

import {
  hasN,
  hasS,
  hasE,
  hasW,
  getNRank,
  getSRank,
  getEFile,
  getWFile,
} from './util'

import type IsCaptureFn from './IsCaptureFn'

import Tracking, { type TrackingSnapshot } from './board/Tracking'
import BoardSquares, { type SquaresSnapshot } from './board/BoardSquares'

interface Board {

  pieceAt(pos: Position): Piece | null
  colorAt(pos: Position): Color | null 
  positionCanBeCaptured(pos: Position, asSide: Side): boolean 
  
  eligableToCastle(color: Side, side: 'kingside' | 'queenside'): boolean   
  cannotCastleBecause(color: Side, side: 'kingside' | 'queenside'): string | null // returns reason or null if ok 

  isClearAlongRank(from: Position, to: Position): boolean
  isClearAlongFile(from: Position, to: Position): boolean
  isClearAlongDiagonal(from: Position, to: Position): boolean
}

interface BoardSnapshot {
  squares: SquaresSnapshot
  tracking: TrackingSnapshot
}

  // This interface is visable to GameImpl, but not to any UI
interface BoardInternal extends Board {

  applyAction(r: ActionRecord, mode: 'undo' | 'redo' | 'do'): void 

  takeSnapshot(): BoardSnapshot,
  restoreFromSnapshot(board: BoardSnapshot): void

  syncTo(other: BoardInternal): void 

  primaryPositions(side: Side, type: PrimaryPieceType): Position[]
  pawnPositions(side: Side): Position[] 

  get check(): Check | null // observable
  get gameStatus(): GameStatus // mobx computed
  setGameStatus(s: GameStatus): void

  kingPosition(side: Side): Position
  reset(isObservable? : boolean): void

  // Utility methods for easy traversing / rendering (mobx 'computed')
  get asSquares():  Square[]
  get asSquareDescs():  SquareDesc[]

}

class BoardImpl implements BoardInternal {

  private _isCapture: IsCaptureFn

  private _tracking: Tracking 
  private _squares: BoardSquares 
  private _asSquareArray: Square[]
  private _asSquareDescArray: SquareDesc[]

  constructor(f: IsCaptureFn, isObservable?: boolean) {

    this._isCapture = f
    if (isObservable) {

      makeObservable(this, {
        applyAction: action,
        reset: action,
        setGameStatus: action,
        gameStatus: computed,
        check: computed,
      })
    }
    this._tracking = new Tracking(isObservable)
    this._squares = new BoardSquares(this._tracking, isObservable)
    this._asSquareArray = []
    this._asSquareDescArray = []
    for (const rank of RANKS_REVERSED) {
      for (const file of FILES) {
        this._asSquareArray.push(this._squares[rank][file]) 
        this._asSquareDescArray.push({
          position: this._squares[rank][file],
          pieceRef: this._squares[rank][file],
          posStateRef: this._squares[rank][file]
        })
      }
    }

  }

  get asSquares(): Square[] {
    return this._asSquareArray
  }

  get asSquareDescs(): SquareDesc[] {
    return this._asSquareDescArray
  }

  get gameStatus(): GameStatus {
    return this._tracking.gameStatus
  }

  setGameStatus(s: GameStatus): void {
    if (this._tracking.gameStatus.state != s.state) {
      this._tracking.gameStatus = s
    }
  }

  syncTo(other: BoardInternal): void {
    const theOther = other as BoardImpl
    this._squares.syncTo(theOther._squares) 
    this._tracking.syncTo(theOther._tracking) 
  }

  pieceAt(pos: Position): Piece | null {
    return this._sq(pos).piece
  }
 
  colorAt(pos: Position): Color | null {
    if (this._sq(pos).piece) {
      return this._sq(pos).piece!.color
    }
    return null
  }

  primaryPositions(side: Side, type: PrimaryPieceType): Position[] {
    return [...this._tracking[side].getPrimaryTypePositions(type) ]
  }

  pawnPositions(side: Side): Position[] {
    
    const result = [] as Position[]
    const visit = (sq: Square): void => {
      if (sq.piece && sq.piece.color === side ) {
        result.push(sq)
      } 
    }
    for (const rank of RANKS) {
      for (const file of FILES) {
        visit(this._squares[rank][file])
      }
    }
    return result
  }

  get check(): Check | null  {
    if (this._tracking.white.inCheckFrom.length > 0) {
      return {
        side: 'white',
        from: [...this._tracking.white.inCheckFrom],
        kingPosition: this._tracking.white.king
      }
    } 
    else if (this._tracking.black.inCheckFrom.length > 0) {
      return {
        side: 'black',
        from: [...this._tracking.black.inCheckFrom],
        kingPosition: this._tracking.black.king
      }
    }
    return null  
  }

  kingPosition(side: Side): Position {
    return this._tracking[side].king
  }

  isClearAlongRank(from: Position, to: Position): boolean {

    if (from.rank === to.rank) {
      const delta = FILES.indexOf(to.file) - FILES.indexOf(from.file)
      if (delta < 0) {
          // zero based!
        for (let fileIndex = FILES.indexOf(from.file) - 1; fileIndex > FILES.indexOf(to.file); fileIndex--) {
          if (!!this._squares[to.rank][FILES[fileIndex]].piece) {
            return false
          }
        }
      }
      else {
          // zero based!
        for (let fileIndex = FILES.indexOf(from.file) + 1; fileIndex < FILES.indexOf(to.file); fileIndex++) {
          if (!!this._squares[to.rank][FILES[fileIndex]].piece) {
            return false
          }
        }
      }
      return true
    }
    return false
  }
  
  isClearAlongFile(from: Position,  to: Position): boolean {

    if (FILES.indexOf(from.file) === FILES.indexOf(to.file)) {
      const delta = to.rank - from.rank
      if (delta < 0) {
          // one-based
        for (let rank = from.rank - 1; rank > to.rank; rank--) {
          if (!!this._squares[rank as Rank][from.file].piece) {
            return false
          }
        }
      }
      else {
          // one-based
        for (let rank = from.rank + 1; rank < to.rank; rank++) {
          if (!!this._squares[rank as Rank][from.file].piece) {
            return false
          }
        }
      }
      return true
    }
    return false
  }
  
  isClearAlongDiagonal(from: Position, to: Position): boolean {
  
    const deltaRank = to.rank - from.rank
    const deltaFile = FILES.indexOf(to.file) - FILES.indexOf(from.file)
  
    if (Math.abs(deltaRank) !== Math.abs(deltaFile)) {
      return false
    }
  
      // --> NE
    if (deltaFile > 0 && deltaRank > 0 ) {
      for (let rank = from.rank + 1, fileIndex = FILES.indexOf(from.file) + 1; rank < to.rank && fileIndex < FILES.indexOf(to.file); rank++, fileIndex++) {
        if (!!this._squares[rank as Rank][FILES[fileIndex]].piece) {
          return false
        }
      }
    }
      // --> SE
    else if (deltaFile > 0 && deltaRank < 0) {
      for (let rank = from.rank - 1, fileIndex = FILES.indexOf(from.file) + 1; rank > to.rank && fileIndex < FILES.indexOf(to.file); rank--, fileIndex++) {
        if (!!this._squares[rank as Rank][FILES[fileIndex]].piece) {
          return false
        }
      }
    }
      // --> SW
    else if (deltaFile < 0 && deltaRank < 0) {
      for (let rank = from.rank - 1, fileIndex = FILES.indexOf(from.file) - 1; rank > to.rank && fileIndex > FILES.indexOf(to.file);  rank--, fileIndex--) {
        if (!!this._squares[rank as Rank][FILES[fileIndex]].piece) {
          return false
        }
      }
    }
      // --> NW
      else if (deltaFile < 0 && deltaRank > 0) {
        for (let rank = from.rank + 1, fileIndex = FILES.indexOf(from.file) - 1; rank < to.rank && fileIndex > FILES.indexOf(to.file); rank++, fileIndex--) {
          if (!!this._squares[rank as Rank][FILES[fileIndex]].piece) {
            return false
          }
        }
      }
    return true
  }

  cannotCastleBecause = (color: Color, rookSide: 'kingside' | 'queenside'): string | null => {
    const { inCheckFrom, castling: {hasCastled, kingMoveCount, rookMoveCounts} } = this._tracking[color]
    const rookTracking = this._tracking[color].getRookTracking(rookSide)
    const inCheck = inCheckFrom.length > 0
      // has been captured or has moved 
    const rookHasMoved = rookTracking.position === null || rookMoveCounts[rookSide] > 0 
    const kingHasMoved = kingMoveCount > 0
    
    const eligable = !inCheck && !hasCastled && !kingHasMoved && !rookHasMoved

    if (!eligable) {
      return (inCheck) ? `${color} cannot castle out of check!` 
        : 
        color + ' is not eligable to castle ' + ((kingHasMoved || hasCastled) ?  '' : rookSide + ' ') +
          'because ' + 
        (hasCastled) ? 'it has already castled!' : (kingHasMoved ? 'the king has moved!' : 'that rook has moved!')
    }  
    return null
  }

  eligableToCastle = (color: Color, side: 'kingside' | 'queenside'): boolean => {
    return !(!!this.cannotCastleBecause(color, side))
  }

  positionCanBeCaptured(pos: Position, asSide: Side): boolean {
    return this._positionCanBeCapturedFrom(pos, asSide, 'boolean') as boolean
  }

  applyAction(r: ActionRecord, mode: 'undo' | 'redo' | 'do'): void {

    if (r.action === 'castle') {
      this._castle(r, mode)
    }
    else if (mode === 'undo') {
      this._move(r.to, r.from)
      if (r.action.includes('capture')) {
        this._sq(r.to).piece = r.captured!
      }
      if (r.action.includes('romote')) {
          // the _move above just returned the piece to 'from'
        const self = this._sq(r.from).piece!
        this._sq(r.from).piece = {color: self.color, type: 'pawn'}
      }
    }
    else {
        // Note that _move also takes care of capture ;)
      this._move(r.from, r.to)
      if (r.action.includes('romote')) {
        const self = this._sq(r.to).piece!
        this._sq(r.to).piece = {color: self.color, type: 'queen'}
      }
    }

    this._track(r, mode)
      // Track inCheck for both, since various codepaths can result in 
      // either side being in check.
    this._trackInCheck('black')
    this._trackInCheck('white')
  }

  reset(): void {
    this._tracking.reset()
    this._squares.reset(this._tracking)
  }

  restoreFromSnapshot(snapshot: BoardSnapshot): void {
    this._tracking.reset()
    this._squares.restoreFromSnapshot(snapshot.squares)
    this._tracking.restoreFromSnapshot(snapshot.tracking)
  }

  takeSnapshot(): BoardSnapshot {
    return {
      squares: this._squares.takeSnapshot(),
      tracking: this._tracking.takeSnapshot()
    }
  }
 
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  
  private _sq(p: Position): Square {
    return this._squares[p.rank][p.file]!
  }

  private _sideIsInCheckFrom(side: Side): Position[] {
    return this._positionCanBeCapturedFrom(
      this._tracking[side].king,
      side,
      'positions'
    ) as Position[]
  }

  private _trackInCheck(side: Side): void {
    this._tracking[side].inCheckFrom = this._sideIsInCheckFrom(side)
  }

  private _move(from: Position, to: Position, ignoreCastling?: boolean): void {

    this._sq(to).piece = this._sq(from).piece
    this._sq(from).piece = null 
  }

  private _castle(r: ActionRecord, mode: 'undo' | 'redo' | 'do'): void {

    if (mode === 'undo') {
      if (r.to.file === 'g') {
        this._move({...r.from, file: 'g'}, r.from, true)  
        this._move({...r.from, file: 'f'}, {...r.from, file: 'h'}, true) 
      }
      else {
        this._move({...r.from, file: 'c'}, r.from, true)  
        this._move({...r.from, file: 'd'}, {...r.from, file: 'a'}, true) 
      }
    }
    else {
      if (r.to.file === 'g') {
        this._move(r.from, {...r.from, file: 'g'}, true)  
        this._move({...r.from, file: 'h'}, {...r.from, file: 'f'}, true) 
      }
      else {
        this._move(r.from, {...r.from, file: 'c'}, true)  
        this._move({...r.from, file: 'a'}, {...r.from, file: 'd'}, true) 
      }
    }
  }

  private _track(r: ActionRecord, mode: 'do' | 'undo' | 'redo'): void {

    const side = r.piece.color
      // fall through, for rooks
    if (r.action === 'castle') {
      this._tracking[side].trackCastle(r, mode)
    }
    else {
      if (r.action.includes('romote')) {
        this._tracking[side].trackPromotion(r.to, mode)
      } 
      if (r.action.includes('capture')) {
        this._tracking[side].trackCapture(r.captured!, r.to, mode)
      }
      if (r.action === 'move' || r.action.includes('capture')) {
        this._tracking[side].trackPositionChange(r, mode)
      }
    }
  }

  private _getSurroundingSquares(pos: Position) /* it returns what it returns ;) */ {

    return {
      N: hasN(pos) ? this._squares[getNRank(pos)][pos.file] : undefined,
      NE: (hasN(pos) && hasE(pos)) ? this._squares[getNRank(pos)][getEFile(pos)] : undefined,
      E: (hasE(pos)) ? this._squares[pos.rank][getEFile(pos)] : undefined,
      SE: (hasS(pos) && hasE(pos)) ? this._squares[getSRank(pos)][getEFile(pos)] : undefined,
      S: (hasS(pos)) ? this._squares[getSRank(pos)][pos.file] : undefined,
      SW: (hasS(pos) && hasW(pos)) ? this._squares[getSRank(pos)][getWFile(pos)] : undefined,
      W: (hasW(pos)) ? this._squares[pos.rank][getWFile(pos)] : undefined,
      NW: (hasN(pos) && hasW(pos)) ? this._squares[getNRank(pos)][getWFile(pos)] : undefined,

        // Neighbor is open (so vulnerable from certain types from afar),
        // or contains an opponent capable of capturing from this neighboring square
      vulnerableOnDiagonalFromPrimaries(sideToCapture: Side): boolean {
        return !!(this.NE && (!this.NE!.piece || isOpponent(this.NE!.piece, sideToCapture, ['bishop', 'queen']))) 
        || 
        !!(this.SE && (!this.SE!.piece || isOpponent(this.SE!.piece, sideToCapture, ['bishop', 'queen']))) 
        || 
        !!(this.SW && (!this.SW!.piece || isOpponent(this.SW!.piece, sideToCapture, ['bishop', 'queen']))) 
        || 
        !!(this.NW && (!this.NW!.piece || isOpponent(this.NW!.piece, sideToCapture, ['bishop', 'queen']))) 
      },

        // Neighbor is open (so vulnerable from certain types from afar),
        // or contains an opponent capable of capturing from this neighboring square
      vulnerableOnRankOrFileFromPrimaries(sideToCapture: Side): boolean {
        return !!(this.N && (!this.N!.piece || isOpponent(this.N!.piece, sideToCapture, ['rook', 'queen']))) 
          || 
          !!(this.S && (!this.S!.piece || isOpponent(this.S!.piece, sideToCapture, ['rook', 'queen']))) 
          || 
          !!(this.E && (!this.E!.piece || isOpponent(this.E!.piece, sideToCapture, ['rook', 'queen']))) 
          || 
          !!(this.W && (!this.W!.piece || isOpponent(this.W!.piece, sideToCapture, ['rook', 'queen']))) 
      },

        // All other opposing piece will be explicitly checked from their cached positions.
      getOpposingPawnsOrKing(sideToCapture: Side): Position[] {

        const possibleSquaresForOppositePawns = (sideToCapture === 'white') ? [this.NE, this.NW] : [this.SE, this.SW] 
        const actualSquaresWithOppositePawns = possibleSquaresForOppositePawns.filter(
          (sqToTest) => (sqToTest && isOpponent(sqToTest.piece, sideToCapture, 'pawn'))
        ) as Square[]

        const possibleSquaresForOppositeKing = [this.N, this.NE, this.NW, this.S, this.SE, this.SW]
        const actualSquareWithOppositeKing = possibleSquaresForOppositeKing.find(
          (sqToTest) => (sqToTest && isOpponent(sqToTest.piece, sideToCapture, 'king'))
        )

        return actualSquareWithOppositeKing ? [...actualSquaresWithOppositePawns, actualSquareWithOppositeKing] : actualSquaresWithOppositePawns
      }
    }
  }

  private _positionCanBeCapturedFrom(
    pos: Position, 
    asSide: Side,
    returnType: 'boolean' | 'positions' // boolean is faster
  ): Position[] | boolean {

    const primaryPieceDangers: Position[] = []
    const surrounding = this._getSurroundingSquares(pos)
    
    const typesToCheck: PrimaryPieceType[] = ['knight']
    if (surrounding.vulnerableOnDiagonalFromPrimaries(asSide)) {
      typesToCheck.push('queen')
      typesToCheck.push('bishop')
    }
    if (surrounding.vulnerableOnRankOrFileFromPrimaries(asSide)) {
      typesToCheck.push('rook')
      if (!typesToCheck.includes('queen')) {
        typesToCheck.push('queen')
      }
    }

    for (let pieceType of typesToCheck) {
      const positionsWithOpponentOfThisType = this._tracking[opponent(asSide)].getPrimaryTypePositions(pieceType) 
      for (let posToCaptureFrom of positionsWithOpponentOfThisType) {
        if (this._isCapture(this, {
          piece: {type: pieceType, color: asSide}, 
          from: posToCaptureFrom, 
          to: pos
        })) {
          if (returnType === 'boolean') {
            return true
          }
          else {
            primaryPieceDangers.push(posToCaptureFrom)
          }
        }  
      }
    }

    const nearDangers = surrounding.getOpposingPawnsOrKing(asSide)
    if (returnType === 'boolean') {
      return (nearDangers.length > 0)
    }
    return [...primaryPieceDangers, ...nearDangers]
  }


  _dumpTracking(): void {
    console.log(this._tracking)
  }
  _syncTrackingTest(): void {
    const target = new Tracking()
    target.syncTo(this._tracking)
    console.log(target)
  }
  _dumpSquares(): void {
    console.log(JSON.stringify(this._squares, null, 2))
  }
}

const createBoard = (f: IsCaptureFn, isObservable?: boolean): BoardInternal => (
  new BoardImpl(f, isObservable)
)

export { 
  type Board as default, 
  type BoardInternal, 
  type BoardSnapshot, 
  createBoard 
}  
