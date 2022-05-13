import React, {
  useContext,
  PropsWithChildren
 } from 'react'
 
 import type { GameService}  from './GameService'
 import gameServiceInst from './GameService'
 
 const GameServiceContext = React.createContext<GameService | undefined>(undefined) 
 
 export const useGameService = (): GameService =>  {
   return useContext(GameServiceContext) as GameService
 }
 
 const GameServiceProvider: React.FC< PropsWithChildren<{}>> = ({ children }) => {
   
   return (
     <GameServiceContext.Provider value={gameServiceInst}>
       {children}
     </GameServiceContext.Provider>
   )
 }

 export default GameServiceProvider
 