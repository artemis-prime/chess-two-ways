import { useContext } from 'react'

import type Pulses from './Pulses'
import { PulsesContext } from './PulsesProvider'

const usePulses = (): Pulses =>  {
  return useContext(PulsesContext) as Pulses
}

export default usePulses

