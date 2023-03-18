import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'

import type { Action } from '@artemis-prime/chess-domain'

export interface Feedback {
  setFeedback(a: Action, enclosure?: any): void
  clear(): void
  action: Action | undefined
  enclosure: any | undefined
  tick: boolean
}

const FeedbackContext = React.createContext<Feedback | undefined>(undefined) 
 
export const useFeedback = (): Feedback =>  {
  return useContext(FeedbackContext) as Feedback
}

export const FeedbackProvider: React.FC< PropsWithChildren<{}>> = ({ children }) => {

  const intervalRef = useRef<any | undefined>(undefined)
  const [tick, setTick] = useState<boolean>(false)
  const [action, setAction] = useState<Action | undefined>(undefined)
  const [enclosure, setEnclosure] = useState<any | undefined>(undefined)

  const clear = (): void => { 
    setAction(undefined)
    setEnclosure(undefined)
  }

  const setFeedback = (a: Action, enc?: any): void => {
    setAction(a)
    setEnclosure(enc) 
  }

  useEffect(() => {

    const clearMe = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = undefined 
        setTick(false)
      }
    }
    if (action && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setTick((p) => (!p))
      }, 100)
    }
    else if (!action && intervalRef.current) {
      clearMe()
    }
    return clearMe
  }, [action])

  
  return (
    <FeedbackContext.Provider value={{
      setFeedback,
      clear,
      action,
      enclosure,
      tick
    }}>
      {children}
    </FeedbackContext.Provider>
  )
}

