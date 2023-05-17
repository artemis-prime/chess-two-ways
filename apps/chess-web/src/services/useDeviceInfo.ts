import { useContext } from 'react'

import type DeviceInfo from './DeviceInfo'
import { UIServicesContext, type UIServices } from './UIServicesProvider'

const useDeviceInfo = (): DeviceInfo =>  {
  return (useContext(UIServicesContext) as UIServices).deviceInfo 
}

export default useDeviceInfo
