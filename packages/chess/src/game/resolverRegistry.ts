import type { PieceType } from '../Piece'
import type ActionResolverFn from './ActionResolverFn'

import pawn from '../resolvers/pawn' 
import queen from '../resolvers/queen' 
import bishop from '../resolvers/bishop'
import rook from '../resolvers/rook' 
import knight from '../resolvers/knight' 
import king from '../resolvers/king' 

export default new Map<PieceType, ActionResolverFn>([
  ['pawn', pawn],
  ['queen', queen],
  ['bishop', bishop],
  ['rook', rook],
  ['knight', knight],
  ['king', king]
])
