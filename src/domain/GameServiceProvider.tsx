import React, {
  useContext,
  PropsWithChildren
 } from 'react'
 
 import type { GameService }  from './GameService'
 import GameServiceImpl from './GameService'
 import resolverMap from './pieceResolvers/resolverMap'
 
 const GameServiceContext = React.createContext<GameService | undefined>(undefined) 
 
 export const useGameService = (): GameService =>  {
   return useContext(GameServiceContext) as GameService
 }
 
 const GameServiceProvider: React.FC< PropsWithChildren<{}>> = ({ children }) => {
   
   return (
     <GameServiceContext.Provider value={new GameServiceImpl(resolverMap)}>
       {children}
     </GameServiceContext.Provider>
   )
 }

 export default GameServiceProvider
 