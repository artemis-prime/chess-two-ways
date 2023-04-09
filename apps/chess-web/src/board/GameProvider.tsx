import React, {
  useContext,
  PropsWithChildren
} from 'react'

import type { Game } from '@artemis-prime/chess-core'
import { getGameSingleton } from '@artemis-prime/chess-core'

const GameContext = React.createContext<Game | undefined>(undefined) 

export const useGame = (): Game =>  {
  return useContext(GameContext) as Game
}

const GameProvider: React.FC< PropsWithChildren<{}>> = ({ children }) => {
  
  return (
    <GameContext.Provider value={getGameSingleton()}>
      {children}
    </GameContext.Provider>
  )
}

export default GameProvider
 