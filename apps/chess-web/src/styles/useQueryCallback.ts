import { useEffect } from 'react'

import { type MediaQuery, media } from './stitches.config'

const useQueryCallback = (
  query: MediaQuery,
  callback: () => void
): void => {

  useEffect(() => {
    const ml = matchMedia(media[query])
    const callbackWrapper = () => {
      if (ml.matches) { callback() }  
    }
    ml.addEventListener('change', callbackWrapper)
    return () => { ml.removeEventListener('change', callbackWrapper) }
  }, [])
}

export default useQueryCallback
