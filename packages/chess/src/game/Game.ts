import {
  action,
  computed,
  makeObservable, 
  observable, 
} from 'mobx'

import type { default as Board, BoardInternal } from '../board/Board'
import { createBoard } from '../board/Board'
import type Action from '../Action'
import type Piece from '../Piece'
import type { PieceType, PrimaryPieceType, Side } from '../Piece'
import { pieceToString } from '../Piece'
import type Square from '../Square'
import { copySquare, squareToString } from '../Square'

import type ActionResolver from './ActionResolver'
import type ActionDescriptor from './ActionDescriptor'
import type Resolution from './Resolution'
import { resolutionsEqual } from './Resolution'
import type Console from './Console'
import type InCheckCallback from './InCheckCallback'
import type ActionResolvedCallback from './ActionResolvedCallback'
import type ActionTakenCallback from './ActionTakenCallback'
import { actionDescToString } from './util'

import registry from './resolverRegistry'

interface Game {

  getBoard(): Board

    // Result will be cached for same params until either,
    //  1) takeAction is called for the same params
    //  2) endResolution is called 
    // (This is akin to debouncing but not specific to web)
  resolveAction(p: Piece, from: Square, to: Square): Action | null
  takeAction(p: Piece, from: Square, to: Square): void
  endResolution(): void
  
  undo(): void
  redo(): void

  get canUndo(): boolean
  get canRedo(): boolean
  
  reset(): void
  get currentTurn(): Side

  setConsole(c: Console): void
  setInCheckCallback(l: InCheckCallback): void
  setActionResolvedCallback(l: ActionResolvedCallback): void
  setActionTakenCallback(l: ActionTakenCallback): void
}

class GameImpl implements Game {

  public static currentInstance: GameImpl 

  private _mainBoard: BoardInternal
  private _checkCheckingBoard: BoardInternal

  private _currentTurn: Side = 'white' 
  private _resolvers: Map<PieceType, ActionResolver>  = registry 
  private _actions = [] as ActionDescriptor[] 
    // For managing undo / redo.  The index of the current state
    // within _actions.  -1 is the original state of the board.
    // That way, _action[0] is conveniently the first move,
    // and you can move back and forth via undo / redo
  private _stateIndex = -1 
  private _currentResolution: Resolution | undefined 

  private _console: Console = {
    write: (t: string): void => {},
    writeln: (t?: string): void => {console.log(t)}
  }

