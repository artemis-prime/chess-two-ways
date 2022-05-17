import { GameService } from '../GameService'
import { 
  Occupant,
  MoveTypes,
} from '../types'

import { 
  takingOpponent,
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
    isClearAlongDiagonal(game, fromRow, fromCol, toRow, toCol)
  ) {
    return MoveTypes.take
  }
  else if (
    !toOccupant.piece 
    && 
    isClearAlongDiagonal(game, fromRow, fromCol, toRow, toCol)
  ) {
    return MoveTypes.move
  }
  return MoveTypes.invalid
}
