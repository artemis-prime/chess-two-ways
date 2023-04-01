import {
  action,
  computed,
  makeObservable, 
} from 'mobx'

import type Position from './Position'
import { 
  positionsEqual,   
  type File,
  type Rank,
  RANKS_REVERSE,
  FILES,
  copyPosition,
 } from './Position'
import { 
  type default as Piece, 
  type Color, 
  type PrimaryPieceType, 
  type Side, 
  opponent,
  isOpponent,
  piecesExistAndAreEqual
} from './Piece'
import { PRIMARY_PIECES } from './Piece'
import type Square from './Square'

import type ActionRecord from './ActionRecord'
import type CanCaptureFn from './game/CanCaptureFn'

import {type Tracking, newTracking, syncTracking} from './board/Tracking'
import type Squares from './board/Squares'
import { syncSquares } from './board/Squares'
import { freshBoard, resetBoard } from './board/boardInitializers'

interface Board {

  pieceAt(pos: Position): Piece | null
  colorAt(pos: Position): Color | null 
  positionCanBeCaptured(pos: Position, asSide: Side): boolean 

    // If false, and reasonDenied is supplied, 
    // it will be populated with a human readable reason 
    // why side is not eliable
    // 'kingside' vs 'queenside'
  eligableToCastle(side: Side, kingside: boolean, reasonDenied?: string[]): boolean 

  
    // 'side' is in check from Position[] (or empty array)
  sideIsInCheckFrom(side: Side) : Position[] 
  sideIsInCheck(side: Side) : boolean 

    // Utility method for easy rendering (mobx 'computed')
  get boardAsArray():  {pos: Position, piece: Piece | null}[]

  isClearAlongRank(from: Position, to: Position): boolean
  isClearAlongFile(from: Position, to: Position): boolean
  isClearAlongDiagonal(from: Position, to: Position): boolean
}

  // This interface is visable to GameImpl, but not to any UI
interface BoardInternal extends Board {

  tracking: Tracking
  squares: Squares
  sync(other: BoardInternal): void 
  applyAction(r: ActionRecord, mode: 'undo' | 'redo' | 'do'): void 
  kingsPosition(side: Side): Position
  reset(): void
}

class BoardImpl implements BoardInternal {

  private _canCapture: CanCaptureFn

  tracking: Tracking = newTracking()
  squares: Squares 

  constructor(f: CanCaptureFn, isObservable?: boolean) {

    this._canCapture = f
    if (isObservable) {

      makeObservable(this, {
        applyAction: action,
        reset: action,
        boardAsArray: computed,
      })
    }
    this.squares = freshBoard(this.tracking, isObservable)
  }

  sync(other: BoardInternal): void {
    syncSquares(this.squares, other.squares) 
    syncTracking(this.tracking, other.tracking) 
  }

  pieceAt(pos: Position): Piece | null {
    return this.squares[pos.rank][pos.file].piece
  }
 
  colorAt(pos: Position): Color | null {
    if (this.squares[pos.rank][pos.file].piece) {
      return this.squares[pos.rank][pos.file].piece!.color
    }
    return null
  }

  sideIsInCheckFrom(side: Side): Position[] {
    return this._positionCanBeCapturedFrom(
      this.tracking[side].king,
      side,
      'positions'
    ) as Position[]
  }

  sideIsInCheck(side: Side): boolean {
    const result = 
     this._positionCanBeCapturedFrom(
      this.tracking[side].king,
      side,
      'boolean'
    ) as boolean

    return result
  }

  kingsPosition(side: Side): Position {
    return this.tracking[side].king
  }

