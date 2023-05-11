import React, {
  type PropsWithChildren,
  useEffect,
  useState,
  useRef
} from 'react'

import { autorun, makeAutoObservable, action, makeObservable, observable, observe } from 'mobx'

import { BREAKPOINTS } from '~/styles/media.stitches' 

import useGame from './useGame'
import type BoardOrientation from './BoardOrientation'
import type ConsoleMessage from './ConsoleMessage'
import type Pulses from './Pulses'
import type DeviceInfo from './DeviceInfo'
import type { Breakpoint } from './DeviceInfo'

import MessagesStore from './MessagesStore'

interface UIServices  {
  pulses: Pulses
  messages: ConsoleMessage[]
  boardOrientation: BoardOrientation
  deviceInfo: DeviceInfo
}

class DeviceInfoImpl implements DeviceInfo {
  
  breakpoint: Breakpoint = 'zero'

  constructor() {
    makeObservable(this,{
      breakpoint: observable,
      updateWidth: action.bound,
    }) 
  }

  updateWidth(w: number): void {
    const breakpoints = Object.keys(BREAKPOINTS)
    for (const bp of breakpoints) {
      if (BREAKPOINTS[bp] <= w) {
        this.breakpoint = bp
      }
      else {
        break
      }
    }
  }
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
class PulsesImpl implements Pulses {

  slow: boolean = false
  fast: boolean = false
  
  constructor() {
    makeAutoObservable(this)
  }

  setFast(b: boolean) { this.fast = b }
  setSlow(b: boolean) { this.slow = b }
}


const UIServicesContext = React.createContext<UIServices | undefined>(undefined) 

const UIServicesProvider: React.FC<PropsWithChildren> = ({ children }) => {

  const pulsesRef = useRef<PulsesImpl>(new PulsesImpl())
  const boardOrientationRef = useRef<BoardOrientationImpl>(new BoardOrientationImpl())
  const messagesRef = useRef<MessagesStore>(new MessagesStore())
  const deviceInfoRef = useRef<DeviceInfo>(new DeviceInfoImpl())
  const game = useGame()
  
  useEffect(() => {
    const fast = setInterval(() => {
      pulsesRef.current.setFast(!pulsesRef.current.fast)   
    }, 200)  
    const slow = setInterval(() => {
      pulsesRef.current.setSlow(!pulsesRef.current.slow)   
    }, 500)  

    return () => {
      clearInterval(fast)
      clearInterval(slow)
    }
  }, [])

    // Note that autorun returns a cleanup function that deletes the created listener
    // This is advised by mobx docs: https://mobx.js.org/reactions.html
  useEffect(() => (autorun(() => {
    if (boardOrientationRef.current.autoOrientToCurrentTurn) {
      if (game.currentTurn === 'white') {
        boardOrientationRef.current.setWhiteOnBottom(true)
      }
      else {
        boardOrientationRef.current.setWhiteOnBottom(false)
      }
    }
  }, {scheduler: (run) => (setTimeout(run, 300))})), [])

  useEffect(() => {
    game.registerListener(messagesRef.current, 'chess-web-messages-store')
  }, [])
  
  return (
    <UIServicesContext.Provider value={{
      pulses: pulsesRef.current,
      messages: messagesRef.current.messages,
      boardOrientation: boardOrientationRef.current,
      deviceInfo: deviceInfoRef.current
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

