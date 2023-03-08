import {
  action,
  makeObservable, 
  observable, 
} from 'mobx'

import Board from './Board'
import Action from './Action'
import Piece, { Color, PieceType, Side }  from './Piece'
import Square from './Square'
import BoardSquare from './BoardSquare'
import ActionResolver from './ActionResolver'
import newBoard from './newBoard'

import {
  RANKS,
  RANKS_REVERSE,
  FILES,
 } from './RankAndFile'

 interface Game {

  pieceAt(sq: Square): Piece | undefined
  colorAt(sq: Square): Color | undefined 

  resolveAction(from: Square, to: Square): Action | undefined
  takeAction(from: Square, to: Square): void

    // ('kingside' vs 'queenside')
  kingOrRookHasMoved(p: Side, kingside: boolean): boolean 
  
  newGame(): void
  currentTurn(): Side
  won(p: Side): boolean
  
  boardAsSquares(): BoardSquare[]
}

export class GameImpl implements Game {

  private _board: Board | undefined = undefined
  private _currentTurn: Side = 'white' 
  private _resolvers: Map<PieceType, ActionResolver> | undefined = undefined 

  private _castling = {
    white: {
      kingHasMoved: false,
      rookHasMoved: {
        kingside: false,
        queenside: false
      }
    },
    black: {
      kingHasMoved: false,
      rookHasMoved: {
        kingside: false,
        queenside: false
      }
    },
  }

  constructor(map: Map<PieceType, ActionResolver>) {

    this._resolvers = map

    makeObservable(this, {
      takeAction: action,
      newGame: action
    })

      // https://mobx.js.org/observable-state.html#limitations
    makeObservable<GameImpl, 
      '_board' |
      '_currentTurn'| 
      '_castling' | 
      '_toggleTurn' | 
      '_move' | 
      '_trackCastling'
    >(this, {
      _board: observable,
      _currentTurn: observable,
      _castling: observable,
      _toggleTurn: action,
      _move: action,
      _trackCastling: action
    })

    this.newGame()
  }

  public newGame(): void {

    this._board = newBoard()
  }

  boardAsSquares(): BoardSquare[] {
    const result: BoardSquare[] = []
    for (const rank of RANKS_REVERSE) {
      for (const file of FILES) {
        result.push(this._board![rank][file]) 
      }
    }
    return result
  }

  kingOrRookHasMoved(color: Side, kingside: boolean): boolean {
    return this._castling[color].kingHasMoved || this._castling[color].rookHasMoved[kingside ? 'kingside' : 'queenside']
  }

  private _toggleTurn(): void {
    this._currentTurn = (this._currentTurn === 'white') ? 'black' : 'white'
  }

  private _trackCastling(moved: Square): void {
    const fromPieace = this._board![moved.rank][moved.file].piece!

    if (fromPieace.type === 'king') {
      this._castling[fromPieace.color].kingHasMoved = true
    }
    else if (fromPieace.type === 'rook') {
      if (moved.file === 'h') {
        this._castling[fromPieace.color].rookHasMoved.kingside = true
      }
      else if (moved.file === 'a') {
        this._castling[fromPieace.color].rookHasMoved.queenside = true
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

  currentTurn(): Side {
    return this._currentTurn
  }

  pieceAt(sq: Square): Piece | undefined {
    return this._board![sq.rank][sq.file].piece
  }
 
  colorAt(sq: Square): Color | undefined {
    if (this._board![sq.rank][sq.file].piece) {
      return this._board![sq.rank][sq.file].piece!.color
    }
    return undefined
  }

  resolveAction(
    from: Square, 
    to: Square, 
  ): Action | undefined {

    const fromPiece = this.pieceAt(from)
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
    return undefined   
  }

  takeAction(from: Square, to: Square): void {
    const action = this.resolveAction(from, to)
    if (action) {
      if (action === 'castle') {
        this._castle(from, to)
      }
      else {
        this._move(from, to)
        if (action === 'convert') {
          this._board![to.rank][to.file].piece!.type = 'queen'
        }
        if (action !== 'move') {
          const player = this._board![to.rank][to.file].piece!.color
          if (this.won(player)) {
            console.log(`Side ${player} WON!`)
            this.newGame()
            return 
          }
        }
      }
      this._toggleTurn()
    }
  }

  _castle(from: Square, to: Square): void {
    if (to.file === 'g') {
      this._move(from, {rank: from.rank, file: 'g'}, true)  
      this._move({rank: from.rank, file: 'h'}, {rank: from.rank, file: 'f'}, true) 
    }
    else {
      this._move(from, {rank: from.rank, file: 'c'}, true)  
      this._move({rank: from.rank, file: 'a'}, {rank: from.rank, file: 'd'}, true) 
    }
      // make sure we can't castle twice
    this._castling[(from.rank === 1) ? 'white' : 'black'].kingHasMoved = true 
  }

    // TODO
  won(pl: Side): boolean {
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

export default Game
