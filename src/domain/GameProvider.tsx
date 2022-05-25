import React, {
  useContext,
  PropsWithChildren
 } from 'react'
 
 import type { Game }  from './Game'
 import GameInstance from './Game'
 import registry from './resolvers/registry'
 
 const GameContext = React.createContext<Game | undefined>(undefined) 
 
 export const useGame = (): Game =>  {
   return useContext(GameContext) as Game
 }
 
 const GameProvider: React.FC< PropsWithChildren<{}>> = ({ children }) => {
   
   return (
     <GameContext.Provider value={new GameInstance(registry)}>
       {children}
     </GameContext.Provider>
   )
 }

 export default GameProvider
 