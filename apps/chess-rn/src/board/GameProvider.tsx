import React, {
  useContext,
  PropsWithChildren
} from 'react'

import { type Game, getGameSingleton } from '@artemis-prime/chess-core'

const GameContext = React.createContext<Game | undefined>(undefined) 

export const useGame = (): Game =>  {
  return useContext(GameContext) as Game
}

const GameProvider: React.FC<PropsWithChildren> = ({ children }) => (
  <GameContext.Provider value={getGameSingleton()}>
    {children}
  </GameContext.Provider>
)

export default GameProvider
 