  isClearAlongRank(from: Position, to: Position): boolean {

    if (from.rank === to.rank) {
      const delta = FILES.indexOf(to.file) - FILES.indexOf(from.file)
      if (delta < 0) {
          // zero based!
        for (let fileIndex = FILES.indexOf(from.file) - 1; fileIndex > FILES.indexOf(to.file); fileIndex--) {
          if (!!this.squares[to.rank][FILES[fileIndex]].piece) {
            return false
          }
        }
      }
      else {
          // zero based!
        for (let fileIndex = FILES.indexOf(from.file) + 1; fileIndex < FILES.indexOf(to.file); fileIndex++) {
          if (!!this.squares[to.rank][FILES[fileIndex]].piece) {
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
          if (!!this.squares[rank][from.file].piece) {
            return false
          }
        }
      }
      else {
          // one-based
        for (let rank = from.rank + 1; rank < to.rank; rank++) {
          if (!!this.squares[rank][from.file].piece) {
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
        if (!!this.squares[rank][FILES[fileIndex]].piece) {
          return false
        }
      }
    }
      // --> SE
    else if (deltaFile > 0 && deltaRank < 0) {
      for (let rank = from.rank - 1, fileIndex = FILES.indexOf(from.file) + 1; rank > to.rank && fileIndex < FILES.indexOf(to.file); rank--, fileIndex++) {
        if (!!this.squares[rank][FILES[fileIndex]].piece) {
          return false
        }
      }
    }
      // --> SW
    else if (deltaFile < 0 && deltaRank < 0) {
      for (let rank = from.rank - 1, fileIndex = FILES.indexOf(from.file) - 1; rank > to.rank && fileIndex > FILES.indexOf(to.file);  rank--, fileIndex--) {
        if (!!this.squares[rank][FILES[fileIndex]].piece) {
          return false
        }
      }
    }
      // --> NW
      else if (deltaFile < 0 && deltaRank > 0) {
        for (let rank = from.rank + 1, fileIndex = FILES.indexOf(from.file) - 1; rank < to.rank && fileIndex > FILES.indexOf(to.file); rank++, fileIndex--) {
          if (!!this.squares[rank][FILES[fileIndex]].piece) {
            return false
          }
        }
      }
    return true
  }

  eligableToCastle(side: Side, kingside: boolean, reasonDenied?: string[]): boolean  {

    const castleSide = kingside ? 'kingside' : 'queenside'
    const { hasCastled, kingHasMoved } = this.tracking[side].castling
    const rookHasMoved = this.tracking[side].castling.rookHasMoved[castleSide]
    const eligable = !hasCastled && !kingHasMoved && !rookHasMoved

    if (!eligable && reasonDenied && Array.isArray(reasonDenied)) {
      reasonDenied.push(
        `${side} is no longer eligable to castle` + 
        `${(kingHasMoved || hasCastled) ?  '' : ` ${castleSide}`} because ` + 
        `${(hasCastled) ? 'it has already castled!' : (kingHasMoved ? 'the king has moved!' : 'that rook has moved!')}`
      )  
    }  
    return eligable
  }

  positionCanBeCaptured(pos: Position, asSide: Side): boolean {
    return this._positionCanBeCapturedFrom(pos, asSide, 'boolean') as boolean
  }

  applyAction(r: ActionRecord, mode: 'undo' | 'redo' | 'do'): void {

    if (r.action === 'castle') {
      this._castle(r, mode)
    }
    else if (mode === 'undo') {
      this._move(r.to, r.from, true)
      if (r.action.includes('capture')) {
        this.squares[r.to.rank][r.to.file].piece = r.captured!
      }
      if (r.action.includes('promote')) {
          // the _move above just returned the piece to 'from'
        const self = this.squares[r.from.rank][r.from.file].piece!
        this.squares[r.from.rank][r.from.file].piece = {color: self.color, type: 'pawn'}
      }
    }
    else {
        // Note that _move also takes care of capture ;)
      this._move(r.from, r.to, (mode !== 'do'))
      if (r.action.includes('promote')) {
        const self = this.squares[r.to.rank][r.to.file].piece!
        this.squares[r.to.rank][r.to.file].piece = {color: self.color, type: r.promotedTo!}
      }
    }

    this._trackPrimaries(r, mode)
  }

  reset(): void {

    this.tracking = newTracking()
    resetBoard(this.squares, this.tracking)
  }

  get boardAsArray(): {pos: Position, piece: Piece | null}[] {
    const result: {pos: Position, piece: Piece | null}[] = []
    for (const rank of RANKS_REVERSE) {
      for (const file of FILES) {
        result.push({ pos: copyPosition(this.squares[rank][file]), piece: this.squares[rank][file].piece}) 
      }
    }
    return result
  }
 
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  
  private _trackCastlingEligability(moved: Position): void {

    const fromPieace = this.squares[moved.rank][moved.file].piece

    if (fromPieace?.type === 'king') {
      this.tracking[fromPieace!.color].castling.kingHasMoved = true
    }
    else if (fromPieace?.type === 'rook') {
      if (moved.file === 'h') {
        this.tracking[fromPieace.color].castling.rookHasMoved.kingside = true
      }
      else if (moved.file === 'a') {
        this.tracking[fromPieace.color].castling.rookHasMoved.queenside = true
      }
    }
  }

  private _move(from: Position, to: Position, ignoreCastling?: boolean): void {

    if (!ignoreCastling) {
      this._trackCastlingEligability(from)
    }

    this.squares[to.rank][to.file].piece = this.squares[from.rank][from.file].piece
    this.squares[from.rank][from.file].piece = null 
  }

  private _castle(r: ActionRecord, mode: 'undo' | 'redo' | 'do'): void {

    const castleSide = (r.to.file === 'g') ? 'kingside' : 'queenside' 
    if (mode === 'undo') {
      if (r.to.file === 'g') {
        this._move({...r.from, file: 'g'}, r.from, true)  
        this._move({...r.from, file: 'f'}, {...r.from, file: 'h'}, true) 
      }
      else {
        this._move({...r.from, file: 'c'}, r.from, true)  
        this._move({...r.from, file: 'd'}, {...r.from, file: 'a'}, true) 
      }
        // undo ineligabiliy for castling 
      const color = (r.from.rank === 1) ? 'white' : 'black'
      this.tracking[color].castling.hasCastled = false 
        // just in case
      this.tracking[color].castling.kingHasMoved = false 
      this.tracking[color].castling.rookHasMoved[castleSide] = false
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

        // make sure we can't castle twice
      this.tracking[(r.from.rank === 1) ? 'white' : 'black'].castling.hasCastled = true 
    }
  }

  private _trackPrimaries(r: ActionRecord, mode: 'do' | 'undo' | 'redo'): void {

    // Safe to copy refs of r.to and r.from since they are deep copies and don't point to the board
    const side = r.piece.color
    if (r.piece.type === 'king') {
      if (mode === 'undo') {
        this.tracking[side].king = r.from
      }
      else {
        this.tracking[side].king = r.to
      }
    }
    if (r.action === 'castle') {
        // track the rook
      const positions = this.tracking[side].primaries.get('rook')!
      if (r.to.file === 'g') {
        if (mode === 'undo') {
          const index = positions.findIndex((e) => (positionsEqual(e, {...r.from, file: 'f'})))
          if (index !== -1) {
            positions[index] = {...positions[index], file: 'h'}
          }
        }
        else {
          const index = positions.findIndex((e) => (positionsEqual(e, {...r.from, file: 'h'})))
          if (index !== -1) {
            positions[index] = {...r.from, file: 'f'}
          }
        }
      }
      else {
        if (mode === 'undo') {
          const index = positions.findIndex((e) => (positionsEqual(e, {...r.from, file: 'd'})))
          if (index !== -1) {
            positions[index] = {...positions[index], file: 'a'}
          }
        }
        else {
          const index = positions.findIndex((e) => (positionsEqual(e, {...r.from, file: 'a'})))
          if (index !== -1) {
            positions[index] = {...positions[index], file: 'd'}
          }
        }
      }
    }
    else {
      if (r.promotedTo) {
          // Track the new piece of the promoted to type.
          // Either create a new slot of it with the to square,
          // or destroy said slot if undo
        const positions = this.tracking[side].primaries.get(r.promotedTo)!
        if (mode === 'undo') {
            // remove the slot created for the piece promoted to. 
          const index = positions.findIndex((e) => (positionsEqual(e, r.to)))
          if (index !== -1) {
            positions.splice(index, 1)
          }
        } 
        else {
          // create another slot for the piece type promoted to.
          // (from piece was type 'pawn', so ignore)
          positions.push(r.to)
        } 
      } 
      if (r.action.includes('capture')) {
          // track the captured piece, if it is of interest
        if (PRIMARY_PIECES.includes(r.captured!.type)) {
          const positions = this.tracking[r.captured!.color].primaries.get(r.captured!.type as PrimaryPieceType)!
          const index = positions.findIndex((e) => (positionsEqual(e, r.to)))
          if (mode === 'undo') {
              // shouldn't find it, since we're undoing a capture
            if (index === -1) {
              positions.push(r.to)
            }
          }
          else {
            if (index !== -1) {
              positions.splice(index, 1)
            }
          }
        }
      }
      if (r.action === 'move' || r.action.includes('capture')) {
            // track the moved or capturing piece, if it is of interest
        if ((PRIMARY_PIECES as readonly string[]).includes(r.piece.type)) {
          const positions = this.tracking[side].primaries.get(r.piece.type as PrimaryPieceType)!
          if (mode === 'undo') {
            const index = positions.findIndex((e) => (positionsEqual(e, r.to)))
            if (index !== -1) {
              positions[index] = r.from
            }
          }
          else {
            const index = positions.findIndex((e) => (positionsEqual(e, r.from)))
            if (index !== -1) {
              positions[index] = r.to
            }
          }
        }
      }
    }
  }

  private _getSurroundingSquares(pos: Position) /* it returns what it returns ;) */ {

    const hasN = (pos: Position) => (pos.rank <= 7)
    const hasS = (pos: Position) => (pos.rank >= 2)
    const hasE = (pos: Position) => (FILES.indexOf(pos.file) <= 6)
    const hasW = (pos: Position) => (FILES.indexOf(pos.file) >= 1)

    const getNRank = (pos: Position): Rank => (pos.rank + 1 as Rank)
    const getSRank = (pos: Position): Rank => (pos.rank - 1 as Rank)
    const getEFile = (pos: Position): File => (FILES[FILES.indexOf(pos.file) + 1])
    const getWFile = (pos: Position): File => (FILES[FILES.indexOf(pos.file) - 1])

    return {
      N: hasN(pos) ? this.squares[getNRank(pos)][pos.file] : undefined,
      NE: (hasN(pos) && hasE(pos)) ? this.squares[getNRank(pos)][getEFile(pos)] : undefined,
      E: (hasE(pos)) ? this.squares[pos.rank][getEFile(pos)] : undefined,
      SE: (hasS(pos) && hasE(pos)) ? this.squares[getSRank(pos)][getEFile(pos)] : undefined,
      S: (hasS(pos)) ? this.squares[getSRank(pos)][pos.file] : undefined,
      SW: (hasS(pos) && hasW(pos)) ? this.squares[getSRank(pos)][getWFile(pos)] : undefined,
      W: (hasW(pos)) ? this.squares[pos.rank][getWFile(pos)] : undefined,
      NW: (hasN(pos) && hasW(pos)) ? this.squares[getNRank(pos)][getWFile(pos)] : undefined,
        // Neighbor is open (so vulnerable from certain types from afar),
        // or contains an opponent capable of capturing from this neighboring square
      vulnerableOnDiagonalFromPrimaries(sideToCapture: Side): boolean {
        return (this.NE && (!this.NE!.piece || isOpponent(this.NE!.piece, sideToCapture, ['bishop', 'queen']))) 
        || 
        (this.SE && (!this.SE!.piece || isOpponent(this.SE!.piece, sideToCapture, ['bishop', 'queen']))) 
        || 
        (this.SW && (!this.SW!.piece || isOpponent(this.SW!.piece, sideToCapture, ['bishop', 'queen']))) 
        || 
        (this.NW && (!this.NW!.piece || isOpponent(this.NW!.piece, sideToCapture, ['bishop', 'queen']))) 
      },
        // Neighbor is open (so vulnerable from certain types from afar),
        // or contains an opponent capable of capturing from this neighboring square
      vulnerableOnRankOrFileFromPrimaries(sideToCapture: Side): boolean {
        return (this.N && (!this.N!.piece || isOpponent(this.N!.piece, sideToCapture, ['rook', 'queen']))) 
          || 
          (this.S && (!this.S!.piece || isOpponent(this.S!.piece, sideToCapture, ['rook', 'queen']))) 
          || 
          (this.E && (!this.E!.piece || isOpponent(this.E!.piece, sideToCapture, ['rook', 'queen']))) 
          || 
          (this.W && (!this.W!.piece || isOpponent(this.W!.piece, sideToCapture, ['rook', 'queen']))) 
      },
        // All other opposing piece will be explicitly checked from their cached positions.
      getOpposingPawnsOrKing(sideToCapture: Side): Square[] {

        const possibleSquaresForOppositePawns = (sideToCapture === 'white') ? [this.NE, this.NW] : [this.SE, this.SW] 
        const actualSquaresWithOppositePawns = possibleSquaresForOppositePawns.filter(
          (sqToTest) => (isOpponent(sqToTest?.piece, sideToCapture, 'pawn'))
        )

        const possibleSquaresForOppositeKing = [this.N, this.NE, this.NW, this.S, this.SE, this.SW]
        const actualSquareWithOppositeKing = possibleSquaresForOppositeKing.find(
          (sqToTest) => (isOpponent(sqToTest?.piece, sideToCapture, 'king'))
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
      const positionsWithOpponentOfThisType = this.tracking[opponent(asSide)].primaries.get(pieceType)! 
      for (let posToCaptureFrom of positionsWithOpponentOfThisType) {
        if (this._canCapture(this, pieceType, posToCaptureFrom, pos) ) {
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
    console.log(this.tracking)
  }
  _syncTrackingTest(): void {
    const target = newTracking()
    syncTracking(target, this.tracking)
    console.log(target)
  }
  _dumpSquares(): void {
    console.log(this.squares)
  }
}

const createBoard = (f: CanCaptureFn, isObservable?: boolean): BoardInternal => (
  new BoardImpl(f, isObservable)
)

export { type Board as default, type BoardInternal, createBoard }  
