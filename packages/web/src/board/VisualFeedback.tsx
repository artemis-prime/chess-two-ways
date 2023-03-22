import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'

import type { 
  Action, 
  BoardSquare, 
  Square
} from '@artemis-prime/chess-domain'

import { useGame } from './GameProvider'

export interface VisualFeedback {
  //setAction(a: Action, note?: any): void
  //clear(): void
  kingInCheck: BoardSquare | undefined
  inCheckFrom: Square[]
  action: Action | undefined
  note: any | undefined
  fastTick: boolean
  slowTick: boolean
}

const VisualFeedbackContext = React.createContext<VisualFeedback | undefined>(undefined) 
 
export const useVisualFeedback = (): VisualFeedback =>  {
  return useContext(VisualFeedbackContext) as VisualFeedback
}

export const VisualFeedbackProvider: React.FC< PropsWithChildren<{}>> = ({ children }) => {

  const fastIntervalRef = useRef<any | undefined>(undefined)
  const slowIntervalRef = useRef<any | undefined>(undefined)

  const [fastTick, setFastTick] = useState<boolean>(false)
  const [slowTick, setSlowTick] = useState<boolean>(false)
  const [action, _setAction] = useState<Action | undefined>(undefined)
  const [note, setNote] = useState<any | undefined>(undefined)
  const [inCheckFrom, setInCheckFrom] = useState<Square[]>([])
  const [kingInCheck, setKingInCheck] = useState<BoardSquare | undefined>(undefined)

  const game = useGame()

  const inCheck = (kingInCheck_: BoardSquare | undefined, inCheckFrom_: Square[]): void => {
    setKingInCheck(kingInCheck_)
    setInCheckFrom(inCheckFrom_)
  }

  const actionResolved = (action: Action, from: Square, to: Square) => {
    setAction(action, {from, to})  
  }

  const actionTaken = (action: Action, from: Square, to: Square) => {
    clear()
  }

  useEffect(() => {
    game.setInCheckCallback(inCheck)
    game.setActionResolvedCallback(actionResolved)
    game.setActionTakenCallback(actionTaken)
  })

  const clear = (): void => { 
    _setAction(undefined)
    setNote(undefined)
  }

  const setAction = (a: Action, _note?: any): void => {
    _setAction(a)
    setNote(_note) 
  }

  useEffect(() => {

    const clearFast = () => {
      if (fastIntervalRef.current) {
        clearInterval(fastIntervalRef.current)
        fastIntervalRef.current = undefined 
        setFastTick(false)
      }
    }
    const clearSlow = () => {
      if (slowIntervalRef.current) {
        clearInterval(slowIntervalRef.current)
        slowIntervalRef.current = undefined 
        setSlowTick(false)
      }
    }
    const clearBoth = () => {
      clearFast()
      clearSlow()
    }

    if (action && !fastIntervalRef.current) {
      fastIntervalRef.current = setInterval(() => {
        setFastTick((p) => (!p))
      }, 100)
    }
    else if (!action && fastIntervalRef.current) {
      clearFast()
    }
    if (kingInCheck && !slowIntervalRef.current) {
      slowIntervalRef.current = setInterval(() => {
        setSlowTick((p) => (!p))
      }, 500)
    }
    else if (!kingInCheck && slowIntervalRef.current) {
      clearSlow()
    }
    
    return clearBoth
  }, [action, kingInCheck])

  
  return (
    <VisualFeedbackContext.Provider value={{
      //setAction,
      //clear,
      action,
      kingInCheck,
      inCheckFrom,
      note,
      fastTick,
      slowTick
    }}>
      {children}
    </VisualFeedbackContext.Provider>
  )
}

