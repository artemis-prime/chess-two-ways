import { type Breakpoint } from '~/styles/media.stitches' 

interface DeviceInfo {
  breakpoint: Breakpoint
  updateWidth(w: number): void
}

export {
  type DeviceInfo as default,
  type Breakpoint
}