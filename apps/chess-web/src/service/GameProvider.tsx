import React, { PropsWithChildren } from 'react'

import type { Game } from '@artemis-prime/chess-core'
import { getGameSingleton } from '@artemis-prime/chess-core'

const GameContext = React.createContext<Game | undefined>(undefined) 

const GameProvider: React.FC< PropsWithChildren<{}>> = ({ children }) => (
  <GameContext.Provider value={getGameSingleton()}>
    {children}
  </GameContext.Provider>
)

export {
  GameProvider as default,
  GameContext
}
 