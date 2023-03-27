import {
  action,
  computed,
  makeObservable, 
} from 'mobx'

import type Square from './Square'
import { 
  squaresEqual,   
  type File,
  type Rank,
  RANKS_REVERSE,
  FILES,
 } from './Square'
import { 
  type default as Piece, 
  type Color, 
  type PrimaryPieceType, 
  type Side, 
  opponent,
  piecesExistAndAreEqual
} from './Piece'
import { PRIMARY_PIECES } from './Piece'
import type BoardSquare from './BoardSquare'

import type ActionDescriptor from './game/ActionDescriptor'
import type CanCaptureFunction from './game/CanCaptureFunction'

import {type Tracking, newTracking, syncTracking} from './board/Tracking'
import type Squares from './board/Squares'
import { syncSquares } from './board/Squares'
import freshBoard from './board/freshBoard'

interface Board {

  pieceAt(sq: Square): Piece | null
  colorAt(sq: Square): Color | null 
  squareCanBeCaptured(sq: Square, asSide: Side): boolean 

    // If false, and reasonDenied is supplied, 
    // it will be populated with a human readable reason 
    // why side is not eliable
    // 'kingside' vs 'queenside'
  eligableToCastle(side: Side, kingside: boolean, reasonDenied?: string[]): boolean 

  
    // 'side' is in check from Square[] (or empty array)
  sideIsInCheckFrom(side: Side) : Square[] 
  sideIsInCheck(side: Side) : boolean 

    // Utility method for easy rendering (mobx 'computed')
  get boardAsSquares(): BoardSquare[]

  isClearAlongRank(from: Square, to: Square): boolean
  isClearAlongFile(from: Square, to: Square): boolean
  isClearAlongDiagonal(from: Square, to: Square): boolean
}

  // This interface is visable to GameImpl, but not to any UI
interface BoardInternal extends Board {

  tracking: Tracking
  squares: Squares
  sync(other: BoardInternal): void 
  applyAction(r: ActionDescriptor, mode: 'undo' | 'redo' | 'do'): void 
  kingsSquare(side: Side): Square
  reset(): void
}

class BoardImpl implements BoardInternal {

  private _canCapture: CanCaptureFunction

  tracking: Tracking = newTracking()
  squares: Squares 

  constructor(f: CanCaptureFunction, isObservable?: boolean) {

    this._canCapture = f
    if (isObservable) {

      makeObservable(this, {
        applyAction: action,
        reset: action,
        boardAsSquares: computed,
      })
    }
    this.squares = freshBoard(this.tracking, isObservable)
  }

  sync(other: BoardInternal): void {
    syncSquares(this.squares, other.squares) 
    syncTracking(this.tracking, other.tracking) 
  }

  pieceAt(sq: Square): Piece | null {
    return this.squares[sq.rank][sq.file].piece
  }
 
  colorAt(sq: Square): Color | null {
    if (this.squares[sq.rank][sq.file].piece) {
      return this.squares[sq.rank][sq.file].piece!.color
    }
    return null
  }

  sideIsInCheckFrom(side: Side): Square[] {
    return this._squareCanBeCaptureFrom(
      this.tracking[side].king,
      side,
      'squares'
    ) as Square[]
  }

  sideIsInCheck(side: Side): boolean {
    const result = 
     this._squareCanBeCaptureFrom(
      this.tracking[side].king,
      side,
      'boolean'
    ) as boolean

    return result
  }

  kingsSquare(side: Side): Square {
    return this.tracking[side].king
  }

