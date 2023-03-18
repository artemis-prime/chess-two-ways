import type Game from './Game'
import type Square from './Square'
import type Action from './Action'

interface ActionResolver {
  ( game: Game, from: Square, to: Square ): Action | undefined
}

export { type ActionResolver as default }  
