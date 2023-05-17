import { makeObservable, observable, action } from 'mobx'

// For UI effects
interface Pulses {
  slow: boolean
  fast: boolean
}

class PulsesImpl implements Pulses {

  slow: boolean = false
  fast: boolean = false

  private _fastInterval: NodeJS.Timer | null = null
  private _slowInterval: NodeJS.Timer | null = null
  
  constructor() {

    makeObservable(this, {
      slow: observable,
      fast: observable
    })

    makeObservable<PulsesImpl, '_setFast' | '_setSlow'>(this, {
      _setSlow: action,
      _setFast: action
    })

  }

  initialize() {
    this._fastInterval = setInterval(() => {
      //console.log("TICK FAST")
      this._setFast(!this.fast)   
    }, 200)  
    this._slowInterval = setInterval(() => {
      //console.log("TICK SLOW")
      this._setSlow(!this.slow)   
    }, 500)  
  }


  dispose() {
    if (this._fastInterval) {
      clearInterval(this._fastInterval)
    }
    if (this._slowInterval) {
      clearInterval(this._slowInterval)
    }
  }

  _setFast(b: boolean) { this.fast = b }
  _setSlow(b: boolean) { this.slow = b }
}


export { type Pulses as default, PulsesImpl }
