import { 
  action, 
  makeObservable, 
  observable, 
} from 'mobx'
import { computedFn } from 'mobx-utils'

import { BREAKPOINTS } from '~/styles/media.stitches' 

import { type Breakpoint } from '~/styles/media.stitches' 

interface DeviceInfo {
  breakpoint: Breakpoint | undefined
  updateWidth(w: number): void
  isWithin: (from: Breakpoint | null, to: Breakpoint | null) => boolean
}

class DeviceInfoImpl implements DeviceInfo {
  
  breakpoint: Breakpoint | undefined = undefined

  constructor() {
    makeObservable(this,{
      breakpoint: observable,
      updateWidth: action.bound,
    }) 
  }

  isWithin = computedFn((from: Breakpoint | null, to: Breakpoint | null): boolean => {
    if (!this.breakpoint ) return false
    const breakpoints = Object.keys(BREAKPOINTS)
    const toTestIndex = breakpoints.indexOf(this.breakpoint)
    const fromIndex = (from === null) ? 0 : breakpoints.indexOf(from)
    const toIndex = (to === null) ? BREAKPOINTS.length - 1 : breakpoints.indexOf(to)
    return (toTestIndex >= fromIndex && toTestIndex <= toIndex)
  })

  updateWidth(w: number): void {
    const breakpoints = Object.keys(BREAKPOINTS)
    for (const bp of breakpoints) {
      if (BREAKPOINTS[bp] <= w) {
        if (this.breakpoint != bp) {
          this.breakpoint = bp
        }
      }
      else {
        break
      }
    }
  }
}


export {
  type DeviceInfo as default,
  type Breakpoint,
  DeviceInfoImpl
}