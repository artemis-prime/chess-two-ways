import { useContext } from 'react'

import type { Game } from '@artemis-prime/chess-core'
import { GameContext } from './GameProvider'

const useGame = (): Game =>  {
  return useContext(GameContext) as Game
}

export default useGame
