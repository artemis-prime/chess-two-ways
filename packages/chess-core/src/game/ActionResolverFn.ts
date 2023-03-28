import type Board from '../Board'
import type Position from '../Position'
import type Action from '../Action'

interface ActionResolverFn {
  ( 
    board: Board, 
    from: Position, 
    to: Position, 
    messageFn?: (s: String) => void
  ): Action | null
}

export { type ActionResolverFn as default }  
