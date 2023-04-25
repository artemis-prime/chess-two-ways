import { useContext } from 'react'

import type ConsoleMessage from './ConsoleMessage'
import { UIServicesContext, type UIServices } from './UIServicesProvider'

const useMessages = (): ConsoleMessage[] => (
  (useContext(UIServicesContext) as UIServices).messages
)

export default useMessages
