import { GameService } from '../GameService'
import { 
  Occupant,
  MoveTypes,
  Colors,
} from '../types'

import { pawnOnHomeRow, takingOpponent } from './resolveUtils'

export default (
  game: GameService,
  fromRow: number, 
  fromCol: number,
  toRow: number, 
  toCol: number,
): MoveTypes => {
  
  const fromOccupant = game.getOccupant(fromRow, fromCol)
  const toOccupant = game.getOccupant(toRow, toCol)

  console.log("PAWN")

  // initial two row advance?
  if (
    !toOccupant.piece 
    &&
    pawnOnHomeRow(fromRow, fromOccupant.piece)
    &&
    (fromCol === toCol) 
    && 
    Math.abs(toRow - fromRow) === 2
  ) {
    return MoveTypes.move
  }

  // regular advance? 
  if (
    !toOccupant.piece
    &&
    (fromCol === toCol) 
    && 
      // ensure correct direction
    (
      (fromOccupant.piece!.color === Colors.black && (toRow - fromRow === 1))
      ||
      (fromOccupant.piece!.color === Colors.white && (toRow - fromRow === -1))
    )
  ) {
    if ((fromOccupant.piece!.color === Colors.black && toRow === 7) || (fromOccupant.piece!.color === Colors.white && toRow === 0)) {
      return MoveTypes.convert
    }
    return MoveTypes.move
  }

  // regular take? 
  if (
    takingOpponent(fromOccupant, toOccupant)
    &&
      // moving diagonally
    Math.abs(toCol - fromCol) === 1
    &&
    (
      fromOccupant.piece!.color === Colors.black && (toRow - fromRow === 1)
      ||
      fromOccupant.piece!.color === Colors.white && (toRow - fromRow === -1)
    )
  ) {
    if ((fromOccupant.piece!.color === Colors.black && toRow === 7) || (fromOccupant.piece!.color === Colors.white && toRow === 0)) {
      return MoveTypes.convert
    }
    return MoveTypes.take
  }

  console.log(`INVALID DATA: ${fromOccupant.piece!.color} ${fromRow} ${fromCol} :  ${toOccupant.piece?.color} ${toRow} ${toCol} `)
  return MoveTypes.invalid
}
