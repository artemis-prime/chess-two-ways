import {
  action,
  makeObservable, 
  observable, 
} from 'mobx'


import { 
  Content,
  MoveTypes,
  Colors,
  PieceTypes,
  Square
 } from './types'

export interface GameService {

  getContent(row: number, col: number): Content
  moveType(fromRow: number, fromCol: number, toRow: number, toCol: number): MoveTypes
  canDrop(fromRow: number, fromCol: number, toRow: number, toCol: number): boolean
  drop(fromRow: number, fromCol: number, toRow: number, toCol: number): void
  currentTurn(): Colors
  getBoard(): Square[]
}

class GameServiceImpl implements GameService {

  private _model: Content[][] = []
  private _currentTurn: Colors = Colors.white 

  constructor() {

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
      const rowContents: Content[] = []
      if (row === 0) {
        for (let col = 0; col < 8; col++) {
          rowContents[col] = { 
            piece: {
              //type: (col === 2) ? PieceTypes.queen : PieceTypes.pawn,
              type: PieceTypes.pawn,
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

  getBoard(): Square[] {
    const result: Square[] = []
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        result.push({
          piece: this.getContent(row, col).piece,
          row,
          col
        }) 
      }
    }
    return result
  }

  private _won(color: Colors): boolean {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.getContent(row, col).piece
          // There is still the opponent's color on the board
        if (piece && piece.color !== color) {
          return false
        }
      }
    }
    return true
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

  getContent(row: number, col: number): Content {
    return this._model[row][col]
  }

  _hasntMoved(row: number, square: Content): boolean {

    return (
      row === 0 && !!square.piece && square.piece.type === PieceTypes.pawn && square.piece.color === Colors.black
      ||
      row === 7 && !!square.piece && square.piece.type === PieceTypes.pawn && square.piece.color === Colors.white
    )
  }

  private _resolvePawnMove(
    fromRow: number, 
    fromCol: number,
    toRow: number, 
    toCol: number,
    fromContent: Content,
    toContent: Content,
  ): MoveTypes {

    // initial two row advance?
    if (
      !toContent.piece 
      &&
      this._hasntMoved(fromRow, fromContent)
      &&
      (fromCol === toCol) 
      && 
      Math.abs(toRow - fromRow) === 2
    ) {
      return MoveTypes.move
    }

    // regular advance? 
    if (
      !toContent.piece
      &&
      (fromCol === toCol) 
      && 
        // ensure correct direction
      (
        (fromContent.piece!.color === Colors.black && (toRow - fromRow === 1))
        ||
        (fromContent.piece!.color === Colors.white && (toRow - fromRow === -1))
      )
    ) {
      if ((fromContent.piece!.color === Colors.black && toRow === 7) || (fromContent.piece!.color === Colors.white && toRow === 0)) {
        return MoveTypes.convert
      }
      return MoveTypes.move
    }

    // regular take? 
    if (
      (fromContent.piece!.color === Colors.black && toContent.piece && toContent.piece.color === Colors.white
      ||
      fromContent.piece!.color === Colors.white && toContent .piece && toContent.piece.color === Colors.black)
      &&
        // moving diagonally
      Math.abs(toCol - fromCol) === 1
      &&
      (
        fromContent.piece!.color === Colors.black && (toRow - fromRow === 1)
        ||
        fromContent.piece!.color === Colors.white && (toRow - fromRow === -1)
      )
    ) {
      if ((fromContent.piece!.color === Colors.black && toRow === 7) || (fromContent.piece!.color === Colors.white && toRow === 0)) {
        return MoveTypes.convert
      }
      return MoveTypes.take
    }
    return MoveTypes.invalid
  }

  private _isClear(row: number, col: number): boolean {
    return !this._model[row][col].piece
  }

  private _isClearAlongRow(
    fromRow: number, 
    fromCol: number,
    toRow: number, 
    toCol: number,
  ): boolean {
    if (fromRow === toRow) {
      const delta = toCol - fromCol
      if (delta < 0) {
        for (let col = fromCol - 1; col > toCol; col--) {
          if (!this._isClear(toRow, col)) return false
        }
      }
      else {
        for (let col = fromCol + 1; col < toCol; col++) {
          if (!this._isClear(toRow, col)) return false
        }
      }
      return true
    }
    return false
  }

  private _isClearAlongColumn(
    fromRow: number, 
    fromCol: number,
    toRow: number, 
    toCol: number,
  ): boolean {
    if (fromCol === toCol) {
      const delta = toRow - fromRow
      if (delta < 0) {
        for (let row = fromRow - 1; row > toRow; row--) {
          if (!this._isClear(row, toCol)) return false
        }
      }
      else {
        for (let row = fromRow + 1; row < toRow; row++) {
          if (!this._isClear(row, toCol)) return false
        }
      }
      return true
    }
    return false
  }

  private _isClearAlongDiagonal(
    fromRow: number, 
    fromCol: number,
    toRow: number, 
    toCol: number,
  ): boolean {
    const deltaX = toRow - fromRow
    const deltaY = toCol - fromCol

    if (Math.abs(deltaX) !== Math.abs(deltaY)) {
      return false
    }

      // --> NE
    if (deltaX > 0 && deltaY > 0) {
      for (let row = fromRow + 1, col = fromCol + 1; row < toRow && col < toCol; row++, col++) {
        if (!this._isClear(row, col)) return false
      }
    }
      // --> SE
    else if (deltaX > 0 && deltaY < 0) {
      for (let row = fromRow + 1, col = fromCol - 1; row < toRow && col > toCol; row++, col--) {
        if (!this._isClear(row, col)) return false
      }
    }
      // --> SW
    else if (deltaX < 0 && deltaY < 0) {
      for (let row = fromRow - 1, col = fromCol - 1; row > toRow && col > toCol; row--, col--) {
        if (!this._isClear(row, col)) return false
      }
    }
      // --> NW
    else if (deltaX < 0 && deltaY > 0) {
      for (let row = fromRow - 1, col = fromCol + 1; row > toRow && col < toCol; row--, col++) {
        if (!this._isClear(row, col)) return false
      }
    }
        
    return true
  }

  private _resolveQueenMove(
    fromRow: number, 
    fromCol: number,
    toRow: number, 
    toCol: number,
    fromContent: Content,
    toContent: Content,
  ): MoveTypes {
    if (
      (fromContent.piece!.color === Colors.black && toContent.piece && toContent.piece.color === Colors.white
      ||
      fromContent.piece!.color === Colors.white && toContent.piece && toContent.piece.color === Colors.black)
      &&
      (this._isClearAlongRow(fromRow, fromCol, toRow, toCol)
      ||
      this._isClearAlongColumn(fromRow, fromCol, toRow, toCol)
      ||
      this._isClearAlongDiagonal(fromRow, fromCol, toRow, toCol))
    ) {
      return MoveTypes.take
    }
    else if (
      !toContent.piece 
      && 
      (this._isClearAlongRow(fromRow, fromCol, toRow, toCol)
      ||
      this._isClearAlongColumn(fromRow, fromCol, toRow, toCol)
      ||
      this._isClearAlongDiagonal(fromRow, fromCol, toRow, toCol))
    ) {
      return MoveTypes.move
    }
    return MoveTypes.invalid

  }

  moveType(
    fromRow: number, 
    fromCol: number,
    toRow: number, 
    toCol: number
  ): MoveTypes {

    const toContent = this.getContent(toRow, toCol)
    const fromContent = this.getContent(fromRow, fromCol)

      // Dnd fw should ensure this doesn't happen, but whatevs
    if (!fromContent.piece) {
      return MoveTypes.invalid   
    }
    
    if (fromContent.piece.type === PieceTypes.pawn) {
      return this._resolvePawnMove(
        fromRow, 
        fromCol,
        toRow, 
        toCol,
        fromContent,
        toContent,
      )
    }
    else if (fromContent.piece.type === PieceTypes.queen) {
      return this._resolveQueenMove(
        fromRow, 
        fromCol,
        toRow, 
        toCol,
        fromContent,
        toContent,
      )
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
        if (this._won(this._model[toRow][toCol].piece!.color)) {
          console.log("WON!")
          this._resetGame()
          return 
        }
      }
      this._toggleTurn()
    }
  }
}

export default new GameServiceImpl()