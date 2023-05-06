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

import useGame from './useGame'
import type BoardOrientation from './BoardOrientation'
import type Pulses from './Pulses'
import type MenuState from './MenuState'

interface UIServices  {
  pulses: Pulses
  menu: MenuState
  boardOrientation: BoardOrientation
}

class BoardOrientationImpl implements BoardOrientation {

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
  
  menuVisible: boolean = true
  
  constructor() {
    makeObservable(this, {
      menuVisible: observable,
      setMenuVisible: action.bound 
    })
  }

  setMenuVisible(b: boolean) { this.menuVisible = b }
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
  const boardOrientationRef = useRef<BoardOrientationImpl>(new BoardOrientationImpl())
  const menuStateRef = useRef<MenuStateImpl>(new MenuStateImpl())

  const game = useGame()
  
  useEffect(() => {
    const fastID = setInterval(() => {
      pulsesRef.current.setFast(!pulsesRef.current.fast)   
    }, 200)  
    const slowID = setInterval(() => {
      pulsesRef.current.setSlow(!pulsesRef.current.slow)   
    }, 500)  
      // autorun()'s cleanup function: https://mobx.js.org/reactions.html#always-dispose-of-reactions
    const cleanupAutorun = autorun(
      () => {
        const b = boardOrientationRef.current
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
      boardOrientation: boardOrientationRef.current
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

