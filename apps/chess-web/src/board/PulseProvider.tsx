import React, {
  useContext,
  PropsWithChildren,
  useEffect,
  useRef
} from 'react'
import { makeAutoObservable } from 'mobx'

interface Pulses {
  slow: boolean
  fast: boolean
}

class PulsesInternal implements Pulses {
  slow: boolean = false
  fast: boolean = false
  
  constructor() {
    makeAutoObservable(this)
  }

  setFast(b: boolean) { this.fast = b }
  setSlow(b: boolean) { this.slow = b }
}

const PulsesContext = React.createContext<PulsesInternal | undefined>(undefined) 

export const usePulses = (): Pulses =>  {
  return useContext(PulsesContext) as Pulses
}

const PulsesProvider: React.FC<PropsWithChildren> = ({ children }) => {

  const pulsesRef = useRef<PulsesInternal>(new PulsesInternal())
  
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

  return (
    <PulsesContext.Provider value={pulsesRef.current}>
      {children}
    </PulsesContext.Provider>
  )
}

export default PulsesProvider
 