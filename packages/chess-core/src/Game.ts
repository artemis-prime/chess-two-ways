import {
  action,
  computed,
  makeObservable, 
  observable, 
} from 'mobx'

import type { default as Board, BoardInternal } from './Board'
import { createBoard } from './Board'
import type Move from './Move'
import { movesEqual } from './Move'
import type Action from './Action'
import type { PieceType, PrimaryPieceType, Side } from './Piece'
import { opponent } from './Piece'
import type Position from './Position'
import { copyPosition, positionToString } from './Position'
import type ChessListener from './ChessListener'

import type ActionResolverFn from './game/ActionResolverFn'
import type ActionRecord from './ActionRecord'
import Resolution from './game/Resolution'
import Notifier from './game/Notifier'

import registry from './game/resolverRegistry'
import { actionRecordToLAN } from './util'

interface Game {

    // Determine which valid action is intended by the move. 
    // Could be used during drag'n'drop canDropOnMe() type functions.
    // 
    // Resolved Action should cached for same move until:
    //  1) takeAction() is called for the same move
    //  2) endResolution() is called 
    // (This is akin to debouncing but not specific to web)
  resolveAction(m: Move): Action | null
  takeAction(m: Move): void
  endResolution(): void
  
  undo(): void
  redo(): void

  get canUndo(): boolean
  get canRedo(): boolean
  
  reset(): void
  get currentTurn(): Side

  listenTo(l: ChessListener, uniqueId: string): void

  getBoard(): Board
}

class GameImpl implements Game {

  public static currentInstance: GameImpl 

  private _mainBoard: BoardInternal
  private _checkCheckingBoard: BoardInternal

  private _currentTurn: Side = 'white' 
  private _resolvers: Map<PieceType, ActionResolverFn>  = registry 
  private _actions = [] as ActionRecord[] 
    // For managing undo / redo.  The index of the current state
    // within _actions.  -1 is the original state of the board.
    // That way, _action[0] is conveniently the first move,
    // and you can move back and forth via undo / redo
  private _stateIndex = -1 
  private _cachedResolution: Resolution | null = null 

  private _notifier: Notifier = new Notifier() 

  constructor() {

    this._mainBoard = createBoard(this._canCapture.bind(this), true)
    this._checkCheckingBoard = createBoard(this._canCapture.bind(this))
  
    makeObservable(this, {
      takeAction: action,
      reset: action,
      undo: action,
      redo: action,
      canUndo: computed,
      canRedo: computed,
      currentTurn: computed
    })

      // https://mobx.js.org/observable-state.html#limitations
    makeObservable<GameImpl, 
      '_currentTurn'| 
      '_toggleTurn' | 
      '_stateIndex' |
      '_actions'
    >(this, {
      _currentTurn: observable,
      _toggleTurn: action,
      _stateIndex: observable,
      _actions: observable
    })
  }

  getBoard(): Board {
    return this._mainBoard
  }

  reset() {
    this._currentTurn = 'white'
    this._mainBoard.reset()
    this._checkCheckingBoard.reset()
    this._actions = [] as ActionRecord[]
    this._stateIndex = -1 
  }

  get currentTurn(): Side {
    return this._currentTurn
  }

  listenTo(l: ChessListener, uniqueId: string): void {
    this._notifier.listenTo(l, uniqueId)
  }

    // Do not call directly.  Passed to Board instance to 
    // implement checkChecking
  private _canCapture(board: Board, pieceType: PieceType, from: Position, to: Position): boolean {
    let result: Action | null = null
    const resolver = this._resolvers.get(pieceType)

    if (resolver) {
      result = resolver(board, from, to)
    } 
    return !!result?.includes('capture')
  }

