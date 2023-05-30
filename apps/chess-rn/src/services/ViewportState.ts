import { Dimensions } from 'react-native'
import { makeObservable, observable, action, computed } from 'mobx'

  // RN doesn't successfully export this... dunno wtf.
  // import { EmitterSubscription } from 'react-native/types'
  // TODO: submit issue and PR for this.
interface EmitterSubscription {
  remove: () => void
}

interface ViewportState {
  get w(): number
  get h(): number
  get landscape(): boolean
}

class ViewportStateImpl implements ViewportState {

  private _w: number
  private _h: number
  
  private _sub : EmitterSubscription | null = null

  constructor() {
    const dim = Dimensions.get('screen')
    this._w = dim.width
    this._h = dim.height

    makeObservable(this, {
      w: computed,
      h: computed,
      landscape: computed
    })
    makeObservable<ViewportStateImpl, '_w' | '_h' >(this, {
      _w: observable,
      _h: observable,
    })
  }

  get w(): number { return this._w }
  get h(): number { return this._h }
  get landscape(): boolean { return (this._w > this._h) }

  initialize() {
    this._sub = Dimensions.addEventListener('change', 
      action(({
        screen 
      }) => {
        this._w = screen.width
        this._h = screen.height
      })
    )  
  }

  dispose() {
    this._sub?.remove() 
  }
}

export {
  type ViewportState as default,
  ViewportStateImpl
}

