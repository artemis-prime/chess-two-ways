import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'

import { Action } from '../chess'
export interface Feedback {
  setAction(a: Action | undefined): void
  clear(): void
  action: Action | undefined
  tick: boolean
}

const FeedbackContext = React.createContext<Feedback | undefined>(undefined) 
 
export const useFeedback = (): Feedback =>  {
  return useContext(FeedbackContext) as Feedback
}

export const FeedbackProvider: React.FC< PropsWithChildren<{}>> = ({ children }) => {

  const intervalRef = useRef<any | undefined>(undefined)
  const [tick, setTick] = useState<boolean>(true)
  const [action, setAction] = useState<Action | undefined>(undefined)

  const clear = (): void => { setAction(undefined)}

  useEffect(() => {

    const clearMe = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = undefined 
        setTick(true)
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
      setAction,
      clear,
      action,
      tick
    }}>
      {children}
    </FeedbackContext.Provider>
  )
}

