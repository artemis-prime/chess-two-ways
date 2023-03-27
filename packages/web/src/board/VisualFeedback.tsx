import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'

import type { Action, Square, Piece, Side } from '@artemis-prime/chess-domain'

import { useGame } from './GameProvider'

export interface VisualFeedback {
  kingInCheck: Square | null
  inCheckFrom: Square[]
  action: Action | null
  note: any | null
  fastTick: boolean
  slowTick: boolean
}

const VisualFeedbackContext = React.createContext<VisualFeedback | undefined>(undefined) 
 
export const useVisualFeedback = (): VisualFeedback =>  {
  return useContext(VisualFeedbackContext) as VisualFeedback
}

export const VisualFeedbackProvider: React.FC< PropsWithChildren<{}>> = ({ children }) => {

  const fastIntervalRef = useRef<any>(undefined)
  const slowIntervalRef = useRef<any>(undefined)

  const [fastTick, setFastTick] = useState<boolean>(false)
  const [slowTick, setSlowTick] = useState<boolean>(false)
  const [action, _setAction] = useState<Action | null>(null)
  const [note, setNote] = useState<any | null>(null)
  const [inCheckFrom, setInCheckFrom] = useState<Square[]>([])
  const [kingInCheck, setKingInCheck] = useState<Square | null>(null)

  const game = useGame()

  const clearActionResolutionFeedback = (): void => { 
    _setAction(null)
    setNote(null)
  }

  const setActionResolutionFeedback = (a: Action, _note?: any): void => {
    _setAction(a)
    setNote(_note) 
  }

  const sideIsInCheck = (side: Side, kingInCheck_: Square, inCheckFrom_: Square[]): void => {
    setKingInCheck(kingInCheck_)
    setInCheckFrom(inCheckFrom_)
  }

  const sideIsNotInCheck = (side: Side): void => {
    setKingInCheck(null)
    setInCheckFrom([])
  }

  const actionResolved = (piece: Piece, from: Square, to: Square, action: Action | null): void => {
    if (!action) {
      clearActionResolutionFeedback()  
    }
    else {
      const rooksToSpread: any = {}
      if (action === 'castle') {
        rooksToSpread.rooks = (to.file === 'g') 
          ? 
          {from: {file: 'h', rank: from.rank}, to: {file: 'f', rank: from.rank}} 
          : 
          {from: {file: 'a', rank: from.rank}, to: {file: 'd', rank: from.rank}}
      }
      setActionResolutionFeedback(action, {piece, from, to, ...rooksToSpread})  
    }
  }

  const actionTaken = (piece: Piece, from: Square, to: Square, action: Action): void => {
    clearActionResolutionFeedback()
  }

  useEffect(() => {
    game.setChessListener({
      actionResolved,
      actionTaken,
      sideIsInCheck,
      sideIsNotInCheck
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
      slowTick
    }}>
      {children}
    </VisualFeedbackContext.Provider>
  )
}

