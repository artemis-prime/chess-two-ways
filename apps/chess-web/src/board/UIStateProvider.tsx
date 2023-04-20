import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
  useRef
} from 'react'

import { runInAction, autorun, makeAutoObservable } from 'mobx'
import { useLocalObservable, observer } from 'mobx-react'

import { 
  Action,
  ActionRecord,
  Move,
  Check,  
  Side, 
  actionRecordToLAN, 
  positionToString,
  GameStatus
} from '@artemis-prime/chess-core'

import { useGame } from './GameProvider'

export interface BoardOrientation {
  whiteOnBottom: boolean,
  setWhiteOnBottom: (b: boolean) => void
  alternateBoard: boolean 
  setAlternateBoard: (b: boolean) => void
}

export interface Pulses {
  slow: boolean
  fast: boolean
}

export interface ConsoleMessage {
  message: string,
  type: string, 
  actionRecord?: ActionRecord,
  note?: any 
}

interface UIState extends BoardOrientation {
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

const UIStateContext = React.createContext<UIState | undefined>(undefined) 
 
export const useBoardOrientation = (): BoardOrientation =>  {
  return useContext(UIStateContext) as BoardOrientation
}

export const useMessages = (): ConsoleMessage[] =>  {
  return (useContext(UIStateContext) as UIState).messages
}

export const usePulses = (): Pulses =>  {
  return (useContext(UIStateContext) as UIState).pulses
}

const isTransient = (m: ConsoleMessage) => (
  m.type.includes('transient')
) 

const UIStateProvider: React.FC< PropsWithChildren<{}>> = observer(({ children }) => {

    // Using regular React state create odd race conditions.
    // I tried to make it work, but eventually just brought in the big guns!
  const messages = useLocalObservable<ConsoleMessage[]>(() => ([]))

  const [whiteOnBottom, setWhiteOnBottom] = useState<boolean>(true)

    // This allows us to keep all the listening in the single autorun below,
    // rather than combining react state and mobx state within an autorun / useEffect
    // combination where the useEffect fires dependant on other variables. This
    // needlessly creates / destroys many autorun instances. Better to just create it once
    // and listen for everything together :)
  const alternater = useLocalObservable(() => ({
    alternateBoard: false,
    setAlternateBoard(b: boolean) {
      this.alternateBoard = b
    }, 
  })) 

  const pulsesRef = useRef<PulsesImpl>(new PulsesImpl())
  
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
    if (alternater.alternateBoard) {
      if (game.currentTurn === 'white') {
        setWhiteOnBottom(true)
      }
      else {
        setWhiteOnBottom(false)
      }
    }
  }, {scheduler: (run) => (setTimeout(run, 300))})))


  const game = useGame()

  const _pushMessage = (m: ConsoleMessage): void => {
    const overwriteTransient = messages.length > 0 && isTransient(messages[messages.length - 1])
    let push = true
    runInAction(() => {
      if (overwriteTransient) {
        messages.pop()
      }
      else if (m.type === 'check-message') {
        if (messages.length > 0 && messages[messages.length - 1].actionRecord) {
          messages[messages.length - 1].type += ' check-move'
        }
        push = false
      }
      else if (m.type === 'not-in-check') {
          // just assign the previous message my type,
          // since that was the move that resulted in taking me out of check.
        if (messages.length > 0) {
          if (messages[messages.length - 1].actionRecord) {
            messages[messages.length - 1].type += ' out-of-check-move'
          }
        } 
        push = false
      }
      if (isTransient(m)) {
          m.message = m.message ? `(${m.message})` : ''
      }
      if (push) {
        messages.push(m)
      }
    })
  }


  const gameStatusChanged = (s: GameStatus): void => {

    if (s.state === 'new' || s.state === 'restored') {
      messages.length = 0
    }
    else if (s.state === 'checkmate' || s.state === 'stalemate' ) {
      _pushMessage({message: '', type: 'transient-warning'}) 
    }
  }

  const message = (m: string, type?: string): void => {
    _pushMessage({message: m, type: (type ? type : '')})
  } 

  const inCheck = ({side, from}: Check): void => {
    let squareString = ''
    from.forEach((square, i) => { 
      if (i > 0) { squareString += ', ' }
      squareString += positionToString(square)
    })
    _pushMessage({message: `from ${squareString}`, type: 'check-message', note: {side}})
  }

  const notInCheck = (side: Side): void => {
    _pushMessage({message: '', type: 'not-in-check'})
  }

  const actionResolved = (m: Move, action: Action | null): void => { }

  const actionTaken = (r: ActionRecord): void => {
    _pushMessage({message: actionRecordToLAN(r), type: r.action, actionRecord: r}) 
  }

  const actionsRestored = (recs: readonly ActionRecord[]): void => {
    recs.forEach((r) => {
      _pushMessage({message: actionRecordToLAN(r), type: r.action, actionRecord: r}) 
    })
  }

  const actionUndon = (r: ActionRecord): void => {
    _pushMessage({message: actionRecordToLAN(r), type: 'undo', actionRecord: r}) 
  }
  const actionRedon = (r: ActionRecord): void => {
    _pushMessage({message: actionRecordToLAN(r), type: 'redo', actionRecord: r}) 
  }

  useEffect(() => {
    game.registerListener({
      actionResolved,
      actionTaken,
      actionUndon,
      actionRedon,
      actionsRestored,
      inCheck,
      notInCheck,
      message,
      gameStatusChanged
    }, 'artemis-prime-chess-web-ui')
  })
  
  return (
    <UIStateContext.Provider value={{
      pulses: pulsesRef.current,
      messages,
      whiteOnBottom,
      setWhiteOnBottom,
      alternateBoard: alternater.alternateBoard, 
      setAlternateBoard: alternater.setAlternateBoard.bind(alternater)
    }}>
      {children}
    </UIStateContext.Provider>
  )
})

export default UIStateProvider