  isClearAlongRank(from: Square, to: Square): boolean {

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
  
  isClearAlongFile(from: Square,  to: Square): boolean {

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
  
  isClearAlongDiagonal(from: Square, to: Square): boolean {
  
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

  squareCanBeCaptured(sq: Square, asSide: Side): boolean {
    return this._squareCanBeCaptureFrom(sq, asSide, 'boolean') as boolean
  }

  applyAction(desc: ActionDescriptor, mode: 'undo' | 'redo' | 'do'): void {

    if (desc.action === 'castle') {
      this._castle(desc, mode)
    }
    else if (mode === 'undo') {
      this._move(desc.to, desc.from, true)
      if (desc.action.includes('capture')) {
        this.squares[desc.to.rank][desc.to.file].piece = desc.captured!
      }
      if (desc.action.includes('promote')) {
          // the _move above just returned the piece to 'from'
        const self = this.squares[desc.from.rank][desc.from.file].piece!
        this.squares[desc.from.rank][desc.from.file].piece = {color: self.color, type: 'pawn'}
      }
    }
    else {
        // Note that _move also takes care of capture ;)
      this._move(desc.from, desc.to, (mode !== 'do'))
      if (desc.action.includes('promote')) {
        const self = this.squares[desc.to.rank][desc.to.file].piece!
        this.squares[desc.to.rank][desc.to.file].piece = {color: self.color, type: desc.promotedTo!}
      }
    }

    this._trackPrimaries(desc, mode)
  }

  reset(): void {

    this.tracking = newTracking()
    this.squares = freshBoard(this.tracking)
  }

  get boardAsSquares(): BoardSquare[] {
    const result: BoardSquare[] = []
    for (const rank of RANKS_REVERSE) {
      for (const file of FILES) {
        result.push(this.squares![rank][file]) 
      }
    }
    return result
  }
 
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  
  private _trackCastlingEligability(moved: Square): void {

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

  private _move(from: Square, to: Square, ignoreCastling?: boolean): void {

    if (!ignoreCastling) {
      this._trackCastlingEligability(from)
    }

    this.squares[to.rank][to.file].piece = this.squares[from.rank][from.file].piece
    this.squares[from.rank][from.file].piece = null 
  }

  private _castle(desc: ActionDescriptor, mode: 'undo' | 'redo' | 'do'): void {

    const castleSide = (desc.to.file === 'g') ? 'kingside' : 'queenside' 
    if (mode === 'undo') {
      if (desc.to.file === 'g') {
        this._move({...desc.from, file: 'g'}, desc.from, true)  
        this._move({...desc.from, file: 'f'}, {...desc.from, file: 'h'}, true) 
      }
      else {
        this._move({...desc.from, file: 'c'}, desc.from, true)  
        this._move({...desc.from, file: 'd'}, {...desc.from, file: 'a'}, true) 
      }
        // undo ineligabiliy for castling 
      const color = (desc.from.rank === 1) ? 'white' : 'black'
      this.tracking[color].castling.hasCastled = false 
        // just in case
      this.tracking[color].castling.kingHasMoved = false 
      this.tracking[color].castling.rookHasMoved[castleSide] = false
    }
    else {
      if (desc.to.file === 'g') {
        this._move(desc.from, {...desc.from, file: 'g'}, true)  
        this._move({...desc.from, file: 'h'}, {...desc.from, file: 'f'}, true) 
      }
      else {
        this._move(desc.from, {...desc.from, file: 'c'}, true)  
        this._move({...desc.from, file: 'a'}, {...desc.from, file: 'd'}, true) 
      }

        // make sure we can't castle twice
      this.tracking[(desc.from.rank === 1) ? 'white' : 'black'].castling.hasCastled = true 
    }
  }

  private _trackPrimaries(r: ActionDescriptor, mode: 'do' | 'undo' | 'redo'): void {

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
      const squares = this.tracking[side].primaries.get('rook')!
      if (r.to.file === 'g') {
        if (mode === 'undo') {
          const index = squares.findIndex((e) => (squaresEqual(e, {...r.from, file: 'f'})))
          if (index !== -1) {
            squares[index] = {...squares[index], file: 'h'}
          }
        }
        else {
          const index = squares.findIndex((e) => (squaresEqual(e, {...r.from, file: 'h'})))
          if (index !== -1) {
            squares[index] = {...r.from, file: 'f'}
          }
        }
      }
      else {
        if (mode === 'undo') {
          const index = squares.findIndex((e) => (squaresEqual(e, {...r.from, file: 'd'})))
          if (index !== -1) {
            squares[index] = {...squares[index], file: 'a'}
          }
        }
        else {
          const index = squares.findIndex((e) => (squaresEqual(e, {...r.from, file: 'a'})))
          if (index !== -1) {
            squares[index] = {...squares[index], file: 'd'}
          }
        }
      }
    }
    else {
      if (r.promotedTo) {
          // Track the new piece of the promoted to type.
          // Either create a new slot of it with the to square,
          // or destroy said slot if undo
        const squares = this.tracking[side].primaries.get(r.promotedTo)!
        if (mode === 'undo') {
            // remove the slot created for the piece promoted to. 
          const index = squares.findIndex((e) => (squaresEqual(e, r.to)))
          if (index !== -1) {
            squares.splice(index, 1)
          }
        } 
        else {
          // create another slot for the piece type promoted to.
          // (from piece was type 'pawn', so ignore)
          squares.push(r.to)
        } 
      } 
      if (r.action.includes('capture')) {
          // track the captured piece, if it is of interest
        if (PRIMARY_PIECES.includes(r.captured!.type)) {
          const squares = this.tracking[r.captured!.color].primaries.get(r.captured!.type as PrimaryPieceType)!
          const index = squares.findIndex((e) => (squaresEqual(e, r.to)))
          if (mode === 'undo') {
              // shouldn't find it, since we're undoing a capture
            if (index === -1) {
              squares.push(r.to)
            }
          }
          else {
            if (index !== -1) {
              squares.splice(index, 1)
            }
          }
        }
      }
      if (r.action === 'move' || r.action.includes('capture')) {
            // track the moved or capturing piece, if it is of interest
        if ((PRIMARY_PIECES as readonly string[]).includes(r.piece.type)) {
          const squares = this.tracking[side].primaries.get(r.piece.type as PrimaryPieceType)!
          if (mode === 'undo') {
            const index = squares.findIndex((e) => (squaresEqual(e, r.to)))
            if (index !== -1) {
              squares[index] = r.from
            }
          }
          else {
            const index = squares.findIndex((e) => (squaresEqual(e, r.from)))
            if (index !== -1) {
              squares[index] = r.to
            }
          }
        }
      }
    }
  }

  private _getSurroundingSquares(sq: Square) /* it returns what it returns ;) */ {

    const hasN = (sq: Square) => (sq.rank <= 7)
    const hasS = (sq: Square) => (sq.rank >= 2)
    const hasE = (sq: Square) => (FILES.indexOf(sq.file) <= 6)
    const hasW = (sq: Square) => (FILES.indexOf(sq.file) >= 1)

    const getNRank = (sq: Square): Rank => (sq.rank + 1 as Rank)
    const getSRank = (sq: Square): Rank => (sq.rank - 1 as Rank)
    const getEFile = (sq: Square): File => (FILES[FILES.indexOf(sq.file) + 1])
    const getWFile = (sq: Square): File => (FILES[FILES.indexOf(sq.file) - 1])

    return {
      N: hasN(sq) ? 
        { 
          rank: getNRank(sq), 
          file: sq.file, 
          piece: this.pieceAt({rank: getNRank(sq), file: sq.file})
        } : undefined,
      NE: (hasN(sq) && hasE(sq)) ? 
        { 
          rank: getNRank(sq), 
          file: getEFile(sq), 
          piece: this.pieceAt({rank: getNRank(sq), file: getEFile(sq)})
        } : undefined,
      E: (hasE(sq)) ? 
        { 
          rank: sq.rank, 
          file: getEFile(sq), 
          piece: this.pieceAt({ rank: sq.rank, file: getEFile(sq)})
        } : undefined,
      SE: (hasS(sq) && hasE(sq)) ? 
        { 
          rank: getSRank(sq), 
          file: getEFile(sq), 
          piece: this.pieceAt({rank: getSRank(sq), file: getEFile(sq)})
        } : undefined,
      S: (hasS(sq)) ? 
        { 
          rank: getSRank(sq), 
          file: sq.file, 
          piece: this.pieceAt({ rank: getSRank(sq), file: sq.file})
        } : undefined,
      SW: (hasS(sq) && hasW(sq)) ? 
        { 
          rank: getSRank(sq), 
          file: getWFile(sq), 
          piece: this.pieceAt({rank: getSRank(sq), file: getWFile(sq)})
        } : undefined,
      W: (hasW(sq)) ? 
        { 
          rank: sq.rank, 
          file: getWFile(sq), 
          piece: this.pieceAt({ rank: sq.rank, file: getWFile(sq)})
        } : undefined,
      NW: (hasN(sq) && hasW(sq)) ? 
        { 
          rank: getNRank(sq), 
          file: getWFile(sq), 
          piece: this.pieceAt({rank: getNRank(sq), file: getWFile(sq)})
        } : undefined,
        
      hasOpenDiagonal(): boolean {
        return (this.NE && !this.NE.piece) || (this.SE && !this.SE.piece) || (this.SW && !this.SW.piece) || (this.NW && !this.NW.piece)
      },
      hasOpenRankOrFile(): boolean {
        return (this.N && !this.N.piece) || (this.S && !this.S.piece) || (this.E && !this.E.piece) || (this.W && !this.W.piece)
      },
        // All other opposing piece will be explicitly checked from their cached positions.
      getOpposingPawnsOrKing(sideToCapture: Side): BoardSquare[] {

        const possibleSquaresForOppositePawns = (sideToCapture === 'white') ? [this.NE, this.NW] : [this.SE, this.SW] 
        const actualSquaresWithOppositePawns = possibleSquaresForOppositePawns.filter(
          (sqToTest) => (piecesExistAndAreEqual(sqToTest?.piece, {color: opponent(sideToCapture), type: 'pawn'}))
        )

        const possibleSquaresForOppositeKing = [this.N, this.NE, this.NW, this.S, this.SE, this.SW]
        const actualSquareWithOppositeKing = possibleSquaresForOppositeKing.find(
          (sqToTest) => (piecesExistAndAreEqual(sqToTest?.piece, {color: opponent(sideToCapture), type: 'king'}))
        )

        return actualSquareWithOppositeKing ? [...actualSquaresWithOppositePawns, actualSquareWithOppositeKing] : actualSquaresWithOppositePawns
      }
    }
  }

  private _squareCanBeCaptureFrom(
    sq: Square, 
    asSide: Side,
    booleanOrSquares: 'boolean' | 'squares' // boolean is faster
  ): Square[] | boolean {

    const primaryPieceDangers: Square[] = []
    const surrounding = this._getSurroundingSquares(sq)
    
    const typesToCheck: PrimaryPieceType[] = ['knight']
    if (surrounding.hasOpenDiagonal()) {
      typesToCheck.push('queen')
      typesToCheck.push('bishop')
    }
    if (surrounding.hasOpenRankOrFile()) {
      typesToCheck.push('rook')
      if (!typesToCheck.includes('queen')) {
        typesToCheck.push('queen')
      }
    }

    for (let pieceType of typesToCheck) {
      const squaresWithOpponentOfThisType = this.tracking[opponent(asSide)].primaries.get(pieceType)! 
      for (let sqToTryCaptureFrom of squaresWithOpponentOfThisType) {
        if (this._canCapture(this, pieceType, sqToTryCaptureFrom, sq) ) {
          if (booleanOrSquares === 'boolean') {
            return true
          }
          else {
            primaryPieceDangers.push(sqToTryCaptureFrom)
          }
        }  
      }
    }

    const nearDangers = surrounding.getOpposingPawnsOrKing(asSide)
    if (booleanOrSquares === 'boolean') {
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

const createBoard = (f: CanCaptureFunction, isObservable?: boolean): BoardInternal => (
  new BoardImpl(f, isObservable)
)

export { type Board as default, type BoardInternal, createBoard }  
