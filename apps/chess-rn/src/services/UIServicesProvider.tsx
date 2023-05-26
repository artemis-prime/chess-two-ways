import React, {
  type PropsWithChildren,
  useEffect,
  useRef
} from 'react'

import { 
  autorun, 
  makeObservable, 
  observable, 
  action, 
} from 'mobx'

import useChess from './useChess'
import type ChessboardOrientation from './ChessboardOrientation'
import type Pulses from './Pulses'
import type MenuState from './MenuState'
import type ChalkboardState from './ChalkboardState'

interface UIServices  {
  pulses: Pulses
  menu: MenuState
  chessboardOrientation: ChessboardOrientation
  chalkboard: ChalkboardState
}

class ChessboardOrientationImpl implements ChessboardOrientation {

  whiteOnBottom = true
  autoOrientToCurrentTurn = false

  constructor() {
    makeObservable(this,{
      whiteOnBottom: observable,
      autoOrientToCurrentTurn: observable,
      setWhiteOnBottom: action.bound,
      setAutoOrientToCurrentTurn: action.bound,   
    }) 
  }
  
  setWhiteOnBottom(b: boolean) {
    this.whiteOnBottom = b
  }

  setAutoOrientToCurrentTurn(b: boolean) {
    this.autoOrientToCurrentTurn = b
  }
}

class MenuStateImpl implements MenuState {
  
  visible: boolean = false
  
  constructor() {
    makeObservable(this, {
      visible: observable,
      setVisible: action.bound 
    })
  }

  setVisible(b: boolean) { this.visible = b }
}

class ChalkboardStateImpl implements ChalkboardState {
  
  open: boolean = false
  
  constructor() {
    makeObservable(this, {
      open: observable,
      setOpen: action.bound 
    })
  }

  setOpen(b: boolean) { this.open = b }
}

class PulsesImpl implements Pulses {

  slow: boolean = false
  fast: boolean = false
  
  constructor() {
    makeObservable(this, {
      slow: observable,
      fast: observable,
      setFast: action,
      setSlow: action
    })
  }

  setFast(b: boolean) { this.fast = b }
  setSlow(b: boolean) { this.slow = b }
}

const UIServicesContext = React.createContext<UIServices | undefined>(undefined) 

const UIServicesProvider: React.FC< PropsWithChildren<{}>> = ({ children }) => {

  const pulsesRef = useRef<PulsesImpl>(new PulsesImpl())
  const chessboardOrientationRef = useRef<ChessboardOrientationImpl>(new ChessboardOrientationImpl())
  const menuStateRef = useRef<MenuStateImpl>(new MenuStateImpl())
  const chalkboardStateRef = useRef<ChalkboardStateImpl>(new ChalkboardStateImpl())

  const game = useChess()
  
  useEffect(() => {
    const fastID = setInterval(() => {
      pulsesRef.current.setFast(!pulsesRef.current.fast)   
    }, 200)  
    const slowID = setInterval(() => {
      pulsesRef.current.setSlow(!pulsesRef.current.slow)   
    }, 500)  
    const cleanupAutorun = autorun(
      () => {
        const b = chessboardOrientationRef.current
        if (b.autoOrientToCurrentTurn) {
          if (game.currentTurn === 'white') {
            b.setWhiteOnBottom(true)
          }
          else {
            b.setWhiteOnBottom(false)
          }
        }
      }, 
      { scheduler: (run) => (setTimeout(run, 300)) }
    )
  
    return () => {
      clearInterval(fastID)
      clearInterval(slowID)
      cleanupAutorun()
    }
  }, [])

  return (
    <UIServicesContext.Provider value={{
      menu: menuStateRef.current,
      pulses: pulsesRef.current,
      chessboardOrientation: chessboardOrientationRef.current,
      chalkboard: chalkboardStateRef.current
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

