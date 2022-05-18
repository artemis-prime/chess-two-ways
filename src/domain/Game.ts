import {
  action,
  makeObservable, 
  observable, 
} from 'mobx'
import queen from './resolvers/queen'

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

export interface Game {

  pieceAt(sq: Square): Piece | undefined

  canDrop(from: Square, to: Square): boolean
  drop(from: Square, to: Square): void

  moveType(from: Square, to: Square): MoveType
  
  currentTurn(): Player
  won(p: Player): boolean
  
  boardAsSquares(): Square[]
}

class GameImpl implements Game {

  private _board: Board | undefined = undefined
  private _currentTurn: Player = 'white' 
  private _resolvers: Map<PieceType, Resolver> | undefined = undefined 

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
      '_resetGame'
    >(this, {
      _board: observable,
      _currentTurn: observable,
      _toggleTurn: action,
      _move: action,
      _resetGame: action
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

  private _move(
    from: Square, 
    to: Square, 
  ): void {
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
        return resolver(
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
