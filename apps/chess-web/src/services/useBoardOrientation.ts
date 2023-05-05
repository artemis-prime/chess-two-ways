import { useContext } from 'react'

import type BoardOrientation from './BoardOrientation'
import { UIServicesContext, type UIServices } from './UIServicesProvider'

const useBoardOrientation = (): BoardOrientation =>  {
  return (useContext(UIServicesContext) as UIServices).boardOrientation 
}

export default useBoardOrientation
