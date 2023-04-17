import React, {
  useContext,
  PropsWithChildren,
  useEffect,
  useRef
} from 'react'
import { observable } from 'mobx'

interface Pulses {
  slow: boolean
  fast: boolean 
}

const PulsesContext = React.createContext<Pulses | undefined>(undefined) 

export const usePulses = (): Pulses =>  {
  return useContext(PulsesContext) as Pulses
}

const PulsesProvider: React.FC<PropsWithChildren> = ({ children }) => {

  const pulsesRef = useRef<Pulses>(observable({
    fast: false,
    slow: false
  }))
  
  useEffect(() => {
    const fast = setInterval(() => {
      pulsesRef.current.fast = !pulsesRef.current.fast   
    }, 200)  
    const slow = setInterval(() => {
      pulsesRef.current.slow = !pulsesRef.current.slow   
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
 