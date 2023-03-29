import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'

import { 
  Action,
  ActionRecord,
  Move,
  Position,  
  Side, 
  actionRecordToLAN, 
  positionToString
} from '@artemis-prime/chess-core'

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
  message: string,
  type: string, 
  actionRecord?: ActionRecord 
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

  const _pushMessage = (m: ConsoleMessage): void => {
    if (m.type === 'mutable-warning') {
      const replace = messages.length > 0 && messages[messages.length - 1].type === m.type
      setMessages((prev) => {
        if (replace) {
          prev.pop()
        }
        return [...prev, m]
      })
    }
    else {
      setMessages((prev) => ([...prev, m]))
    }
  }

  const message = (m: string, type?: string): void => {
    _pushMessage({message: m, type: (type ? type : '')})
  } 

  const clearActionResolutionFeedback = (): void => { 
    _setAction(null)
    setNote(null)
  }

  const setActionResolutionFeedback = (a: Action, _note?: any): void => {
    _setAction(a)
    setNote(_note) 
  }

  const inCheck = (side: Side, kingPosition: Position, positionsInCheckFrom: Position[]): void => {
    setKingInCheck(kingPosition)
    setInCheckFrom(positionsInCheckFrom)
    let squareString = ''
    let commaFirst = false
    positionsInCheckFrom.forEach((s) => { 
      if (commaFirst) {
        squareString += ', ' 
      }
      else {
        commaFirst = true
      }
      squareString += positionToString(s)
    })

    _pushMessage({message: `Check! ${side} in check from ${squareString}!`, type: 'check'})
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
    _pushMessage({message: actionRecordToLAN(r), type: r.action, actionRecord: r}) 
  }

  const actionUndon = (r: ActionRecord): void => {
    _pushMessage({message: actionRecordToLAN(r), type: 'undo', actionRecord: r}) 
  }
  const actionRedon = (r: ActionRecord): void => {
    _pushMessage({message: actionRecordToLAN(r), type: 'redo', actionRecord: r}) 
  }

  useEffect(() => {
    game.listenTo({
      actionResolved,
      actionTaken,
      actionUndon,
      actionRedon,
      inCheck,
      notInCheck,
      message
    }, 'game-ui')
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

