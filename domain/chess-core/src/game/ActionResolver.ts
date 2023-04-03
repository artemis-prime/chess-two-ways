import type Board from '../Board'
import type Position from '../Position'
import type Move from '../Move'
import type Piece from '../Piece'
import type Action from '../Action'

  // If this move was made,
  // it would be resolved to action.
interface ResolvableMove {
  move: Move,
  action: Action
}

interface ActionResolver {

  resolve: ( 
    board: Board,
    move: Move, 
    messageFn?: (s: String) => void
  ) => Action | null

  resolvableMoves: (
    board: Board,
    piece: Piece, 
    from: Position,
    ignoreCastling?: boolean // only relevant for king
  ) => ResolvableMove[]
}

export { type ActionResolver as default, type ResolvableMove }  
