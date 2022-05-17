import { PieceTypes } from '../types'
import type { MoveResolver } from '../types'

import pawn from './pawn' 
import queen from './queen' 
import bishop from './queen' 

export default new Map<PieceTypes, MoveResolver>([
  [PieceTypes.pawn, pawn],
  [PieceTypes.queen, queen],
  [PieceTypes.bishop, bishop]
])
