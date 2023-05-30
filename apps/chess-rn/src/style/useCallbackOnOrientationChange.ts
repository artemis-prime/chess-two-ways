
import { useEffect } from 'react'
import { reaction } from 'mobx'
import { useViewport } from '~/services'

const useCallbackOnOrientationChange = (
  callback: (landscape: boolean) => void,
  delay?: number
) => {

  const viewport = useViewport()

  useEffect(() => {
    return reaction(
      () => (
        viewport.landscape 
      ),
      (landscape) => {callback(landscape)},
      delay ? {scheduler: (run) => (setTimeout(run, delay))} : undefined
    )
  }, [])

}

export default useCallbackOnOrientationChange