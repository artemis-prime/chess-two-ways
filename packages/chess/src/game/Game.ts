import {
  action,
  computed,
  makeObservable, 
  observable, 
} from 'mobx'

import type { default as Board, BoardInternal } from '../board/Board'
import { createBoard } from '../board/Board'
import type Action from '../Action'
import type { PieceType, PrimaryPieceType, Side } from '../Piece'
import type Piece from '../Piece'
import type Square from '../Square'
import type BoardSquare from '../BoardSquare'

import type ActionResolver from './ActionResolver'
import type ActionDescriptor from './ActionDescriptor'
import type Console from './Console'
import type InCheckCallback from './InCheckCallback'
import type ActionResolvedCallback from './ActionResolvedCallback'
import type ActionTakenCallback from './ActionTakenCallback'
import { actionRecordToLogString, boardSquareToString } from './util'

import registry from './resolverRegistry'

interface Game {

  getBoard(): Board

  resolveAction(p: Piece, from: Square, to: Square): Action | undefined
  takeAction(p: Piece, from: Square, to: Square): void
  
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

  public static currentInstance: GameImpl | undefined = undefined

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

  private _console: Console = {
    write: (t: string): void => {},
    writeln: (t?: string): void => {console.log(t)}
  }

  private _inCheckListener: InCheckCallback | undefined = undefined
  private _actionResolvedCallback: ActionResolvedCallback | undefined = undefined
  private _actionTakenCallback: ActionTakenCallback | undefined = undefined

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
  private _canCapture(board: Board, pieceType: PieceType, from: Square, to: Square) {
    let result: Action | undefined = undefined
    const resolver = this._resolvers.get(pieceType)

    if (resolver) {
      result = resolver(board, from, to)
    } 
    return result?.includes('capture')
  }

  resolveAction(
    piece: Piece, 
    from: Square, 
    to: Square, 
  ): Action | undefined {

    const resolver = this._resolvers.get(piece.type)
    if (resolver) {
      const action = resolver(this._mainBoard, from, to)
      if (this._actionResolvedCallback) {
        this._actionResolvedCallback(action, from, to)
      }
      return action
    } 
    return undefined   
  }

  takeAction(
    piece: Piece, 
    from: Square, 
    to: Square, 
    promoteTo?: PrimaryPieceType
  ): void {

    const action = this.resolveAction(piece, from, to)
    if (action) {
      const desc = this._createActionDescriptor(piece, from, to, action, promoteTo)
      this._checkCheckingBoard.applyAction(desc, 'do')
      const imInCheckFrom = this._checkCheckingBoard.inCheckFrom(desc.piece.color)
        // My proposed move would result in putting myself in check!
      if (imInCheckFrom.length) {
        this._console.writeln(`Resulting action by ${desc.piece.color} would put it in check!`)  
        console.log(boardSquareToString(imInCheckFrom))
        this._checkCheckingBoard.applyAction(desc, 'undo')
      }
      else {
        this._console.writeln('Action: ' + actionRecordToLogString(desc))
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
        const kingInCheckSquare = inCheckFrom.length ? this._mainBoard.kingsLocation(oppositeSide) : undefined
        this._inCheckListener(kingInCheckSquare, inCheckFrom)
        this._toggleTurn()
      }
    }
  }

  get canUndo() {
    return this._stateIndex >= 0
  }

  undo() {
    if (this.canUndo) {
      const r = this._actions[this._stateIndex]
      this._console.writeln('Undoing: ' + actionRecordToLogString(r))
      this._mainBoard.applyAction(r, 'undo')
      this._checkCheckingBoard.applyAction(r, 'undo')
      const oppositeSide = (r.piece.color === 'white') ? 'black' : 'white'
      const inCheckFrom = this._mainBoard.inCheckFrom(oppositeSide)
      const kingInCheckSquare = inCheckFrom.length ? this._mainBoard.kingsLocation(oppositeSide) : undefined
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
      this._console.writeln('Redoing: ' + actionRecordToLogString(r))
      this._mainBoard.applyAction(r, 'redo')
      this._checkCheckingBoard.applyAction(r, 'redo')
      const oppositeSide = (r.piece.color === 'white') ? 'black' : 'white'
      const inCheckFrom = this._mainBoard.inCheckFrom(oppositeSide)
      const kingInCheckSquare = inCheckFrom.length ? this._mainBoard.kingsLocation(oppositeSide) : undefined
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
    return {
      piece,
        // prevent reference copies of Squares
      from, 
      to,
      action,
      promotedTo: action.includes('promote') ? (promoteTo ? promoteTo : 'queen') : undefined,
      captured: (action === 'capture' || action === 'capture-promote') 
        ? 
        this._mainBoard.pieceAt(to) 
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
