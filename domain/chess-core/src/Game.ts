import {
  action,
  computed,
  makeObservable, 
  observable, 
  autorun,
  when
} from 'mobx'
import { computedFn } from 'mobx-utils'

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
  COLOR_FROM_CODE,
  opponent,
  type ColorCode
} from './Piece'

import type { default as ActionResolver, ResolvableMove } from './game/ActionResolver'
import type ActionRecord from './ActionRecord'
import { actionRecordToLAN, lanToActionRecord } from './ActionRecord'

import Resolution from './game/Resolution'
import Notifier from './game/Notifier'
import type GameData from './game/GameData'
import type GameStatus from './GameStatus'
import { STATUS_IN_PLAY, STATUS_CAN_UNDO } from './GameStatus'

import registry from './game/resolverRegistry'

interface Game {

    // Determine which valid action is intended by / possible with
    // the move attempted. (This could be used during drag'n'drop 
    // canDropOnMe() type functions.)
    // 
    // Resolved Action will cached for same move until:
    //  1) takeResolvedAction() is called 
    //  2) endResolution() is called 
    // (Note that this is from of debouncing)
  resolveAction(m: Move): Action | null
  takeResolvedAction(): void
  endResolution(): void
  
  get canUndo(): boolean
  get canRedo(): boolean
  undo(): void
  redo(): void

    // check if current turn has any valid moves,
    // if not, set the state accordingly
  checkStalemate(): void

  reset(): void
  callADraw(): void
  concede(): void 

  persistAsGameData() : GameData
  restoreFromGameData(g: GameData) : void

  pieceAt(p: Position): Piece | null

  get gameStatus(): GameStatus // observable
  get playing(): boolean // observable
  get currentTurn(): Side
  get inCheck(): null | {side: Side, from: Position[]} // observable

    // id should be the same across multiple registrations for the 
    // same listener.
  registerListener(l: ChessListener, uniqueId: string): void

    // Utility method for easy rendering (mobx 'computedFn')
  getBoardAsArray(reverse: boolean):  {pos: Position, piece: Piece | null}[]
}

class GameImpl implements Game {

  public static currentInstance: GameImpl 

  private _board: BoardInternal
  private _scratchBoard: BoardInternal

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

    this._board = createBoard(this._isCapture.bind(this), true)
    this._scratchBoard = createBoard(this._isCapture.bind(this))
  
    makeObservable(this, {
      takeResolvedAction: action,
      reset: action,
      undo: action,
      redo: action,
      restoreFromGameData: action,
      canUndo: computed,
      canRedo: computed,
      gameStatus: computed,
      currentTurn: computed,
      inCheck: computed,
      //boardAsArray: computed,
      playing: computed
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
      _actions: observable,
    })

