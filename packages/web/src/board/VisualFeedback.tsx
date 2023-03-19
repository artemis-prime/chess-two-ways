import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'

import type { Action } from '@artemis-prime/chess-domain'

export interface VisualFeedback {
  setAction(a: Action, note?: any): void
  clear(): void
  action: Action | undefined
  note: any | undefined
  tick: boolean
}

const VisualFeedbackContext = React.createContext<VisualFeedback | undefined>(undefined) 
 
export const useVisualFeedback = (): VisualFeedback =>  {
  return useContext(VisualFeedbackContext) as VisualFeedback
}

export const VisualFeedbackProvider: React.FC< PropsWithChildren<{}>> = ({ children }) => {

  const intervalRef = useRef<any | undefined>(undefined)
  const [tick, setTick] = useState<boolean>(false)
  const [action, _setAction] = useState<Action | undefined>(undefined)
  const [note, setNote] = useState<any | undefined>(undefined)

  const clear = (): void => { 
    _setAction(undefined)
    setNote(undefined)
  }

  const setAction = (a: Action, _note?: any): void => {
    _setAction(a)
    setNote(_note) 
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
    <VisualFeedbackContext.Provider value={{
      setAction,
      clear,
      action,
      note,
      tick
    }}>
      {children}
    </VisualFeedbackContext.Provider>
  )
}

