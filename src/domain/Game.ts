import {
  action,
  makeObservable, 
  observable, 
} from 'mobx'

import { 
  Board,
  MoveType,
  Player,
  Piece,
  PieceType,
  Square,
  Resolver,
  RANKS,
  RANKS_REVERSE,
  FILES,
  File
 } from './types'

 import { isClearAlongRank } from './resolvers/util'import { isGeneratorObject } from 'util/types'
./GameProvider

export interface Game {

  pieceAt(sq: Square): Piece | undefined

  canDrop(from: Square, to: Square): boolean
  drop(from: Square, to: Square): void

  moveType(from: Square, to: Square): MoveType

    // near vs far castle
  canCastle(from: Square, near: boolean): boolean
  castle(from: Square, near: boolean): void

  canBeCapturedFrom(toCapture: Square, p: Player): Square[]
  canBeCaptured(toCapture: Square, p: Player): boolean
  
  currentTurn(): Player
  won(p: Player): boolean
  
  boardAsSquares(): Square[]
}

class GameImpl implements Game {

  private _board: Board | undefined = undefined
  private _currentTurn: Player = 'white' 
  private _resolvers: Map<PieceType, Resolver> | undefined = undefined 
  private _canCastle = {
    white: {
      short: true,
      long: true
    },
    black: {
      short: true,
      long: true
    }
  }

  constructor(map: Map<PieceType, Resolver>) {

    this._resolvers = map

    makeObservable(this, {
      drop: action
    })

      // https://mobx.js.org/observable-state.html#limitations
    makeObservable<GameImpl, 
      '_board' |
      '_currentTurn'| 
      '_toggleTurn' | 
      '_move' | 
      '_resetGame' | 
      '_canCastle' | 
      '_trackCastling'
    >(this, {
      _board: observable,
      _currentTurn: observable,
      _canCastle: observable,
      _toggleTurn: action,
      _move: action,
      _resetGame: action,
      _trackCastling: action
    })

    this._resetGame()
  }

  private _resetGame(): void {


    const pieceFromInitialFile = (file: File):  PieceType | undefined => {
      let type: PieceType | undefined = undefined
      if (file === 'a' || file === 'h') {
        type = 'rook'
      }
      else if (file === 'c' || file === 'f') {
        type = 'bishop'
      }
      else if (file === 'b' || file === 'g') {
        type = 'knight'
      }
      else if (file === 'd') {
        type = 'queen'
      }
      else if (file = 'e') {
        type = 'king'
      }
      return type
    }

    this._board = undefined
    const result: any = {}
    for (const rank of RANKS) {
      const rankArray: any = {}
        // White pieces
      if (rank === 1) {
        for (const file of FILES) {
          rankArray[file] = { 
            rank,
            file
          }
          const type = pieceFromInitialFile(file)  
          if (type) {
            rankArray[file].piece = {
              type,
              color: 'white'
            } 
          }
        }
      }
        // White pawns
      else if (rank === 2) {
        for (const file of FILES) {
          rankArray[file] = {
            piece: {
              type: 'pawn',
              color: 'white'
            },
            rank,
            file
          }
        }
      }
        // Black pawns
      else if (rank === 7) {
        for (const file of FILES) {
          rankArray[file] = {
            piece: {
              type: 'pawn',
              color: 'black'
            },
            rank,
            file
          }
        }
      }
        // Black pawns
      else if (rank === 8) {
        for (const file of FILES) {
          rankArray[file] = { 
            rank,
            file
          }  
          const type = pieceFromInitialFile(file)  
          if (type) {
            rankArray[file].piece = {
              type,
              color: 'black'
            } 
          }
        }
      }
      else {
        for (const file of FILES) {
          rankArray[file] = { 
            rank,
            file
          }  
        }
      }
      result[rank] = rankArray
    } 
    this._board = result as Board
  }

  boardAsSquares(): Square[] {
    const result: Square[] = []
    for (const rank of RANKS_REVERSE) {
      for (const file of FILES) {
        result.push(this._board![rank][file]) 
      }
    }
    return result
  }

  private _toggleTurn(): void {
    this._currentTurn = (this._currentTurn === 'white') ? 'black' : 'white'
  }

  private _trackCastling(moved: Square): void {
    const fromPieace = this._board![moved.rank][moved.file].piece!

    if (fromPieace.type === 'king') {
      this._canCastle[fromPieace.color].short = false
      this._canCastle[fromPieace.color].long = false
    }
    else if (fromPieace.type === 'rook') {
      if (fromPieace.color === 'white') {
        if (moved.file === 'h' && moved.rank === 1 && this._canCastle[fromPieace.color].short) {
          this._canCastle[fromPieace.color].short = false
        }
        else if (moved.file === 'a' && moved.rank === 1 && this._canCastle[fromPieace.color].long) {
          this._canCastle[fromPieace.color].long = false
        }
      }
      else {
        if (moved.file === 'h' && moved.rank === 8 && this._canCastle[fromPieace.color].short) {
          this._canCastle[fromPieace.color].short = false
        }
        else if (moved.file === 'a' && moved.rank === 8 && this._canCastle[fromPieace.color].long) {
          this._canCastle[fromPieace.color].long = false
        }
      }
    }
  }

  private _move(
    from: Square, 
    to: Square, 
    ignoreCastling?: boolean
  ): void {

    if (!ignoreCastling) {
      this._trackCastling(from)
    }

    this._board![to.rank][to.file] = { 
      piece: {
        ...this._board![from.rank][from.file].piece!
      },
      rank: to.rank,
      file: to.file
    }
    this._board![from.rank][from.file] = { 
      piece: undefined,
      rank: from.rank,
      file: from.file
    }
  }

