import { 
  type Action, 
  type Board, 
  type Piece, 
  type Position, 
  type Move, 
  type Resolution,
} from '..'
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
  ) => Resolution[]
}

export { type ActionResolver as default }  
