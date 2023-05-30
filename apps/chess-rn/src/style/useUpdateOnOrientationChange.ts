
import { useEffect } from 'react'
import { reaction } from 'mobx'
import useForceUpdate from './useForceUpdate'
import { useViewport } from '~/services'

// https://stackoverflow.com/questions/46240647/how-to-force-a-functional-react-component-to-render/53837442#53837442
const useUpdateOnOrientationChange = (delay?: number) => {

  const forceUpdate = useForceUpdate() 
  const viewport = useViewport()

  useEffect(() => {
    return reaction(
      () => (
        viewport.landscape 
      ),
      (ignore) => {forceUpdate()},
      delay ? {scheduler: (run) => (setTimeout(run, delay))} : undefined

    )
  }, [])

}

export default useUpdateOnOrientationChange