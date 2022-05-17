import { GameService } from '../GameService'
import { 
  Occupant,
  MoveTypes,
  Colors,
} from '../types'

import { 
  takingOpponent,
  isClearAlongRow, 
  isClearAlongColumn,
  isClearAlongDiagonal
} from './resolveUtils'

export default (
  game: GameService,
  fromRow: number, 
  fromCol: number,
  toRow: number, 
  toCol: number,
): MoveTypes => {
  
  const fromOccupant: Occupant = game.getOccupant(fromRow, fromCol)
  const toOccupant: Occupant = game.getOccupant(toRow, toCol)

  if (
    takingOpponent(fromOccupant, toOccupant)
    &&
    (isClearAlongRow(game, fromRow, fromCol, toRow, toCol)
    ||
    isClearAlongColumn(game, fromRow, fromCol, toRow, toCol)
    ||
    isClearAlongDiagonal(game, fromRow, fromCol, toRow, toCol))
  ) {
    return MoveTypes.take
  }
  else if (
    !toOccupant.piece 
    && 
    (isClearAlongRow(game, fromRow, fromCol, toRow, toCol)
    ||
    isClearAlongColumn(game, fromRow, fromCol, toRow, toCol)
    ||
    isClearAlongDiagonal(game, fromRow, fromCol, toRow, toCol))
  ) {
    return MoveTypes.move
  }
  return MoveTypes.invalid
}
