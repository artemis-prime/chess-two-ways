import { PieceType } from '../types'
import type { Resolver } from '../types'

import pawn from './pawn' 
import queen from './queen' 
import bishop from './queen' 

export default new Map<PieceType, Resolver>([
  ['pawn', pawn],
  ['queen', queen],
  ['bishop', bishop]
])
