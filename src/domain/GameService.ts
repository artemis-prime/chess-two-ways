import {
  action,
  computed,
  makeObservable, 
  observable, 
  reaction
} from 'mobx'


import { SquareState } from './SquareState'

export interface GameService {

  getState(row: number, col: number): SquareState
  canDrop(fromRow: number, fromCol: number, toRow: number, toCol: number): boolean
  drop(fromRow: number, fromCol: number, toRow: number, toCol: number): void

  currentTurn(): SquareState.white | SquareState.black
}

class GameServiceImpl implements GameService {

  private _model: SquareState[][] = []
  private _currentTurn: SquareState.white | SquareState.black = SquareState.white 

  constructor() {
    for (let row = 0; row < 8; row++) {
      const rowStates: SquareState[] = []
      if (row === 0) {
        for (let col = 0; col < 8; col++) {
          rowStates[col] = SquareState.black
        }
      }
      else if (row === 7) {
        for (let col = 0; col < 8; col++) {
          rowStates[col] = SquareState.white
        }
      }
      else {
        for (let col = 0; col < 8; col++) {
          rowStates[col] = SquareState.empty
        }
      }
      this._model.push(rowStates)
    } 

    makeObservable(this, {
      drop: action
    })

      // https://mobx.js.org/observable-state.html#limitations
    makeObservable<GameServiceImpl, 
      '_model' |
      '_currentTurn' 
    >(this, {
      _model: observable,
      _currentTurn: observable
    })
  }

  currentTurn(): SquareState.white | SquareState.black {
    return this._currentTurn
  }

  getState(row: number, col: number): SquareState {
    return this._model[row][col]
  }

  onHomeRow(row: number, state: SquareState): boolean {

    return (
      row === 0 && state === SquareState.black
      ||
      row === 7 && state === SquareState.white
    )
  }

  dropIntent(
    fromRow: number, 
    fromCol: number,
    toRow: number, 
    toCol: number
  ) {
    const toState = this.getState(toRow, toCol)
    const fromState = this.getState(fromRow, fromCol)

    // initial two row advance?
    if (
      toState === SquareState.empty
      &&
      this.onHomeRow(fromRow, fromState)
      &&
      (fromCol === toCol) 
      && 
      Math.abs(toRow - fromRow) === 2
    ) {
      return 'initial-advance'
    }

    // regular advance? 
    if (
      toState === SquareState.empty
      &&
      (fromCol === toCol) 
      && 
        // ensure correct direction
      (
        fromState === SquareState.black && (toRow - fromRow === 1)
        ||
        fromState === SquareState.white && (toRow - fromRow === -1)
      )
    ) {
      return 'regular-advance'
    }

    // regular take? 
    if (
      (fromState === SquareState.black && toState === SquareState.white
        ||
      fromState === SquareState.white && toState === SquareState.black)
      &&
      Math.abs(toCol - fromCol) === 1
      &&
      (
        fromState === SquareState.black && (toRow - fromRow === 1)
        ||
        fromState === SquareState.white && (toRow - fromRow === -1)
      )
    ) {
      return 'take'
    }

    return 'none'
  }

  canDrop(fromRow: number, fromCol: number, toRow: number, toCol: number): boolean {
    const intent = this.dropIntent(fromRow, fromCol, toRow, toCol)
    return !(intent === 'none')
  }

  drop(fromRow: number, fromCol: number, toRow: number, toCol: number): void {
    const intent = this.dropIntent(fromRow, fromCol, toRow, toCol)
    if (intent !== 'none') {
      this._model[toRow][toCol] = this._model[fromRow][fromCol]
      this._model[fromRow][fromCol] = SquareState.empty
      this._currentTurn = (this._currentTurn === SquareState.white) ? SquareState.black : SquareState.white
    }
  }
}

export default new GameServiceImpl()