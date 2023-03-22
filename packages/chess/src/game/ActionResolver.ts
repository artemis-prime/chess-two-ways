import type Board from '../board/Board'
import type Square from '../Square'
import type Action from '../Action'

interface ActionResolver {
  ( board: Board, from: Square, to: Square ): Action | undefined
}

export { type ActionResolver as default }  
