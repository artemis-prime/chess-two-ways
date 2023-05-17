import React, { useEffect, type PropsWithChildren } from 'react'

import type { Game } from '@artemis-prime/chess-core'
import { getGameSingleton } from '@artemis-prime/chess-core'

const GameContext = React.createContext<Game | undefined>(undefined) 

const GameProvider: React.FC< PropsWithChildren<{}>> = ({ children }) => {

  useEffect(() => {
    const disposers = getGameSingleton().registerReactions()
    return () => { disposers.forEach((disposers) => {disposers()}) }
  }, [])
  
  return (
    <GameContext.Provider value={getGameSingleton()}>
      {children}
    </GameContext.Provider>
  )
}

export {
  GameProvider as default,
  GameContext
}
 