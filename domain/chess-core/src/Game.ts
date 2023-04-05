import {
  action,
  computed,
  makeObservable, 
  observable, 
  autorun
} from 'mobx'

import type { default as Board, BoardInternal } from './Board'
import { createBoard } from './Board'
import type Move from './Move'
import { movesEqual } from './Move'
import type Action from './Action'
import type Position from './Position'
import { copyPosition, positionToString } from './Position'
import type ChessListener from './ChessListener'
import type Piece from './Piece'
import { 
  type PieceType, 
  type PrimaryPieceType, 
  type Side, 
  PRIMARY_PIECES, 
  opponent
} from './Piece'

import type { default as ActionResolver, ResolvableMove } from './game/ActionResolver'
import type ActionRecord from './ActionRecord'
import Resolution from './game/Resolution'
import Notifier from './game/Notifier'
import type GameStatus from './GameStatus'

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
    // check if current turn has any valid moves,
    // if not, set the status accordingly
  checkStalemate(): void

  setDraw(): void
    // currentTurn concedes the game
  setConcession(): void 

  get gameStatus(): GameStatus // observable
  reset(): void
  get currentTurn(): Side
  get inCheck(): null | {side: Side, from: Position[]} // observable

  listenTo(l: ChessListener, uniqueId: string): void

    // Utility method for easy rendering (mobx 'computed')
  get boardAsArray():  {pos: Position, piece: Piece | null}[]

  resetFromGameObject(g: any) : void
}

class GameImpl implements Game {

  public static currentInstance: GameImpl 

  private _mainBoard: BoardInternal
  private _checkCheckingBoard: BoardInternal

  private _currentTurn: Side = 'white' 
  private _resolvers: Map<PieceType, ActionResolver>  = registry 
  private _actions = [] as ActionRecord[] 
    // For managing undo / redo.  The index of the current state
    // within _actions.  -1 is the original state of the board.
    // That way, _action[0] is conveniently the first move,
    // and you can move back and forth via undo / redo
  private _stateIndex = -1 
  private _cachedResolution: Resolution | null = null 

  private _notifier: Notifier = new Notifier() 

  constructor() {

    this._mainBoard = createBoard(this._isCapture.bind(this), true)
    this._checkCheckingBoard = createBoard(this._isCapture.bind(this))
  
    makeObservable(this, {
      takeAction: action,
      reset: action,
      undo: action,
      redo: action,
      resetFromGameObject: action,
      canUndo: computed,
      canRedo: computed,
      gameStatus: computed,
      currentTurn: computed,
      inCheck: computed,
      boardAsArray: computed
    })

      // https://mobx.js.org/observable-state.html#limitations
    makeObservable<GameImpl, 
      '_currentTurn'| 
      '_toggleTurn' | 
      '_stateIndex' |
      '_actions' |
      'playing'
    >(this, {
      _currentTurn: observable,
      _toggleTurn: action,
      _stateIndex: observable,
      _actions: observable,
      playing: computed
    })

    autorun(() => {
      this._notifier.gameStatusChanged(this.gameStatus)  
    })
  }

  get gameStatus(): GameStatus {
    return this._mainBoard.gameStatus
  }

  private get playing(): boolean {
    return this._mainBoard.gameStatus.status === 'playing' || this._mainBoard.gameStatus.status === 'new'
  }

  private get statusAllowsUndoRedo(): boolean {
    return (
      this._mainBoard.gameStatus.status === 'new'
      || 
      this._mainBoard.gameStatus.status === 'playing'
      ||
      this._mainBoard.gameStatus.status === 'stalemate'
      ||
      this._mainBoard.gameStatus.status === 'checkmate'
    )
  }

  get boardAsArray(): {pos: Position, piece: Piece | null}[] {
    return this._mainBoard.boardAsArray
  }

  setDraw(): void {
    this._mainBoard.setGameStatus({
      status: 'draw',
      victor: 'none'
    })
  }

  setConcession(): void {
    this._mainBoard.setGameStatus({
      status: 'concession',
      victor: opponent(this._currentTurn)
    })
  }

  reset() {
    this._mainBoard.reset()
    this._checkCheckingBoard.reset()
    this._currentTurn = 'white'
    this._actions.length = 0
    this._stateIndex = -1 
  }

  resetFromGameObject(g: any) : void {

    this._mainBoard.resetFromGameObject(g)
    this._checkCheckingBoard.syncTo(this._mainBoard)
    this._currentTurn = 'white'
    this._actions.length = 0
    this._stateIndex = -1 
  }

  checkStalemate(): void {
    if (
      !(this._mainBoard.inCheck && this._mainBoard.inCheck.side === this._currentTurn)
      &&
      !this._primariesCanMove(this._currentTurn)
      &&
      !this._kingCanMove(this._currentTurn)
      &&
      !this._pawnsCanMove(this._currentTurn)
    ) {
      this._mainBoard.setGameStatus({
        status: 'stalemate',
        victor: 'none'
      }) 
    }
    else {
      this._notifier.message('Not in stalemate', 'info-transient')
    }
  }

  get inCheck(): null | {side: Side, from: Position[]} {
    return this._mainBoard.inCheck
  }

  get currentTurn(): Side {
    return this._currentTurn
  }

  listenTo(l: ChessListener, uniqueId: string): void {
    this._notifier.listenTo(l, uniqueId)
  }

