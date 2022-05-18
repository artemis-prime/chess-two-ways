import { PieceType } from '../types'
import type { Resolver } from '../types'

import pawn from './pawn' 
import queen from './queen' 
import bishop from './queen'
import rook from './rook' 
import knight from './knight' 
import king from './king' 

export default new Map<PieceType, Resolver>([
  ['pawn', pawn],
  ['queen', queen],
  ['bishop', bishop],
  ['rook', rook],
  ['knight', knight],
  ['king', king]
])
