import {
  action,
  makeObservable, 
  observable, 
} from 'mobx'


import { 
  Occupant,
  MoveTypes,
  Colors,
  PieceTypes,
  Square,
  MoveResolver
 } from './types'

export interface GameService {

  getOccupant(row: number, col: number): Occupant
  isEmpty(row: number, col: number): boolean
  moveType(fromRow: number, fromCol: number, toRow: number, toCol: number): MoveTypes
  canDrop(fromRow: number, fromCol: number, toRow: number, toCol: number): boolean
  drop(fromRow: number, fromCol: number, toRow: number, toCol: number): void
  currentTurn(): Colors
  boardAsSquares(): Square[]
}

class GameServiceImpl implements GameService {

  private _model: Occupant[][] = []
  private _currentTurn: Colors = Colors.white 
  private _resolvers: Map<PieceTypes, MoveResolver> | undefined = undefined 

  constructor(map: Map<PieceTypes, MoveResolver>) {

    this._resolvers = map

    makeObservable(this, {
      drop: action
    })

      // https://mobx.js.org/observable-state.html#limitations
    makeObservable<GameServiceImpl, 
      '_model' |
      '_currentTurn'| 
      '_toggleTurn' | 
      '_move' | 
      '_resetGame'
    >(this, {
      _model: observable,
      _currentTurn: observable,
      _toggleTurn: action,
      _move: action,
      _resetGame: action
    })

    this._resetGame()
  }

  private _resetGame(): void {

    this._model = []
    for (let row = 0; row < 8; row++) {
      const rowContents: Occupant[] = []
      if (row === 0) {
        for (let col = 0; col < 8; col++) {
          rowContents[col] = { 
            piece: {
              type: (col === 2) ? PieceTypes.bishop : PieceTypes.pawn,
              //type: PieceTypes.pawn,
              color: Colors.black
            }
          }  
        }
      }
      else if (row === 7) {
        for (let col = 0; col < 8; col++) {
          rowContents[col] = {
            piece: {
              //type: (col === 5) ? PieceTypes.queen : PieceTypes.pawn,
              type: PieceTypes.pawn,
              color: Colors.white
            }
          }
        }
      }
      else {
        for (let col = 0; col < 8; col++) {
          rowContents[col] = {
            piece: undefined 
          }
        }
      }
      this._model.push(rowContents)
    } 
  }

  boardAsSquares(): Square[] {
    const result: Square[] = []
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        result.push({
          piece: this.getOccupant(row, col).piece,
          row,
          col
        }) 
      }
    }
    return result
  }


  private _toggleTurn(): void {
    this._currentTurn = (this._currentTurn === Colors.white) ? Colors.black : Colors.white
  }

  private _move(
    fromRow: number, 
    fromCol: number,
    toRow: number, 
    toCol: number
  ): void {
    this._model[toRow][toCol] = { 
      piece: {
        ...this._model[fromRow][fromCol].piece!
      }
    }
    this._model[fromRow][fromCol] = { piece: undefined }
  }

  currentTurn(): Colors {
    return this._currentTurn
  }

  getOccupant(row: number, col: number): Occupant {
    return this._model[row][col]
  }
 
  isEmpty(row: number, col: number): boolean  {
    return !this.getOccupant(row, col).piece
  }


  moveType(
    fromRow: number, 
    fromCol: number,
    toRow: number, 
    toCol: number
  ): MoveTypes {

    const fromContent = this.getOccupant(fromRow, fromCol)
    const toContent = this.getOccupant(toRow, toCol)

    if (fromContent.piece) {
      const resolver = this._resolvers!.get(fromContent.piece.type)

      if (resolver) {
        console.log("found resolver")
        const result = resolver(
          this,
          fromRow, 
          fromCol,
          toRow, 
          toCol
        )
        console.log("resolve: ", result)
        return result
      } 
    }
    return MoveTypes.invalid   
  }

  canDrop(fromRow: number, fromCol: number, toRow: number, toCol: number): boolean {
    return this.moveType(fromRow, fromCol, toRow, toCol) !== MoveTypes.invalid
  }

  drop(fromRow: number, fromCol: number, toRow: number, toCol: number): void {
    const move = this.moveType(fromRow, fromCol, toRow, toCol)
    if (move !== MoveTypes.invalid) {
      this._move(fromRow, fromCol, toRow, toCol)
      if (move === MoveTypes.convert) {
        this._model[toRow][toCol].piece!.type = PieceTypes.queen
      }
      if (move !== MoveTypes.move) {
        if (this.won(this._model[toRow][toCol].piece!.color)) {
          console.log("WON!")
          this._resetGame()
          return 
        }
      }
      this._toggleTurn()
    }
  }

  won(color: Colors): boolean {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const  { piece } = this.getOccupant(row, col)
          // There is still the opponent's color on the board
        if (piece && piece.color && piece.color !== color) {
          return false
        }
      }
    }
    return true
  }
  
}

export default GameServiceImpl