    // Do not call directly.  Passed to Board instance to 
    // implement checkChecking
  private _isCapture(board: Board, m: Move): boolean {
    let result: Action | null = null
    const resolver = this._resolvers.get(m.piece.type)

    if (resolver) {
      result = resolver.resolve(board, m)
    } 
    return !!result?.includes('capture')
  }

  resolveAction(move: Move): Action | null {

    if (!this.playing) return null

    if (!this._cachedResolution || !movesEqual(this._cachedResolution!.move, move)) {
      if (!move.piece) {
        this._notifier.message(`There's no piece at ${positionToString}!`, 'transient-warning') 
      }
      const resolver = this._resolvers.get(move.piece?.type)
      let action: Action | null = null
      if (resolver) {
        this._checkCheckingBoard.syncTo(this._mainBoard)
        action = resolver.resolve(this._checkCheckingBoard, move, (m: string): void => {
          this._notifier.message(m, 'transient-warning')
        })
        if (action) {
          const r = this._createActionRecord(move, action)
          this._checkCheckingBoard.applyAction(r, 'do')
          const { wasInCheck, inCheckFrom } = this._checkCheckingBoard.trackInCheck(r.piece.color)
          if (inCheckFrom.length > 0) {
            this._notifier.message(`${actionRecordToLAN(r)} isn't possible. It would ` +
              `${wasInCheck ? 'leave you' : 'put you'} in check!`, 'transient-warning')  
            action = null
          }
          else if (wasInCheck) {
            this._notifier.message(`${actionRecordToLAN(r)} is ok!`, 'transient-info')  
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
  }

  takeAction(
    move: Move,
    promoteTo?: PrimaryPieceType
  ): void {

    if (!this.playing) return

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
        this._trackAndNotifyCheck()
        this._toggleTurn()
    }
  }

  get canUndo() {
    return this.statusAllowsUndoRedo && this._stateIndex >= 0 
  }

  undo() {
    if (this.canUndo) {
      const r = this._actions[this._stateIndex]
      this._mainBoard.applyAction(r, 'undo')
      this._notifier.actionUndon(r)
      this._trackAndNotifyCheck()
      this._stateIndex--
      this._toggleTurn()
    }
  }

  get canRedo() {
    return this.statusAllowsUndoRedo && (this._stateIndex + 1 < this._actions.length)
  }

  redo() {
    if (this.canRedo) {
      this._stateIndex++
      const r = this._actions[this._stateIndex]
      this._mainBoard.applyAction(r, 'redo')
      this._notifier.actionRedon(r)
      this._trackAndNotifyCheck()
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

  private _resolvableMovesDontAllResultInCheck(moves: ResolvableMove[], side: Side): boolean {
    this._checkCheckingBoard.syncTo(this._mainBoard)
    return moves.some((rm: ResolvableMove) => {
      const r = this._createActionRecord(rm.move, rm.action)
      this._checkCheckingBoard.applyAction(r, 'do')
      const { inCheckFrom } = this._checkCheckingBoard.trackInCheck(side)
      this._checkCheckingBoard.applyAction(r, 'undo')
      return inCheckFrom.length === 0
    })
  }

  private _kingCanMove(side: Side): boolean {
    const pos = this._mainBoard.kingsPosition(side)
    const resolver = this._resolvers.get('king')!
    const moves = resolver.resolvableMoves(this._mainBoard, {type: 'king', color: side}, pos, true)
    return this._resolvableMovesDontAllResultInCheck(moves, side)
  }

  private _primariesCanMove(side: Side): boolean {
    return PRIMARY_PIECES.some((type: PrimaryPieceType) => {
      const positions = this._mainBoard.primaryPositions(side, type)
      const resolver = this._resolvers.get(type)
      return resolver && positions.some((pos) => {
        const moves = resolver.resolvableMoves(this._mainBoard, {type, color: side}, pos)
        return this._resolvableMovesDontAllResultInCheck(moves, side)
      })
    })
  }

  private _pawnsCanMove(side: Side): boolean {
    const pawnPositions = this._mainBoard.pawnPositions(side)
    const resolver = this._resolvers.get('pawn')!
    return pawnPositions.some((pos) => {
      const moves = resolver.resolvableMoves(this._mainBoard, {type: 'pawn', color: side}, pos)
      return this._resolvableMovesDontAllResultInCheck(moves, side)
    })
  }

  private _trackAndNotifyCheckForSide(side: Side): void {

    const { wasInCheck, inCheckFrom } = this._mainBoard.trackInCheck(side)
    const inCheck = inCheckFrom.length > 0

      // Only notify if in check status changes 
    if (!wasInCheck && inCheck) {
      this._notifier.inCheck(side, this._mainBoard.kingsPosition(side), inCheckFrom)
    }
    else if (wasInCheck && !inCheck){
      this._notifier.notInCheck(side)  
    }
    if (inCheck 
        && 
        !this._kingCanMove(side)
        &&
        !this._primariesCanMove(side)
        &&
        !this._pawnsCanMove(side)
    ) {
      this._mainBoard.setGameStatus({
        status: 'checkmate',
        victor: opponent(side)
      }) 
    }
  }

    // We have to check each side after every actions, since 
    // can put an opponent in check w a move,
    // or take oneself out of check
  private _trackAndNotifyCheck(): void {
    this._trackAndNotifyCheckForSide('white')
    this._trackAndNotifyCheckForSide('black')
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
