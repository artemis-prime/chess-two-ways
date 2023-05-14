import { 
  runInAction, 
  makeObservable, 
  observable,
  action 
} from 'mobx'

import { 
  type Action,
  ActionRecord,
  type Move,
  type Check,  
  type Side, 
  type GameStatus,
  type ChessListener,
  positionToString,
} from '@artemis-prime/chess-core'

import type ConsoleMessage from './ConsoleMessage'

const isTransient = (m: ConsoleMessage) => (
  m.type.includes('transient')
) 

class MessageStore implements ChessListener {

  messages: ConsoleMessage[] = []

  constructor() {
    makeObservable(this, {
      messages: observable,
      _pushMessage: action, 
      gameStatusChanged: action
    })
  }

  _pushMessage(m: ConsoleMessage): void {
    const overwriteTransient = this.messages.length > 0 && isTransient(this.messages[this.messages.length - 1])
    let push = true
    runInAction(() => {
      if (overwriteTransient) {
        this.messages.pop()
      }
      else if (m.type === 'check-message') {
        if (this.messages.length > 0 && this.messages[this.messages.length - 1].actionRecord) {
          this.messages[this.messages.length - 1].type += ' check-move'
        }
        push = false
      }
      else if (m.type === 'not-in-check') {
          // just assign the previous message my type,
          // since that was the move that resulted in taking me out of check.
        if (this.messages.length > 0) {
          if (this.messages[this.messages.length - 1].actionRecord) {
            this.messages[this.messages.length - 1].type += ' out-of-check-move'
          }
        } 
        push = false
      }
      if (isTransient(m)) {
          m.message = m.message ? `(${m.message})` : ''
      }
      if (push) {
        this.messages.push(m)
      }
    })
  }

  gameStatusChanged(s: GameStatus): void {
    if (s.state === 'new' || s.state === 'restored') {
      this.messages.length = 0
    }
    else if (s.state === 'checkmate' || s.state === 'stalemate' ) {
      this._pushMessage({message: '', type: 'transient-warning'}) 
    }
  }

  message(m: string, type?: string): void {
    this._pushMessage({message: m, type: (type ? type : '')})
  } 

  inCheck({side, from}: Check): void {
    let squareString = ''
    from.forEach((square, i) => { 
      if (i > 0) { squareString += ', ' }
      squareString += positionToString(square)
    })
    this._pushMessage({message: `from ${squareString}`, type: 'check-message', note: {side}})
  }

  notInCheck(side: Side): void {
    this._pushMessage({message: '', type: 'not-in-check'})
  }

  actionResolved(m: Move, action: Action | null): void { }

  actionTaken(r: ActionRecord): void {
    this._pushMessage({message: r.toLANString(), type: r.action, actionRecord: r}) 
  }

  actionsRestored(recs: readonly ActionRecord[]): void {
    recs.forEach((r) => {
      this._pushMessage({message: r.toLANString(), type: r.action, actionRecord: r}) 
    })
  }

  actionUndone(r: ActionRecord): void {
    this._pushMessage({message: r.toLANString(), type: 'undo', actionRecord: r}) 
  }
  actionRedone (r: ActionRecord): void {
    this._pushMessage({message: r.toLANString(), type: 'redo', actionRecord: r}) 
  }
}

export default MessageStore
