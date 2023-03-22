import {
  action,
  computed,
  makeObservable, 
  observable, 
} from 'mobx'

import type Square from '../Square'
import { PRIMARY_PIECES } from '../Piece'
import type BoardSquare from '../BoardSquare'

import type ActionDescriptor from '../game/ActionDescriptor'
import type CanCaptureFunction from '../game/CanCaptureFunction'
import type { 
  default as Piece, 
  Color, 
  PrimaryPieceType, 
  Side 
} from '../Piece'
import {
  type Rank,
  RANKS_REVERSE,
  FILES,
} from '../RankAndFile'
import { sameSquare } from '../util'

import {type Tracking, newTracking} from './Tracking'
import type Squares from './Squares'
import freshBoard from './freshBoard'

interface Board {

  pieceAt(sq: Square): Piece | undefined
  colorAt(sq: Square): Color | undefined 
  
    // 'eligible' | <reason ineligable> (clearer w this return type syntax)
    // 'kingside' vs 'queenside'
  castlingEligability(p: Side, kingside: boolean): 'eligible' | string 

    // If an 'as' piece is in 'sq', can it be captured? 
  canBeCaptured(sq: Square, as: Side): boolean 

    // 'side' is in check from Square[] (or empty array)
  inCheck(side: Side) : Square[] 

    // Utility method for easy rendering (mobx 'computed')
  get boardAsSquares(): BoardSquare[]

  isClearAlongRank(from: Square, to: Square): boolean
  isClearAlongFile(from: Square, to: Square): boolean
  isClearAlongDiagonal(from: Square, to: Square): boolean
}

  // This interface is visable to GameImpl, but not to any UI
interface BoardInternal extends Board {

  applyAction(r: ActionDescriptor, mode: 'undo' | 'redo' | 'do'): void 
  kingsLocation(side: Color): Square
  reset(): void
}

class BoardImpl implements BoardInternal {

  private _tracking: Tracking = newTracking()
  private _squares: Squares = freshBoard(this._tracking)
  private _canCapture: CanCaptureFunction

  constructor(f: CanCaptureFunction, isObservable?: boolean) {

    this._canCapture = f
    if (isObservable) {

      makeObservable(this, {
        applyAction: action,
        reset: action,
        boardAsSquares: computed,
      })
        // Limitation of Typescript, cf: https://mobx.js.org/observable-state.html#limitations
      makeObservable<BoardImpl, '_squares'>(this, {_squares: observable})
    }
  }

  pieceAt(sq: Square): Piece | undefined {
    return this._squares[sq.rank][sq.file].piece
  }
 
  colorAt(sq: Square): Color | undefined {
    if (this._squares[sq.rank][sq.file].piece) {
      return this._squares[sq.rank][sq.file].piece!.color
    }
    return undefined
  }

  inCheck(side: Side): BoardSquare[] {
    return this._canBeCapturedFrom(
      this._tracking[side].king,
      side,
      'squares'
    ) as BoardSquare[]
  }

  kingsLocation(side: Color): Square {
    return this._tracking[side].king
  }

