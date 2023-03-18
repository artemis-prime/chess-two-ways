import {
  action,
  computed,
  makeObservable, 
  observable, 
} from 'mobx'

import type Board from './Board'
import type Action from './Action'
import type Piece from './Piece'
import type { Color, PieceType, PromotedPieceType, Side } from './Piece'
import type Square from './Square'
import type BoardSquare from './BoardSquare'
import type ActionResolver from './ActionResolver'
import type ActionRecord from './ActionRecord'
import newBoard from './newBoard'
import registry from './resolverRegistry'
 
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
  undo(): void
  redo(): void
  get canUndo(): boolean
  get canRedo(): boolean

    // ('kingside' vs 'queenside')
  kingOrRookHasMoved(p: Side, kingside: boolean): boolean 
  
  newGame(): void
  currentTurn(): Side

  won(p: Side): boolean
  
  boardAsSquares(): BoardSquare[]
}

class GameImpl implements Game {

  public static currentInstance: GameImpl | undefined = undefined

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

  private _actions = [] as ActionRecord[] 
  
    // For managing undo / redo.  The index of the current state
    // within _actions.  -1 is the original state of the board.
    // That way, _action[0] is conveniently the first move
  private _stateIndex = -1 

  constructor(map: Map<PieceType, ActionResolver>) {

    this._resolvers = map

    makeObservable(this, {
      takeAction: action,
      newGame: action,
      undo: action,
      redo: action,
      canUndo: computed,
      canRedo: computed
    })

      // https://mobx.js.org/observable-state.html#limitations
    makeObservable<GameImpl, 
      '_board' |
      '_currentTurn'| 
      '_castling' | 
      '_toggleTurn' | 
      '_move' | 
      '_trackCastling' |
      '_stateIndex' |
      '_actions'
    >(this, {
      _board: observable,
      _currentTurn: observable,
      _castling: observable,
      _toggleTurn: action,
      _move: action,
      _trackCastling: action,
      _stateIndex: observable,
      _actions: observable
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


  takeAction(
    from: Square, 
    to: Square, 
    promoteTo?: PromotedPieceType
  ): void {

    const action = this.resolveAction(from, to)
    if (action) {

      this._recordAction(
        this._board![from.rank][from.file].piece!,
        from,
        to,
        action,
        this._secondPieceForRecord(
          from, 
          to, 
          action,
          promoteTo
        )
      )
      if (action === 'castle') {
        this._castle(from, to)
      }
      else {
          // _move also takes care of capture ;)
        this._move(from, to)
        if (action === 'promote') {
          this._board![to.rank][to.file].piece!.type = (promoteTo ? promoteTo : 'queen') 
            
        }
      }
      this._toggleTurn()
    }
  }

  get canUndo() {
    return this._stateIndex >= 0
  }

  undo() {
    if (this.canUndo) {
      this._undo(this._actions[this._stateIndex])
      this._stateIndex--
    }
  }

  get canRedo() {
    return this._stateIndex + 1 < this._actions.length
  }

  redo() {
    if (this.canRedo) {
      this._stateIndex++
      this._redo(this._actions[this._stateIndex])
    }
  }

  private _redo(record: ActionRecord) {
    if (record.action === 'castle') {
      this._castle(record.from, record.to)
    }
    else {
        // _move also takes care of capture ;)
      this._move(record.from, record.to)
      if (record.action === 'promote') {
        this._board![record.to.rank][record.to.file].piece!.type = (record.secondPiece ? record.secondPiece.type : 'queen') 
          
      }
    }
    this._toggleTurn()

  } 


  private _secondPieceForRecord(
    from: Square, 
    to: Square, 
    action: Action, 
    promoteTo?: PromotedPieceType
  ): Piece | undefined {
    return (action === 'capture') 
    ?
      // who did we capture?
    this._board![to.rank][to.file].piece!
    :
    (
      (action === 'promote')
        ?
          // who did we promote a pawn to?  
          // if not supplied, then default to queen 
        (promoteTo 
          ? 
          {type: promoteTo, color: this._board![from.rank][from.file].piece!.color} 
          : 
          {type: 'queen' as PieceType, color: this._board![from.rank][from.file].piece!.color}
        ) 
        :
        undefined
    ) 
  }

  private _recordAction(
    piece: Piece, 
    from: Square, 
    to: Square, 
    action: Action, 
    secondPiece?: Piece
  ): void {
    if (this._stateIndex + 1 < this._actions.length) {
        // If we've undone actions since the most recent "actual" move,
        // truncate the stack since we can no longer meaningfully 
        // 'redo' actions more recent than the one we're currently on.
      this._actions.length = this._stateIndex + 1 
    }
    this._actions.push({
      piece,
        // prevent reference copies of Squares
      from: {...from}, 
      to: {...to},
      action,
      secondPiece
    })
    this._stateIndex = this._actions.length - 1
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
      ...to,
      piece: {
        ...this._board![from.rank][from.file].piece!
      },
    }
    this._board![from.rank][from.file] = { 
      ...from,
      piece: undefined,
    }
  }

  private _undo(record: ActionRecord): void {
    if (record.action === 'castle') {
      this._undo_castle(record)

    }
    else {
      this._move(record.to, record.from, true)
      if (record.action === 'capture') {
        this._board![record.to.rank][record.to.file] = {
          ...record.to,
          piece: {
            ...record.secondPiece!
          },
        }  
      }
      else if (record.action === 'promote') {
        this._board![record.to.rank][record.to.file] = {
          ...record.to,
          piece: {
            color: record.secondPiece!.color,
            type: 'pawn'
          },
        }  
      }
    }
    this._toggleTurn()
  }

  private _castle(from: Square, to: Square): void {
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

  private _undo_castle(record: ActionRecord): void {
    let castleSide: 'kingside' | 'queenside' 
    if (record.to.file === 'g') {
      castleSide = 'kingside'
      this._move({rank: record.from.rank, file: 'g'}, record.from, true)  
      this._move({rank: record.from.rank, file: 'f'}, {rank: record.from.rank, file: 'h'}, true) 
    }
    else {
      castleSide = 'queenside'
      this._move({rank: record.from.rank, file: 'c'}, record.from, true)  
      this._move({rank: record.from.rank, file: 'd'}, {rank: record.from.rank, file: 'a'}, true) 
    }
      // undo ineligabiliy for castling 
    const color = (record.from.rank === 1) ? 'white' : 'black'
    this._castling[color].kingHasMoved = false 
    this._castling[color].rookHasMoved[castleSide] = false
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

const getGameSingleton = () => {
  if (!GameImpl.currentInstance) {
    GameImpl.currentInstance = new GameImpl(registry) 
  }
  return GameImpl.currentInstance
}

export {
  getGameSingleton,
  type Game as default  
}
