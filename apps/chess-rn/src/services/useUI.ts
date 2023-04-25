import { useContext } from 'react'

import type UIState from './UIState'
import { UIServicesContext, type UIServices } from './UIServicesProvider'

const useUI = (): UIState =>  {
  return (useContext(UIServicesContext) as UIServices).ui
}
export default useUI
