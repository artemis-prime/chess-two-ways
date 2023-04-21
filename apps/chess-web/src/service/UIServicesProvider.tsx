import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
  useRef
} from 'react'

import { autorun, makeAutoObservable } from 'mobx'
import { useLocalObservable } from 'mobx-react'

import useGame from './useGame'
import type BoardOrientation from './BoardOrientation'
import type ConsoleMessage from './ConsoleMessage'
import type Pulses from './Pulses'

import MessagesStore from './MessagesStore'

interface UIServices extends BoardOrientation {
  pulses: Pulses
  messages: ConsoleMessage[]
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

const UIServicesProvider: React.FC< PropsWithChildren<{}>> = ({ children }) => {

  const [whiteOnBottom, setWhiteOnBottom] = useState<boolean>(true)
  const pulsesRef = useRef<PulsesImpl>(new PulsesImpl())
  const messagesRef = useRef<MessagesStore>(new MessagesStore())
  const game = useGame()

    // This allows us to keep all the listening in the single autorun below,
    // rather than combining react state and mobx state within an autorun / useEffect
    // combination where the useEffect fires dependant on other variables. This
    // needlessly creates / destroys many autorun instances. Better to just create it once
    // and listen for everything together :)
  const autoOrienter = useLocalObservable(() => ({
    autoOrientToCurrentTurn: false,
    setAutoOrientToCurrentTurn(b: boolean) {
      this.autoOrientToCurrentTurn = b
    }, 
  })) 
  
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
    if (autoOrienter.autoOrientToCurrentTurn) {
      if (game.currentTurn === 'white') {
        setWhiteOnBottom(true)
      }
      else {
        setWhiteOnBottom(false)
      }
    }
  }, {scheduler: (run) => (setTimeout(run, 300))})))

  useEffect(() => {
    game.registerListener(messagesRef.current, 'chess-web-messages-store')
  })
  
  return (
    <UIServicesContext.Provider value={{
      pulses: pulsesRef.current,
      messages: messagesRef.current.messages,
      whiteOnBottom,
      setWhiteOnBottom,
      autoOrientToCurrentTurn: autoOrienter.autoOrientToCurrentTurn, 
      setAutoOrientToCurrentTurn: autoOrienter.setAutoOrientToCurrentTurn.bind(autoOrienter)
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

