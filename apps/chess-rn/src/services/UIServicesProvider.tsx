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
import type MenuState from './MenuState'
import { MenuStateImpl } from './MenuState'
import type ChalkboardState from './ChalkboardState'
import { ChalkboardStateImpl } from './ChalkboardState'
import type ViewportState from './ViewportState'
import { ViewportStateImpl } from './ViewportState'

interface UIServices  {
  pulses: Pulses
  menu: MenuState
  chessboardOrientation: ChessboardOrientation
  chalkboard: ChalkboardState
  transientMessage: TransientMessage
  viewport: ViewportState
}

const UIServicesContext = React.createContext<UIServices | undefined>(undefined) 

const UIServicesProvider: React.FC< PropsWithChildren<{}>> = ({ children }) => {

  const game = useChess()

  const pulsesRef = useRef<PulsesImpl>(new PulsesImpl())
  const chessboardOrientationRef = useRef<ChessboardOrientationImpl>(new ChessboardOrientationImpl(game))
  const transientMessageRef = useRef<TransientMessageImpl>(new TransientMessageImpl(game))

  const menuStateRef = useRef<MenuStateImpl>(new MenuStateImpl())
  const chalkboardStateRef = useRef<ChalkboardStateImpl>(new ChalkboardStateImpl())
  const viewportRef = useRef<ViewportStateImpl>(new ViewportStateImpl())

  
  useEffect(() => {
    game.registerListener(transientMessageRef.current, 'chess-web-messages-store')
    chessboardOrientationRef.current.initialize()
    pulsesRef.current.initialize()
    transientMessageRef.current.initialize()
    viewportRef.current.initialize()
    return () => {
      game.unregisterListener('chess-web-messages-store')
      chessboardOrientationRef.current.dispose()
      pulsesRef.current.dispose()
      transientMessageRef.current.dispose()
      viewportRef.current.dispose()
    }
  }, [])

  return (
    <UIServicesContext.Provider value={{
      pulses: pulsesRef.current,
      transientMessage: transientMessageRef.current,
      chessboardOrientation: chessboardOrientationRef.current,
      menu: menuStateRef.current,
      chalkboard: chalkboardStateRef.current,
      viewport: viewportRef.current
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
