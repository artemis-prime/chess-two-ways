import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'

import type { 
  Action,
  ActionRecord,
  Move,
  Position,  
  Side 
} from '@artemis-prime/chess-domain'

import { useGame } from './GameProvider'

export interface VisualFeedback {
  kingInCheck: Position | null
  inCheckFrom: Position[]
  action: Action | null
  note: any | null
  fastTick: boolean
  slowTick: boolean
  messages: ConsoleMessage[]
}

const VisualFeedbackContext = React.createContext<VisualFeedback | undefined>(undefined) 
 
export const useVisualFeedback = (): VisualFeedback =>  {
  return useContext(VisualFeedbackContext) as VisualFeedback
}

export interface ConsoleMessage {
  message: string
  note: any
}

export const VisualFeedbackProvider: React.FC< PropsWithChildren<{}>> = ({ children }) => {

  const fastIntervalRef = useRef<any>(undefined)
  const slowIntervalRef = useRef<any>(undefined)

  const [fastTick, setFastTick] = useState<boolean>(false)
  const [slowTick, setSlowTick] = useState<boolean>(false)
  const [action, _setAction] = useState<Action | null>(null)
  const [note, setNote] = useState<any | null>(null)
  const [inCheckFrom, setInCheckFrom] = useState<Position[]>([])
  const [kingInCheck, setKingInCheck] = useState<Position | null>(null)

  const [messages, setMessages] = useState<ConsoleMessage[]>([])

  const game = useGame()


  const message = (m: string, type_?: string): void => {
    setMessages((prev) => ([...prev, {
      message: (m) ? m : '',
      note: (type_) ? type_ : 'none'
    }]))
  } 

  const clearActionResolutionFeedback = (): void => { 
    _setAction(null)
    setNote(null)
  }

  const setActionResolutionFeedback = (a: Action, _note?: any): void => {
    _setAction(a)
    setNote(_note) 
  }

  const inCheck = (side: Side, kingInCheck_: Position, inCheckFrom_: Position[]): void => {
    setKingInCheck(kingInCheck_)
    setInCheckFrom(inCheckFrom_)
  }

  const notInCheck = (side: Side): void => {
    setKingInCheck(null)
    setInCheckFrom([])
  }

  const actionResolved = (m: Move, action: Action | null): void => {
    if (!action) {
      clearActionResolutionFeedback()  
    }
    else {
      const rooksToSpread: any = {}
      if (action === 'castle') {
        rooksToSpread.rooks = (m.to.file === 'g') 
          ? 
          {from: {file: 'h', rank: m.from.rank}, to: {file: 'f', rank: m.from.rank}} 
          : 
          {from: {file: 'a', rank: m.from.rank}, to: {file: 'd', rank: m.from.rank}}
      }
      setActionResolutionFeedback(action, {...m, ...rooksToSpread})  
    }
  }

  const actionTaken = (r: ActionRecord): void => {
    clearActionResolutionFeedback()
  }

  const actionUndon = (r: ActionRecord): void => {}
  const actionRedon = (r: ActionRecord): void => {}


  useEffect(() => {
    game.addChessListener({
      actionResolved,
      actionTaken,
      actionUndon,
      actionRedon,
      inCheck,
      notInCheck,
      message
    })
  })

  useEffect(() => {

    const clearFast = () => {
      if (fastIntervalRef.current) {
        clearInterval(fastIntervalRef.current)
        fastIntervalRef.current = null 
        setFastTick(false)
      }
    }
    const clearSlow = () => {
      if (slowIntervalRef.current) {
        clearInterval(slowIntervalRef.current)
        slowIntervalRef.current = null 
        setSlowTick(false)
      }
    }
    const clearBoth = () => {
      clearFast()
      clearSlow()
    }

    if (action && !fastIntervalRef.current) {
      setFastTick(true)
      fastIntervalRef.current = setInterval(() => {
        setFastTick((p) => (!p))
      }, 300)
    }
    else if (!action && fastIntervalRef.current) {
      clearFast()
    }
    if (kingInCheck && !slowIntervalRef.current) {
      setSlowTick(true)
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
      action,
      kingInCheck,
      inCheckFrom,
      note,
      fastTick,
      slowTick,
      messages
    }}>
      {children}
    </VisualFeedbackContext.Provider>
  )
}

