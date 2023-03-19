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
import type Console from './Console'
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
  eligableToCastle(p: Side, kingside: boolean): boolean 
  
  newGame(): void
  currentTurn(): Side
  setConsole(c: Console): void

  won(p: Side): boolean
  
  boardAsSquares(): BoardSquare[]
}

class GameImpl implements Game {

  public static currentInstance: GameImpl | undefined = undefined

  private _board: Board | undefined = undefined
  private _currentTurn: Side = 'white' 
  private _resolvers: Map<PieceType, ActionResolver> | undefined = undefined 
  private _console: Console = {
    write: (t: string): void => {},
    writeln: (t?: string): void => {console.log(t)}
  }

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

  eligableToCastle(color: Side, kingside: boolean): boolean {
    const castleSide = kingside ? 'kingside' : 'queenside'
    const eligable = !this._castling[color].kingHasMoved && !this._castling[color].rookHasMoved[castleSide]
    if (!eligable) {
      const msg = `${color} is no longer eligable to castle ${castleSide} because \
        ${this._castling[color].kingHasMoved ? 'the king has moved' : ''}\
        ${this._castling[color].kingHasMoved && this._castling[color].rookHasMoved[castleSide] ? ' and ' : ''}\
        ${this._castling[color].rookHasMoved[castleSide] ? 'that rook has moved' : ''}!`
      this._console.writeln(msg)
    }
    return eligable
  }

  currentTurn(): Side {
    return this._currentTurn
  }

  setConsole(c: Console): void {
    this._console = c
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

      const involvesPromote = action.includes('promote')
      const promoteTo_ = !involvesPromote ? undefined : (promoteTo ? promoteTo : 'queen') 
      this._recordAction(
        from,
        to,
        action,
        promoteTo_
      )
      if (action === 'castle') {
        this._castle(from, to)
      }
      else {
          // Note that _move also takes care of capture ;)
        this._move(from, to)
        if (involvesPromote) {
          this._board![to.rank][to.file].piece!.type = promoteTo_
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
    this._console.writeln('Redoing: ' + this._actionRecordToLogString(record))

    if (record.action === 'castle') {
      this._castle(record.from, record.to)
    }
    else {
        // _move also takes care of capture ;)
      this._move(record.from, record.to)
      if (record.action === 'promote' || record.action === 'capture-promote' ) {
        this._board![record.to.rank][record.to.file].piece!.type = record.promotedTo
          
      }
    }
    this._toggleTurn()

  } 

  private _actionRecordToLogString(r: ActionRecord): string {

    if (r.action === 'castle') {
      return `${r.piece.color} castles ${r.to.file === 'g' ? 'kingside' : 'queenside'}`
    }
    let log = `${r.piece.color} ${r.piece.type} (${r.from.rank}${r.from.file}) `
    switch (r.action) {
      case 'capture':
        log += `captures ${r.captured!.type} (${r.to.rank}${r.to.file})`
      break
      case 'move':
        log += `moves to ${r.to.rank}${r.to.file}`
      break
      case 'promote':
        log += `is promoted to a ${r.promotedTo!} at ${r.to.rank}${r.to.file}`
      break
      case 'capture-promote':
        log += `captures ${r.captured!.type} and is promoted to a ${r.promotedTo!} at ${r.to.rank}${r.to.file}`
      break
    } 
    return log
  }

  private _recordAction(
    from: BoardSquare, 
    to: BoardSquare, 
    action: Action, 
    promotedTo?: PromotedPieceType
  ): void {
    if (this._stateIndex + 1 < this._actions.length) {
        // If we've undone actions since the most recent "actual" move,
        // truncate the stack since we can no longer meaningfully 
        // 'redo' actions more recent than the one we're currently on.
      this._actions.length = this._stateIndex + 1 
    }
    this._actions.push({
      piece: this._board[from.rank][from.file].piece,
        // prevent reference copies of Squares
      from: {...from}, 
      to: {...to},
      action,
      promotedTo,
      captured: (action === 'capture' || action === 'capture-promote') 
        ? 
        this._board[to.rank][to.file].piece 
        : 
        undefined
    })
    this._stateIndex = this._actions.length - 1

    this._console.writeln('Action: ' + this._actionRecordToLogString(this._actions[this._stateIndex]))
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

    this._console.writeln('Undoing: ' + this._actionRecordToLogString(record))
    if (record.action === 'castle') {
      this._undo_castle(record)
    }
    else {
      this._move(record.to, record.from, true)
      if (record.action.includes('capture')) {
        this._board![record.to.rank][record.to.file] = {
          ...record.to,
          piece: {
            ...record.captured!
          },
        }  
      }
      if (record.action.includes('promote')) {
        this._board![record.from.rank][record.from.file] = {
          ...record.from,
          piece: {
            color: record.piece.color,
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
