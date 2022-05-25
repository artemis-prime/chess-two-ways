import React, {
  useContext,
  PropsWithChildren
} from 'react'

import {
  action,
  makeObservable, 
  observable, 
} from 'mobx'


export interface Feedback {
  set(type: string, note?: string): void
  clear(): void

  get(): string | undefined
  getNote(): string | undefined
}

class FeedbackImpl implements Feedback {

  private _type: string | undefined = undefined
  private _note: string | undefined = undefined

  constructor() {
    makeObservable(this, {
      set: action,
      clear: action
    })

      // https://mobx.js.org/observable-state.html#limitations
    makeObservable<FeedbackImpl, 
      '_type' |
      '_note'
    >(this, {
      _type: observable,
      _note: observable,
    })
  }

  set(type: string, note?: string): void {
    this._type = type
    if (note) {
      this._note = note
    }
  }

  clear(): void {
    this._type = undefined
    this._note = undefined
  }

  get(): string | undefined {
    return this._type
  }

  getNote(): string | undefined {
    return this._note
  }
}

const FeedbackContext = React.createContext<Feedback | undefined>(undefined) 
 
export const useFeedback = (): Feedback =>  {
  return useContext(FeedbackContext) as Feedback
}

export const FeedbackProvider: React.FC< PropsWithChildren<{}>> = ({ children }) => {
  
  return (
    <FeedbackContext.Provider value={new FeedbackImpl()}>
      {children}
    </FeedbackContext.Provider>
  )
}

