import { type Breakpoint } from '~/styles/media.stitches' 

interface DeviceInfo {
  breakpoint: Breakpoint
  updateWidth(w: number): void
  isWithin: (from: Breakpoint, to: Breakpoint) => boolean
  wasWithin: (from: Breakpoint, to: Breakpoint) => boolean
}

export {
  type DeviceInfo as default,
  type Breakpoint
}