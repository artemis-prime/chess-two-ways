import { type Breakpoint } from '~/styles/media.stitches' 

interface DeviceInfo {
  breakpoint: Breakpoint | undefined
  updateWidth(w: number): void
  isWithin: (from: Breakpoint | null, to: Breakpoint | null) => boolean
}

export {
  type DeviceInfo as default,
  type Breakpoint
}