  resolveAction(move: Move): Action | null {

    if (!this._cachedResolution || !movesEqual(this._cachedResolution!.move, move)) {
      if (!move.piece) {
        this._notifier.message(`There's no piece at ${positionToString}!`, 'mutable-warning') 
      }
      const resolver = this._resolvers.get(move.piece?.type)
      let action: Action | null = null
      if (resolver) {
        this._checkCheckingBoard.sync(this._mainBoard)
        action = resolver(this._checkCheckingBoard, move.from, move.to, this._notifier.message.bind(this._notifier))
        if (action) {
          const wasInCheck = this._mainBoard.sideIsInCheck(move.piece.color) 
          const r = this._createActionRecord(move, action)
          this._checkCheckingBoard.applyAction(r, 'do')
          if (this._checkCheckingBoard.sideIsInCheck(r.piece.color)) {
            this._notifier.message(`${actionRecordToLAN(r)} not possible as it would ` +
              `${wasInCheck ? 'leave you' : 'put you'} in check!`, 'mutable-warning')  
            action = null
          }
        } 
        this._notifier.actionResolved(move, action)
      } 
      this._cachedResolution = new Resolution(move, action)
    }
    return this._cachedResolution!.action
  }

  endResolution(): void {
    this._cachedResolution = null
    //console.log('End resolution called')
  }

  takeAction(
    move: Move,
    promoteTo?: PrimaryPieceType
  ): void {

    const action = this._cachedResolution?.action
    if (action) {
        this.endResolution()
        const r = this._createActionRecord(move, action, promoteTo)
        this._mainBoard.applyAction(r, 'do')
        this._notifier.actionTaken(r)
        if (this._stateIndex + 1 < this._actions.length) {
            // If we've undone actions since the most recent "actual" move,
            // truncate the stack since we can no longer meaningfully 
            // 'redo' actions more recent than the one we're currently on.
          this._actions.length = this._stateIndex + 1 
        }
        this._actions.push(r)
        this._stateIndex = this._actions.length - 1
        this._handleNotifyCheck(opponent(r.piece.color))
        this._toggleTurn()
    }
  }

  get canUndo() {
    return this._stateIndex >= 0
  }

  undo() {
    if (this.canUndo) {
      const r = this._actions[this._stateIndex]
      this._mainBoard.applyAction(r, 'undo')
      this._notifier.actionUndon(r)
      this._handleNotifyCheck(r.piece.color)
      this._stateIndex--
      this._toggleTurn()
    }
  }

  get canRedo() {
    return this._stateIndex + 1 < this._actions.length
  }

  redo() {
    if (this.canRedo) {
      this._stateIndex++
      const r = this._actions[this._stateIndex]
      this._mainBoard.applyAction(r, 'redo')
      this._notifier.actionRedon(r)
      this._handleNotifyCheck(opponent(r.piece.color))
      this._toggleTurn()
    }
  }

  private _createActionRecord(
    move: Move,
    action: Action,
    promoteTo?: PrimaryPieceType, 
  ): ActionRecord {
      // deep copy all
    return {
      piece: {...move.piece},
      from: copyPosition(move.from), 
      to: copyPosition(move.to),
      action,
      promotedTo: action.includes('promote') ? (promoteTo ? promoteTo : 'queen') : undefined,
      captured: (action === 'capture' || action === 'capture-promote') 
        ? 
        {...this._mainBoard.pieceAt(move.to)!} 
        : 
        undefined
    }
  }

  private _handleNotifyCheck(side: Side): void {

    const positionsInCheckFrom = this._mainBoard.sideIsInCheckFrom(side)
    if (positionsInCheckFrom.length) {
      this._notifier.inCheck(side, this._mainBoard.kingsPosition(side), positionsInCheckFrom)
    }
    else {
      this._notifier.notInCheck(side)  
    }
  }

  private _toggleTurn(): void {
    this._currentTurn = (this._currentTurn === 'white') ? 'black' : 'white'
  }
  
}

const getGameSingleton = () => {
  if (!GameImpl.currentInstance) {
    GameImpl.currentInstance = new GameImpl() 
  }
  return GameImpl.currentInstance
}

export {
  getGameSingleton,
  type Game as default  
}