  private _inCheckListener: InCheckCallback 
  private _actionResolvedCallback: ActionResolvedCallback 
  private _actionTakenCallback: ActionTakenCallback 

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
    this._actions = [] as ActionDescriptor[]
    this._stateIndex = -1 
  }

  get currentTurn(): Side {
    return this._currentTurn
  }

  setConsole(c: Console): void {
    this._console = c
  }

  setInCheckCallback(f: InCheckCallback): void {
    this._inCheckListener = f
  }

  setActionResolvedCallback(f: ActionResolvedCallback): void {
    this._actionResolvedCallback = f
  }

  setActionTakenCallback(f: ActionTakenCallback): void {
    this._actionTakenCallback = f
  }

    // Do not call directly.  Passed to Board instance to 
    // implement checkChecking
  private _canCapture(board: Board, pieceType: PieceType, from: Square, to: Square): boolean {
    let result: Action | null = null
    const resolver = this._resolvers.get(pieceType)

    if (resolver) {
      result = resolver(board, from, to)
    } 
    return !!result?.includes('capture')
  }

  resolveAction(
    piece: Piece, 
    from: Square, 
    to: Square, 
  ): Action | null {

    if (
      !this._currentResolution 
      ||
      !resolutionsEqual(this._currentResolution, {to, from, piece, resolvedAction: null /* ignored */})
    ) {
      this._currentResolution = {
        piece,
        from,
        to,
        resolvedAction: null 
      }


      const resolver = this._resolvers.get(piece.type)
      if (resolver) {
        this._checkCheckingBoard.syncToBoard(this._mainBoard)
        const toRank = to.rank
        console.log("to.rank: " + toRank)
        if (toRank === 3) {
          console.log("tto.rank: " + toRank)
        }
        let action = resolver(this._checkCheckingBoard, from, to)
        if (action) {
          const desc = this._createActionDescriptor(piece, from, to, action)
          const wasInCheck = this._mainBoard.inCheck(desc.piece.color) 
          this._checkCheckingBoard.applyAction(desc, 'do')
          if (this._checkCheckingBoard.inCheck(desc.piece.color)) {
            this._console.writeln(`Resulting action by ${desc.piece.color} not allowed \
              as it would ${wasInCheck ? 'leave it' : 'put it'}) in check!`
            )  
            action = null
          }
        } 
        if (this._actionResolvedCallback) {
          this._actionResolvedCallback(action, from, to)
        }
        this._currentResolution.resolvedAction = action
        console.log('First resolution for ' + pieceToString(piece) + ': ' + squareToString(from) + ' --> ' + squareToString(to) + ' is ' + action)
      } 
    }
    else {
      console.log('Cached resolution is ' + this._currentResolution.resolvedAction)

    }
    return this._currentResolution.resolvedAction
  }

  endResolution(): void {
    this._currentResolution = undefined
    //console.log('End resolution called')
  }

  takeAction(
    piece: Piece, 
    from: Square, 
    to: Square, 
    promoteTo?: PrimaryPieceType
  ): void {

    const action = this._currentResolution?.resolvedAction
    if (action) {
        this.endResolution()
        const desc = this._createActionDescriptor(piece, from, to, action, promoteTo)
        this._console.writeln('[action]: ' + actionDescToString(desc))
        this._mainBoard.applyAction(desc, 'do')
        if (this._actionTakenCallback) {
          this._actionTakenCallback(action, from, to)
        }
        if (this._stateIndex + 1 < this._actions.length) {
            // If we've undone actions since the most recent "actual" move,
            // truncate the stack since we can no longer meaningfully 
            // 'redo' actions more recent than the one we're currently on.
          this._actions.length = this._stateIndex + 1 
        }
        this._actions.push(desc)
        this._stateIndex = this._actions.length - 1
        const oppositeSide = (desc.piece.color === 'white') ? 'black' : 'white'
        const inCheckFrom = this._mainBoard.inCheckFrom(oppositeSide)
        const kingInCheckSquare = inCheckFrom.length ? this._mainBoard.kingsLocation(oppositeSide) : null
        this._inCheckListener(kingInCheckSquare, inCheckFrom)
        this._toggleTurn()
    }
  }

  get canUndo() {
    return this._stateIndex >= 0
  }

  undo() {
    if (this.canUndo) {
      const r = this._actions[this._stateIndex]
      this._console.writeln('[<< undo]: ' + actionDescToString(r))
      this._mainBoard.applyAction(r, 'undo')
      //this._checkCheckingBoard.applyAction(r, 'undo')
      const oppositeSide = (r.piece.color === 'white') ? 'black' : 'white'
      const inCheckFrom = this._mainBoard.inCheckFrom(oppositeSide)
      const kingInCheckSquare = inCheckFrom.length ? this._mainBoard.kingsLocation(oppositeSide) : null
      this._inCheckListener(kingInCheckSquare, inCheckFrom)
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
      this._console.writeln('[redo >>]: ' + actionDescToString(r))
      this._mainBoard.applyAction(r, 'redo')
      //this._checkCheckingBoard.applyAction(r, 'redo')
      const oppositeSide = (r.piece.color === 'white') ? 'black' : 'white'
      const inCheckFrom = this._mainBoard.inCheckFrom(oppositeSide)
      const kingInCheckSquare = inCheckFrom.length ? this._mainBoard.kingsLocation(oppositeSide) : null
      this._inCheckListener(kingInCheckSquare, inCheckFrom)
      this._toggleTurn()
    }
  }

  private _createActionDescriptor(
    piece: Piece,
    from: Square, 
    to: Square, 
    action: Action,
    promoteTo?: PrimaryPieceType, 
  ): ActionDescriptor {
      // deep copy all
    return {
      piece: {...piece},
      from: copySquare(from), 
      to: copySquare(to),
      action,
      promotedTo: action.includes('promote') ? (promoteTo ? promoteTo : 'queen') : undefined,
      captured: (action === 'capture' || action === 'capture-promote') 
        ? 
        {...this._mainBoard.pieceAt(to)!} 
        : 
        undefined
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
