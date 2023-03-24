import type Board from '../Board'
import type Square from '../Square'
import type Action from '../Action'

interface ActionResolver {
  ( board: Board, from: Square, to: Square ): Action | null
}

export { type ActionResolver as default }  
