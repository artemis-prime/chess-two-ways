import Game from './Game'
import Square from './Square'
import Action from './Action'

interface ActionResolver {
  ( game: Game, from: Square, to: Square ): Action | undefined
}

export default ActionResolver
