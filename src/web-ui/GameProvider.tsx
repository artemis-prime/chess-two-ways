import React, {
  useContext,
  PropsWithChildren
 } from 'react'
 
 import type { Game }  from '../chess/Game'
 import GameImpl from '../chess/Game'
 import registry from '../chess/resolverRegistry'
 
 const GameContext = React.createContext<Game | undefined>(undefined) 
 
 export const useGame = (): Game =>  {
   return useContext(GameContext) as Game
 }
 
 const GameProvider: React.FC< PropsWithChildren<{}>> = ({ children }) => {
   
   return (
     <GameContext.Provider value={new GameImpl(registry)}>
       {children}
     </GameContext.Provider>
   )
 }

 export default GameProvider
 