  currentTurn(): Player {
    return this._currentTurn
  }

  pieceAt(sq: Square): Piece | undefined {
    return this._board![sq.rank][sq.file].piece
  }
 

  moveType(
    from: Square, 
    to: Square, 
  ): MoveType {

    const fromPiece = this.pieceAt(from)
    const toPiece = this.pieceAt(to)

    if (fromPiece) {
      const resolver = this._resolvers!.get(fromPiece.type)

      if (resolver) {
        return resolver.moveType(
          this,
          from, 
          to, 
        )
      } 
    }
    return 'invalid'   
  }

  canDrop(from: Square, to: Square): boolean {
    return this.moveType(from, to) !== 'invalid'   
  }

  drop(from: Square, to: Square): void {
    const move = this.moveType(from, to)
    if (move !== 'invalid' ) {
      this._move(from, to)
      if (move === 'convert') {
        this._board![to.rank][to.file].piece!.type = 'queen'
      }
      if (move !== 'move') {
        const player = this._board![to.rank][to.file].piece!.color
        if (this.won(player)) {
          console.log(`Player ${player} WON!`)
          this._resetGame()
          return 
        }
      }
      this._toggleTurn()
    }
  }
    // toCapture need not be populated
  canBeCapturedFrom(toCapture: Square, p: Player): Square[] {
    const result: Square[] = []
    for (const rank of RANKS) {
      for (const file of FILES) {
        const piece = this.pieceAt({rank, file})
        if (piece && piece.color !== p) {
          const resolver = this._resolvers!.get(piece.type)
          const toCaptureFrom = {
            piece: {...piece},
            rank,
            file
          }
          if (resolver && resolver.canCapture(this, toCaptureFrom, toCapture)) {
            result.push(toCaptureFrom)
          }
        }
      }
    }
    return result
  }

  // from must be populated
  canBeCapturedAlongRank(from: Square, to: Square): boolean {
    if (from.rank === to.rank) {
      const delta = FILES.indexOf(to.file) - FILES.indexOf(from.file)
      if (delta < 0) {
          // zero based, but ok since indexed from FILES
        for (let fileIndex = FILES.indexOf(from.file) - 1; fileIndex > FILES.indexOf(to.file); fileIndex--) {
          if (this.canBeCaptured({rank: from.rank, file: FILES[fileIndex] }, from.piece!.color)) {
            return true
          }
        }
      }
      else {
          // zero based, but ok since indexed from FILES
        for (let fileIndex = FILES.indexOf(from.file) + 1; fileIndex < FILES.indexOf(to.file); fileIndex++) {
          if (this.canBeCaptured({rank: from.rank, file: FILES[fileIndex] }, from.piece!.color)) {
            return true
          }
        }
      }
    }
    return false
  }

  canBeCaptured(toCapture: Square, p: Player): boolean {
    return this.canBeCapturedFrom(toCapture, p).length > 0
  }

    // short vs long castle
    // assumes validity already tested
  castle(from: Square, short: boolean): void {
    if (from.piece!.color === 'white') {
      if (short) {
        this._move(from, {rank: 1, file: 'g'}, true)  // king
        this._move({rank: 1, file: 'h'}, {rank: 1, file: 'f'}, true) // rook
      }
      else {
        this._move(from, {rank: 1, file: 'c'}, true)  // king
        this._move({rank: 1, file: 'a'}, {rank: 1, file: 'd'}, true) // rook
      }
    }
    else {
      if (short) {
        this._move(from, {rank: 8, file: 'g'}, true)  // king
        this._move({rank: 8, file: 'h'}, {rank: 8, file: 'f'}, true) // rook
      }
      else {
        this._move(from, {rank: 8, file: 'c'}, true)  // king
        this._move({rank: 8, file: 'a'}, {rank: 8, file: 'd'}, true) // rook
      }
    }
    this._canCastle[from.piece!.color].short = false
    this._canCastle[from.piece!.color].long = false
  }

  canCastle(from: Square, short: boolean): boolean {
    // No need to test the position of 'from', since the this._canCastle flag 
    // indicates a move has taken place, same w position of participating rook
    const player = from.piece!.color
    let result: boolean = true

    if (player === 'white') {
      //const toPiece = this.pieceAt()
      result = (short) 
        ? 
        (
          this._canCastle.white.short 
          && 
          isClearAlongRank(this, from, {rank: 8, file: 'h'})
          &&
          this.canBeCapturedAlongRank(from, {rank: 8, file: 'h'})
        ) 
        : 
        (
          this._canCastle.white.long 
          && 
          isClearAlongRank(this, from, {rank: 8, file: 'a'})
          &&
          this.canBeCapturedAlongRank(from, {rank: 8, file: 'a'})
        )
    }
    else {
      result = (short) 
        ? 
        (
          this._canCastle.black.short 
          && 
          isClearAlongRank(this, from, {rank: 1, file: 'h'})
          &&
          this.canBeCapturedAlongRank(from, {rank: 1, file: 'h'})
        ) 
        : 
        (
          this._canCastle.black.long 
          && 
          isClearAlongRank(this, from, {rank: 1, file: 'a'})
          &&
          this.canBeCapturedAlongRank(from, {rank: 1, file: 'a'})
        )
    }
    return result
  }

    // TODO
  won(pl: Player): boolean {
    for (const rank of RANKS) {
      for (const file of FILES) {
        const piece = this.pieceAt({rank, file})
          // There is still the opponent's color on the board
        if (piece && piece.color !== pl) {
          return false
        }
      }
    }
    return true
  }
  
}

export default GameImpl
