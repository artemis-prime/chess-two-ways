import React, {
  type PropsWithChildren,
  useEffect,
  useRef
} from 'react'

import useGame from './useGame'
import type BoardOrientation from './BoardOrientation'
import { BoardOrientationImpl } from './BoardOrientation'
import type Pulses from './Pulses'
import { PulsesImpl } from './Pulses'

import type TransientMessage from './TransientMessage'
import { TransientMessageImpl } from './TransientMessage'

interface UIServices  {
  pulses: Pulses
  boardOrientation: BoardOrientation
  transientMessage: TransientMessage
}

const UIServicesContext = React.createContext<UIServices | undefined>(undefined) 

const UIServicesProvider: React.FC<PropsWithChildren> = ({ children }) => {

  const game = useGame()
  const pulsesRef = useRef<PulsesImpl>(new PulsesImpl())
  const boardOrientationRef = useRef<BoardOrientationImpl>(new BoardOrientationImpl(game))
  const transientMessageRef = useRef<TransientMessageImpl>(new TransientMessageImpl(game))
  
  useEffect(() => {
    game.registerListener(transientMessageRef.current, 'chess-web-messages-store')
    boardOrientationRef.current.initialize()
    pulsesRef.current.initialize()
    transientMessageRef.current.initialize()
    return () => {
      game.unregisterListener('chess-web-messages-store')
      boardOrientationRef.current.dispose()
      pulsesRef.current.dispose()
      transientMessageRef.current.dispose()
    }
  }, [])

  return (
    <UIServicesContext.Provider value={{
      pulses: pulsesRef.current,
      transientMessage: transientMessageRef.current,
      boardOrientation: boardOrientationRef.current,
    }}>
      {children}
    </UIServicesContext.Provider>
  )
}

export {
  UIServicesProvider as default,
  UIServicesContext,
  type UIServices
}
