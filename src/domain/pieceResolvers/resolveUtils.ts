import { GameService } from '../GameService'

import { 
  Occupant,
  MoveTypes,
  Colors,
  PieceTypes,
  Square,
  Piece
 } from '../types'

const pawnOnHomeRow = (row: number, piece: Piece | undefined): boolean => (
  row === 0 && !!piece && piece.type === PieceTypes.pawn && piece.color === Colors.black
  ||
  row === 7 && !!piece && piece.type === PieceTypes.pawn && piece.color === Colors.white
)


const takingOpponent = (
  fromOccupant: Occupant,
  toOccupant: Occupant
) => (
    // fromOccupant assumed valid, toOccupant may not be
  (fromOccupant.piece!.color === Colors.black && toOccupant.piece?.color === Colors.white
    ||
  fromOccupant.piece!.color === Colors.white && toOccupant.piece?.color === Colors.black)
)

const isClearAlongRow = (
  game: GameService,
  fromRow: number, 
  fromCol: number,
  toRow: number, 
  toCol: number,
): boolean => {
  if (fromRow === toRow) {
    const delta = toCol - fromCol
    if (delta < 0) {
      for (let col = fromCol - 1; col > toCol; col--) {
        if (!game.isEmpty(toRow, col)) return false
      }
    }
    else {
      for (let col = fromCol + 1; col < toCol; col++) {
        if (!game.isEmpty(toRow, col)) return false
      }
    }
    return true
  }
  return false
}

const isClearAlongColumn = (
  game: GameService,
  fromRow: number, 
  fromCol: number,
  toRow: number, 
  toCol: number,
): boolean => {
  if (fromCol === toCol) {
    const delta = toRow - fromRow
    if (delta < 0) {
      for (let row = fromRow - 1; row > toRow; row--) {
        if (!game.isEmpty(row, toCol)) return false
      }
    }
    else {
      for (let row = fromRow + 1; row < toRow; row++) {
        if (!game.isEmpty(row, toCol)) return false
      }
    }
    return true
  }
  return false
}

const isClearAlongDiagonal = (
  game: GameService,
  fromRow: number, 
  fromCol: number,
  toRow: number, 
  toCol: number,
): boolean => {

  const deltaX = toRow - fromRow
  const deltaY = toCol - fromCol

  if (Math.abs(deltaX) !== Math.abs(deltaY)) {
    return false
  }

    // --> NE
  if (deltaX > 0 && deltaY > 0) {
    for (let row = fromRow + 1, col = fromCol + 1; row < toRow && col < toCol; row++, col++) {
      if (!game.isEmpty(row, col)) return false
    }
  }
    // --> SE
  else if (deltaX > 0 && deltaY < 0) {
    for (let row = fromRow + 1, col = fromCol - 1; row < toRow && col > toCol; row++, col--) {
      if (!game.isEmpty(row, col)) return false
    }
  }
    // --> SW
  else if (deltaX < 0 && deltaY < 0) {
    for (let row = fromRow - 1, col = fromCol - 1; row > toRow && col > toCol; row--, col--) {
      if (!game.isEmpty(row, col)) return false
    }
  }
    // --> NW
  else if (deltaX < 0 && deltaY > 0) {
    for (let row = fromRow - 1, col = fromCol + 1; row > toRow && col < toCol; row--, col++) {
      if (!game.isEmpty(row, col)) return false
    }
  }
      
  return true
}



export {
  pawnOnHomeRow,
  takingOpponent,
  isClearAlongRow, 
  isClearAlongColumn,
  isClearAlongDiagonal
}