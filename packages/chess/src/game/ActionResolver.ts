import type Board from '../Board'
import type Square from '../Square'
import type Action from '../Action'
import type Console from '../Console'

interface ActionResolver {
  ( board: Board, from: Square, to: Square, con?: Console): Action | null
}

export { type ActionResolver as default }  