    autorun(() => {
      this._notifier.gameStatusChanged(this.gameStatus)  
    })
  }

  get gameStatus(): GameStatus {
    return this._board.gameStatus
  }

  get playing(): boolean {
    return STATUS_IN_PLAY.includes(this._board.gameStatus.state) 
  }

  private get statusAllowsUndoRedo(): boolean {
    return STATUS_CAN_UNDO.includes(this._board.gameStatus.state) 
  }

  pieceAt(p: Position): Piece | null {
    return this._board.pieceAt(p)
  }

  getBoardAsArray = computedFn((
    whiteOnBottom: boolean
  ): {pos: Position, piece: Piece | null}[] => (
    (whiteOnBottom) ? this._board.boardAsArray  :[...this._board.boardAsArray].reverse()
  ), true)

  callADraw(): void {
    this._board.setGameStatus({
      state: 'draw',
      victor: 'none'
    })
  }

  concede(): void {
    this._board.setGameStatus({
      state: 'conceded',
      victor: opponent(this._currentTurn)
    })
  }

  reset() {
    this._board.reset()
    this._scratchBoard.reset()
    this._currentTurn = 'white'
    this._actions.length = 0
    this._stateIndex = -1 
    this._board.setGameStatus({
      state: 'new',
      victor: undefined
    })
  }

  async restoreFromGameData(g: GameData): Promise<void> {

    if (!g.artemisPrimeChessGame) throw new Error('restoreFromGameData() invalid Game Object!')

    this._board.restoreFromBoardData(g.board)
    this._currentTurn = COLOR_FROM_CODE[g.currentTurn]
    this._actions = g.actions.map((lan: string) => (lanToActionRecord(lan)))
    //this._stateIndex = g.stateIndex
    this._board.setGameStatus({
      state: 'restored',
      victor: undefined
    })
      // await the state change. We effectively create a new listerner, 
      // which be definition is after the autorun() in GameImpl's constructor.
      // The actionsRestored() notification should be after the game state change.
    await when(() => this._board.gameStatus.state === 'restored');
    this._notifier.actionsRestored([...this._actions])
    this._trackAndNotifyCheck()
  }

  persistAsGameData(): GameData {
    return {
      artemisPrimeChessGame: true,
      board: this._board.persistAsBoardData(),
      actions: this._actions.map((rec: ActionRecord) => (actionRecordToLAN(rec))),
      //stateIndex: this._stateIndex,
      currentTurn: this._currentTurn.charAt(0) as ColorCode
    }
  }  

  checkStalemate(): void {
    if (
      !(this._board.inCheck && this._board.inCheck.side === this._currentTurn)
      &&
      !this._primariesCanMove(this._currentTurn)
      &&
      !this._kingCanMove(this._currentTurn)
      &&
      !this._pawnsCanMove(this._currentTurn)
    ) {
      this._board.setGameStatus({
        state: 'stalemate',
        victor: 'none'
      }) 
    }
    else {
      this._notifier.message('Not in stalemate', 'info-transient')
    }
  }

  get inCheck(): null | {side: Side, from: Position[]} {
    return this._board.inCheck
  }

  get currentTurn(): Side {
    return this._currentTurn
  }

  registerListener(l: ChessListener, uniqueId: string): void {
    this._notifier.registerListener(l, uniqueId)
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
        this._scratchBoard.syncTo(this._board)
        action = resolver.resolve(this._scratchBoard, move, (m: string): void => {
          this._notifier.message(m, 'transient-warning')
        })
        if (action) {
          const r = this._createActionRecord(move, action)
          this._scratchBoard.applyAction(r, 'do')
          const { wasInCheck, inCheckFrom } = this._scratchBoard.trackInCheck(r.piece.color)
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

  takeResolvedAction(): void {

    if (!this.playing) return
    if (!this._cachedResolution?.action) return

      // TODO: create an async function that returns the promoteTo type.
      // eg, a dialog could popup
    const promoteTo = 'queen'

    const r = this._createActionRecord(
      this._cachedResolution!.move, 
      this._cachedResolution!.action!, 
      promoteTo
    )
    this._cachedResolution = null
    this._board.applyAction(r, 'do')
    this._notifier.actionTaken(r)
    if (this._stateIndex + 1 < this._actions.length) {
        // If we've undone actions since the most recent 'real' move,
        // truncate the stack since we can no longer meaningfully 
        // 'redo' actions more recent than the one we're currently on.
      this._actions.length = this._stateIndex + 1 
    }
    this._actions.push(r)
    this._stateIndex = this._actions.length - 1
    this._trackAndNotifyCheck()
    this._toggleTurn()
  }

  get canUndo() {
    return this.statusAllowsUndoRedo && this._stateIndex >= 0 
  }

  undo() {
    if (this.canUndo) {
      const { state } = this._board.gameStatus
      if (state === 'checkmate' || state === 'stalemate') {
        this._board.setGameStatus({
          state: 'resumed',
          victor: undefined
        })
      }
      const r = this._actions[this._stateIndex]
      this._board.applyAction(r, 'undo')
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
      this._board.applyAction(r, 'redo')
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
        {...this._board.pieceAt(move.to)!} 
        : 
        undefined
    }
  }

  private _resolvableMovesDontAllResultInCheck(moves: ResolvableMove[], side: Side): boolean {
    this._scratchBoard.syncTo(this._board)
    return moves.some((rm: ResolvableMove) => {
      const r = this._createActionRecord(rm.move, rm.action)
      this._scratchBoard.applyAction(r, 'do')
      const { inCheckFrom } = this._scratchBoard.trackInCheck(side)
      this._scratchBoard.applyAction(r, 'undo')
      return inCheckFrom.length === 0
    })
  }

  private _kingCanMove(side: Side): boolean {
    const pos = this._board.kingsPosition(side)
    const resolver = this._resolvers.get('king')!
    const moves = resolver.resolvableMoves(this._board, {type: 'king', color: side}, pos, true)
    return this._resolvableMovesDontAllResultInCheck(moves, side)
  }

  private _primariesCanMove(side: Side): boolean {
    return PRIMARY_PIECES.some((type: PrimaryPieceType) => {
      const positions = this._board.primaryPositions(side, type)
      const resolver = this._resolvers.get(type)
      return resolver && positions.some((pos) => {
        const moves = resolver.resolvableMoves(this._board, {type, color: side}, pos)
        return this._resolvableMovesDontAllResultInCheck(moves, side)
      })
    })
  }

  private _pawnsCanMove(side: Side): boolean {
    const pawnPositions = this._board.pawnPositions(side)
    const resolver = this._resolvers.get('pawn')!
    return pawnPositions.some((pos) => {
      const moves = resolver.resolvableMoves(this._board, {type: 'pawn', color: side}, pos)
      return this._resolvableMovesDontAllResultInCheck(moves, side)
    })
  }

  private _trackAndNotifyCheckForSide(side: Side): void {

    const { wasInCheck, inCheckFrom } = this._board.trackInCheck(side)
    const inCheck = inCheckFrom.length > 0

      // Only notify if in check state changes 
    if (!wasInCheck && inCheck) {
      this._notifier.inCheck(side, this._board.kingsPosition(side), inCheckFrom)
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
      this._board.setGameStatus({
        state: 'checkmate',
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