  isClearAlongRank(from: Square, to: Square): boolean {

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
  
  isClearAlongFile(from: Square,  to: Square): boolean {

    if (FILES.indexOf(from.file) === FILES.indexOf(to.file)) {
      const delta = to.rank - from.rank
      if (delta < 0) {
          // one-based
        for (let rank = from.rank - 1; rank > to.rank; rank--) {
          if (!!this._squares[rank][from.file].piece) {
            return false
          }
        }
      }
      else {
          // one-based
        for (let rank = from.rank + 1; rank < to.rank; rank++) {
          if (!!this._squares[rank][from.file].piece) {
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
        if (!!this._squares[rank][FILES[fileIndex]].piece) {
          return false
        }
      }
    }
      // --> SE
    else if (deltaFile > 0 && deltaRank < 0) {
      for (let rank = from.rank - 1, fileIndex = FILES.indexOf(from.file) + 1; rank > to.rank && fileIndex < FILES.indexOf(to.file); rank--, fileIndex++) {
        if (!!this._squares[rank][FILES[fileIndex]].piece) {
          return false
        }
      }
    }
      // --> SW
    else if (deltaFile < 0 && deltaRank < 0) {
      for (let rank = from.rank - 1, fileIndex = FILES.indexOf(from.file) - 1; rank > to.rank && fileIndex > FILES.indexOf(to.file);  rank--, fileIndex--) {
        if (!!this._squares[rank][FILES[fileIndex]].piece) {
          return false
        }
      }
    }
      // --> NW
      else if (deltaFile < 0 && deltaRank > 0) {
        for (let rank = from.rank + 1, fileIndex = FILES.indexOf(from.file) - 1; rank < to.rank && fileIndex > FILES.indexOf(to.file); rank++, fileIndex--) {
          if (!!this._squares[rank][FILES[fileIndex]].piece) {
            return false
          }
        }
      }
    return true
  }

  castlingEligability(side: Side, kingside: boolean): 'eligible' | string {

    const castleSide = kingside ? 'kingside' : 'queenside'
    const { hasCastled, kingHasMoved } = this._tracking[side].castling
    const rookHasMoved = this._tracking[side].castling.rookHasMoved[castleSide]
    const eligable = !hasCastled && !kingHasMoved && !rookHasMoved

    return (eligable) ? 'eligable' : (
      `${side} is no longer eligable to castle\
      ${(kingHasMoved || hasCastled) ?  '' : ` ${castleSide}`} because \
      ${(hasCastled) ? 'it has already castled!' : (kingHasMoved ? 'the king has moved!' : 'that rook has moved!')}`
    )
  }

  canBeCaptured(squareToCapture: Square, sideToCapture: Side): boolean {
    return this._canBeCapturedFrom(squareToCapture, sideToCapture, 'boolean') as boolean
  }

  applyAction(desc: ActionDescriptor, mode: 'undo' | 'redo' | 'do'): void {

    if (desc.action === 'castle') {
      this._castle(desc, mode)
    }
    else if (mode === 'undo') {
      this._move(desc.to, desc.from, true)
      if (desc.action.includes('capture')) {
        this._squares[desc.to.rank][desc.to.file].piece = desc.captured
      }
      if (desc.action.includes('promote')) {
        const self = this._squares[desc.from.rank][desc.from.file].piece
        this._squares[desc.from.rank][desc.from.file].piece = {...self, type: 'pawn'}
      }
    }
    else {
        // Note that _move also takes care of capture ;)
      this._move(desc.from, desc.to, (mode !== 'do'))
      if (desc.action.includes('promote')) {
        const self = this._squares[desc.to.rank][desc.to.file].piece
        this._squares[desc.to.rank][desc.to.file].piece = {...self, type: desc.promotedTo}
      }
    }

    this._trackPrimaries(desc, mode)
  }

  reset(): void {

    this._tracking = newTracking()
    this._squares = freshBoard(this._tracking)
  }

  get boardAsSquares(): BoardSquare[] {
    const result: BoardSquare[] = []
    for (const rank of RANKS_REVERSE) {
      for (const file of FILES) {
        result.push(this._squares![rank][file]) 
      }
    }
    return result
  }
 
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  
  private _trackCastlingEligability(moved: Square): void {

    const fromPieace = this._squares[moved.rank][moved.file].piece

    if (fromPieace?.type === 'king') {
      this._tracking[fromPieace!.color].castling.kingHasMoved = true
    }
    else if (fromPieace?.type === 'rook') {
      if (moved.file === 'h') {
        this._tracking[fromPieace.color].castling.rookHasMoved.kingside = true
      }
      else if (moved.file === 'a') {
        this._tracking[fromPieace.color].castling.rookHasMoved.queenside = true
      }
    }
  }

  private _move(from: Square, to: Square, ignoreCastling?: boolean): void {

    if (!ignoreCastling) {
      this._trackCastlingEligability(from)
    }

    this._squares[to.rank][to.file].piece = this._squares[from.rank][from.file].piece
    this._squares[from.rank][from.file].piece = undefined 
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
      this._tracking[color].castling.hasCastled = false 
        // just in case
      this._tracking[color].castling.kingHasMoved = false 
      this._tracking[color].castling.rookHasMoved[castleSide] = false
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
      this._tracking[(desc.from.rank === 1) ? 'white' : 'black'].castling.hasCastled = true 
    }
  }

  private _trackPrimaries(r: ActionDescriptor, mode: 'do' | 'undo' | 'redo'): void {

    const side = r.piece.color
    if (r.piece.type === 'king') {
      if (mode === 'undo') {
        this._tracking[side].king = r.from
      }
      else {
        this._tracking[side].king = r.to
      }
    }
    if (r.action === 'castle') {
        // track the rook
      const squares = this._tracking[side].primaries.get('rook')
      if (r.to.file === 'g') {
        if (mode === 'undo') {
          const index = squares.findIndex((e) => (sameSquare(e, {...r.from, file: 'f'})))
          if (index !== -1) {
            squares[index] = {...squares[index], file: 'h'}
          }
        }
        else {
          const index = squares.findIndex((e) => (sameSquare(e, {...r.from, file: 'h'})))
          if (index !== -1) {
            squares[index] = {...r.from, file: 'f'}
          }
        }
      }
      else {
        if (mode === 'undo') {
          const index = squares.findIndex((e) => (sameSquare(e, {...r.from, file: 'd'})))
          if (index !== -1) {
            squares[index] = {...squares[index], file: 'a'}
          }
        }
        else {
          const index = squares.findIndex((e) => (sameSquare(e, {...r.from, file: 'a'})))
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
        const squares = this._tracking[side].primaries.get(r.promotedTo)
        if (mode === 'undo') {
            // remove the slot created for the piece promoted to. 
          const index = squares.findIndex((e) => (sameSquare(e, r.to)))
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
        if (PRIMARY_PIECES.includes(r.captured.type)) {
          const squares = this._tracking[r.captured.color].primaries.get(r.captured.type as PrimaryPieceType)
          const index = squares.findIndex((e) => (sameSquare(e, r.to)))
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
          const squares = this._tracking[side].primaries.get(r.piece.type as PrimaryPieceType)
          if (mode === 'undo') {
            const index = squares.findIndex((e) => (sameSquare(e, r.to)))
            if (index !== -1) {
              squares[index] = r.from
            }
          }
          else {
            const index = squares.findIndex((e) => (sameSquare(e, r.from)))
            if (index !== -1) {
              squares[index] = r.to
            }
          }
        }
      }
    }
  }

  private _getSurroundingSquares(sq: Square) {

    return {
      N: (sq.rank <= 7) ? { rank: sq.rank + 1, file: sq.file, piece: this.pieceAt({rank: sq.rank + 1 as Rank, file: sq.file})} : undefined,
      NE: (sq.rank <= 7 && FILES.indexOf(sq.file) <= 6) ? { rank: sq.rank + 1, file: FILES[FILES.indexOf(sq.file) + 1], piece: this.pieceAt({rank: sq.rank + 1 as Rank, file: FILES[FILES.indexOf(sq.file) + 1]})} : undefined,
      E: (FILES.indexOf(sq.file) <= 6) ? { rank: sq.rank, file: FILES[FILES.indexOf(sq.file) + 1], piece: this.pieceAt({ rank: sq.rank, file: FILES[FILES.indexOf(sq.file) + 1]})} : undefined,
      SE: (sq.rank > 2 && FILES.indexOf(sq.file) <= 6) ? { rank: sq.rank - 1, file: FILES[FILES.indexOf(sq.file) + 1], piece: this.pieceAt({ rank: sq.rank - 1 as Rank, file: FILES[FILES.indexOf(sq.file) + 1]})} : undefined,
      S: (sq.rank > 2) ? { rank: sq.rank - 1, file: sq.file, piece: this.pieceAt({ rank: sq.rank - 1 as Rank, file: sq.file})} : undefined,
      SW: (sq.rank > 2 && FILES.indexOf(sq.file) >= 1) ? { rank: sq.rank - 1, file: FILES[FILES.indexOf(sq.file) - 1]} : undefined,
      W: (FILES.indexOf(sq.file) >= 1) ? { rank: sq.rank, file: FILES[FILES.indexOf(sq.file) - 1], piece: this.pieceAt({ rank: sq.rank, file: FILES[FILES.indexOf(sq.file) - 1]})} : undefined,
      NW: (sq.rank <= 7 && FILES.indexOf(sq.file) >= 1) ? { rank: sq.rank + 1, file: FILES[FILES.indexOf(sq.file) - 1], piece: this.pieceAt({ rank: sq.rank + 1 as Rank, file: FILES[FILES.indexOf(sq.file) - 1]})} : undefined,
      hasOpenDiagonal(): boolean {
        return (this.NE && !this.NE.piece) || (this.SE && !this.SE.piece) || (this.SW && !this.SW.piece) || (this.NW && !this.NW.piece)
      },
      hasOpenRankOrFile(): boolean {
        return (this.N && !this.N.piece) || (this.S && !this.S.piece) || (this.S && !this.SW.piece) || (this.N && !this.NW.piece)
      },
      getOpposingPawnsOrKing(sideToCapture: Side): BoardSquare[] {
        const squares: BoardSquare[] = []
        if (sideToCapture === 'white') {
          if (this.NE && this.NE.piece && this.NE.piece!.color === 'black' && (this.NE.piece!.type === 'pawn' || this.NE.piece!.type === 'king')) {
            squares.push(this.NE)
          } 
          if (this.NW && this.NW.piece && this.NW.piece!.color === 'black' && (this.NW.piece!.type === 'pawn' || this.NW.piece!.type === 'king')) {
            squares.push(this.NW)
          } 
        }
        else {
          if (this.SE && this.SE.piece && this.SE.piece!.color === 'white' && (this.SE.piece!.type === 'pawn' || this.SE.piece!.type === 'king')) {
            squares.push(this.SE)
          } 
          if (this.SW && this.SW.piece && this.SW.piece!.color === 'white' && (this.SW.piece!.type === 'pawn' || this.SW.piece!.type === 'king')) {
            squares.push(this.SW)
          } 
        }
        return squares
      }
    }
  }

    // If a piece from sideToCapture moved to squareToCapture,
    // what Squares could it be captured from?
    // Useful for checking the ability to castle (can't castle into or through check),
    // or to test for check. 
  private _canBeCapturedFrom(
    sq: Square, 
    sideToCapture: Side,
    booleanOrSquares: 'boolean' | 'squares' // boolean is faster
  ): Square[] | boolean {

    const allCapturingSquares: Square[] = []

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
      const squaresWithOpponent = this._tracking[sideToCapture === 'white' ? 'black' : 'white'].primaries.get(pieceType) 
      if (squaresWithOpponent.length) {
        for (let tryCaptureFrom of squaresWithOpponent) {
          if (this._canCapture(this, pieceType, tryCaptureFrom, sq) ) {
            if (booleanOrSquares === 'boolean') {
              return true
            }
            else {
              allCapturingSquares.push(tryCaptureFrom)
            }
          }  
        }
      } 
    }

    const nearDangers = surrounding.getOpposingPawnsOrKing(sideToCapture)
    if (booleanOrSquares === 'boolean') {
      return nearDangers.length > 0
    }
    return [...allCapturingSquares, ...nearDangers]
  }
}

const createBoard = (f: CanCaptureFunction, isObservable?: boolean): BoardInternal => (
  new BoardImpl(f, isObservable)
)

export { type Board as default, type BoardInternal, createBoard }  
