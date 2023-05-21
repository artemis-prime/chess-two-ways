import React, {
  type PropsWithChildren,
  useEffect,
  useRef
} from 'react'

import useChess from './useChess'
import type ChessboardOrientation from './ChessboardOrientation'
import { ChessboardOrientationImpl } from './ChessboardOrientation'
import type Pulses from './Pulses'
import { PulsesImpl } from './Pulses'

import type TransientMessage from './TransientMessage'
import { TransientMessageImpl } from './TransientMessage'

interface UIServices  {
  pulses: Pulses
  chessboardOrientation: ChessboardOrientation
  transientMessage: TransientMessage
}

const UIServicesContext = React.createContext<UIServices | undefined>(undefined) 

const UIServicesProvider: React.FC<PropsWithChildren> = ({ children }) => {

  const game = useChess()
  const pulsesRef = useRef<PulsesImpl>(new PulsesImpl())
  const chessboardOrientationRef = useRef<ChessboardOrientationImpl>(new ChessboardOrientationImpl(game))
  const transientMessageRef = useRef<TransientMessageImpl>(new TransientMessageImpl(game))
  
  useEffect(() => {
    game.registerListener(transientMessageRef.current, 'chess-web-messages-store')
    chessboardOrientationRef.current.initialize()
    pulsesRef.current.initialize()
    transientMessageRef.current.initialize()
    return () => {
      game.unregisterListener('chess-web-messages-store')
      chessboardOrientationRef.current.dispose()
      pulsesRef.current.dispose()
      transientMessageRef.current.dispose()
    }
  }, [])

  return (
    <UIServicesContext.Provider value={{
      pulses: pulsesRef.current,
      transientMessage: transientMessageRef.current,
      chessboardOrientation: chessboardOrientationRef.current,
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
